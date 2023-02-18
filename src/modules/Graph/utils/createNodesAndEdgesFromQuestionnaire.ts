import { QuestionnaireItem, QuestionnaireItemAnswerOption } from "fhir/r4";
import { Edge, Node } from "reactflow";
import { FHIRQuestionnaire } from "../../../fhir-questionnaire/FHIRQuestionnaire";
import { AnswerNodeData } from "../components/nodes/AnswerOptionNode";
import { ForeignItemNodeData } from "../components/nodes/ForeignItemNode";
import { ItemNodeData } from "../components/nodes/ItemNode";
import { findCorrespondingAnswerOptions } from "./findCorrespondingAnswerOptions";

export type NodeData = ItemNodeData | AnswerNodeData | ForeignItemNodeData;

// this position will be overwritten as soon as the Graph is layouted
const POSITION = {
  x: NaN,
  y: NaN,
};

export function createNodesAndEdgesFromQuestionnaire(
  questionnaire: FHIRQuestionnaire,
  itemLinkId: string
) {
  const relevantItems = questionnaire.getRelevantItemsForItem(itemLinkId);

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
    const itemIsForeign = itemGroupId !== itemLinkId;
    if (itemIsForeign) {
      nodes.push(createNodeForItem(item, true, itemGroupId));
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
      edges.push(createEdgeForItem(dependencyId, item.linkId));
    }
  }

  return [nodes, edges] as const;
}

function createNodeForItem(
  item: QuestionnaireItem,
  isForeign: boolean = false,
  foreignItemGroupId?: string
): Node<NodeData> {
  if (isForeign) {
    return {
      id: item.linkId,
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

  return {
    id: item.linkId,
    width: NaN,
    data: {
      itemData: item,
    },
    type: "item",
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
      id: answerOption.id,
      width: NaN,
      data: {
        ...answerOption,
      },
      type: "answerOption",
      position: POSITION,
    };
  });
}

function createEdgeForItem(sourceLinkId: string, targetLinkId: string) {
  return {
    id: generateEdgeId(sourceLinkId, targetLinkId),
    source: sourceLinkId,
    target: targetLinkId,
  };
}

function createEdgesForAnswerOptions(
  answerOptions: QuestionnaireItemAnswerOption[],
  itemLinkId: string
) {
  return answerOptions.map((answerOption) => ({
    id: generateEdgeId(itemLinkId, answerOption.id!),
    source: itemLinkId,
    target: answerOption.id!,
  }));
}

/**
 * generates a unique id for each edge
 */
function generateEdgeId(sourceLinkId: string, targetLinkId: string) {
  return sourceLinkId + targetLinkId + Math.random(); // add random number to prevent duplicate edge ids
}
