import { QuestionnaireItem, QuestionnaireItemAnswerOption } from "fhir/r4";
import { Edge, Node } from "reactflow";
import { FHIRQuestionnaire } from "../../../fhir-questionnaire/FHIRQuestionnaire";
import { AnswerNodeData } from "../components/nodes/AnswerOptionNode";
import { ForeignItemNodeData } from "../components/nodes/ForeignItemNode";
import { ItemNodeData } from "../components/nodes/ItemNode";
import { findCorrespondingAnswerOptions } from "./findCorrespondingAnswerOptions";
import { getEnabledWhenValue } from "./getEnableWhenValue";

//TODO: refactor

export type NodeData = ItemNodeData | AnswerNodeData | ForeignItemNodeData;

// this position will be overwritten as soon as the Graph is layouted
const POSITION = {
  x: NaN,
  y: NaN,
};

class IdGenerator {
  private static groupLinkId: string = "";

  static setGroupLinkId(groupLinkId: string) {
    this.groupLinkId = groupLinkId;
  }

  static generateEdgeId(sourceLinkId: string, targetLinkId: string) {
    return sourceLinkId + targetLinkId + Math.random(); // add random number to prevent duplicate edge ids
  }

  static generateNodeId(itemLinkId: string) {
    return itemLinkId + this.groupLinkId; // include groupLinkId in each node id to prevent wrong memoization from ReactFlow
  }
}

export function createNodesAndEdgesFromQuestionnaire(
  questionnaire: FHIRQuestionnaire,
  groupLinkId: string
) {
  IdGenerator.setGroupLinkId(groupLinkId);
  const relevantItems = questionnaire.getRelevantItemsForItem(groupLinkId);

  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];

  for (const item of relevantItems) {
    if (item.answerOption !== undefined && item.answerOption.length !== 0) {
      const answerOptionNodes = createNodesForAnswerOptions(item.answerOption);
      nodes.push(...answerOptionNodes);
      const answerOptionEdges = createEdgesForAnswerOptions(
        item.answerOption,
        item.linkId
      );
      edges.push(...answerOptionEdges);
    }

    const itemGroupId = questionnaire.getGroupIdOfItem(item.linkId);
    const itemIsForeign = itemGroupId !== groupLinkId;
    if (itemIsForeign) {
      nodes.push(createNodeForForeignItem(item, itemGroupId));
    } else {
      nodes.push(createNodeForItem(item));
    }

    // create edges for dependencies
    const itemHasDepenedency = item.enableWhen !== undefined;
    if (!itemHasDepenedency) {
      continue;
    }

    const dependencyId = item.enableWhen![0].question;
    const dependencyItem = questionnaire.getItemById(dependencyId);
    const dependecyIsAnswerOption = dependencyItem.answerOption !== undefined;

    if (dependecyIsAnswerOption) {
      const correspondingOptions = findCorrespondingAnswerOptions(
        dependencyItem.answerOption!,
        item.enableWhen!
      );

      correspondingOptions.forEach((option) =>
        edges.push(createEdgeForItem(option.id!, item.linkId))
      );
    } else {
      const labelText =
        item.enableWhen![0].operator +
        "" +
        getEnabledWhenValue(item.enableWhen![0]);
      edges.push(createEdgeForItem(dependencyId, item.linkId, labelText));
    }
  }

  return [nodes, edges] as const;
}

function createNodeForItem(item: QuestionnaireItem): Node<NodeData> {
  return {
    id: IdGenerator.generateNodeId(item.linkId),
    width: NaN,
    data: {
      itemData: item,
    },
    type: "item",
    position: POSITION,
  };
}

function createNodeForForeignItem(
  item: QuestionnaireItem,
  foreignItemGroupId: string
) {
  return {
    id: IdGenerator.generateNodeId(item.linkId),
    width: NaN,
    data: {
      foreignItemGroupId,
      itemData: item,
    },
    /*     selectable: false, */
    focusable: false,
    type: "foreignItem",
    position: POSITION,
  };
}

function createNodesForAnswerOptions(
  answerOptions: QuestionnaireItemAnswerOption[]
): Node[] {
  return answerOptions.map((answerOption) => {
    if (answerOption.id === undefined) {
      throw new Error(
        `the answer option ${JSON.stringify(answerOption)} has no valid id`
      );
    }

    return {
      id: IdGenerator.generateNodeId(answerOption.id),
      width: NaN,
      data: {
        ...answerOption,
      },
      type: "answerOption",
      position: POSITION,
    };
  });
}

function createEdgeForItem(
  sourceItemLinkId: string,
  targetLinkId: string,
  label?: string
): Edge {
  return {
    id: IdGenerator.generateEdgeId(sourceItemLinkId, targetLinkId),
    source: IdGenerator.generateNodeId(sourceItemLinkId),
    target: IdGenerator.generateNodeId(targetLinkId),
    label: label,
  };
}

function createEdgesForAnswerOptions(
  answerOptions: QuestionnaireItemAnswerOption[],
  itemLinkId: string
): Edge[] {
  return answerOptions.map((answerOption) => ({
    id: IdGenerator.generateEdgeId(itemLinkId, answerOption.id!),
    source: IdGenerator.generateNodeId(itemLinkId),
    target: IdGenerator.generateNodeId(answerOption.id!),
  }));
}
