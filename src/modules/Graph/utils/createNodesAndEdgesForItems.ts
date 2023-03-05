import {
  QuestionnaireItem,
  QuestionnaireItemAnswerOption,
  QuestionnaireItemEnableWhen,
} from "fhir/r4";
import { Edge, Node } from "reactflow";
import { AnswerNodeData } from "../components/nodes/AnswerOptionNode";
import { ForeignItemNodeData } from "../components/nodes/ForeignItemNode";
import { ItemNodeData } from "../components/nodes/ItemNode";
import { findCorrectAnswerOptions } from "./findCorrectAnswerOptions";
import { getEnabledWhenValue } from "./getEnableWhenValue";

export type NodeData = ItemNodeData | AnswerNodeData | ForeignItemNodeData;

// this position will be overwritten as soon as the Graph is layouted
const POSITION = {
  x: NaN,
  y: NaN,
};

class IdGenerator {
  private static groupLinkId: string = "";
  private static randomString: string = "";

  static setGroupLinkId(groupLinkId: string) {
    this.groupLinkId = groupLinkId;
    this.randomString = Math.random().toString() + Date.now();
  }

  static generateEdgeId(sourceLinkId: string, targetLinkId: string) {
    return sourceLinkId + targetLinkId + Math.random(); // add random number to prevent duplicate edge ids
  }

  static generateNodeId(itemLinkId: string) {
    return itemLinkId + this.groupLinkId + this.randomString; // include groupLinkId and random string in each node id to prevent wrong memoization from ReactFlow
  }
}

//TODO: refactor
export function createNodesAndEdgesForItems(
  groupLinkId: string,
  items: QuestionnaireItem[]
) {
  IdGenerator.setGroupLinkId(groupLinkId);

  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];

  for (const item of items) {
    nodes.push(createNodeForItem(item));

    item.answerOption?.forEach((answerOption) => {
      nodes.push(createNodeForAnswerOption(answerOption));
      edges.push(createEdgeForAnswerOption(item.linkId, answerOption));
    });

    item.enableWhen?.forEach((enabledWhen) => {
      const dependencyItem = items.find(
        (item) => item.linkId === enabledWhen.question
      )!;
      edges.push(
        ...createEdgeForDependecy({ enabledWhen, dependencyItem, item })
      );
    });
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

function createNodeForAnswerOption(
  answerOption: QuestionnaireItemAnswerOption
): Node {
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
}

function createEdgeForDependecy({
  enabledWhen,
  item,
  dependencyItem,
}: {
  enabledWhen: QuestionnaireItemEnableWhen;
  item: QuestionnaireItem;
  dependencyItem: QuestionnaireItem;
}): Edge[] {
  if (dependencyItem.answerOption === undefined) {
    const label = `${enabledWhen.operator} ${getEnabledWhenValue(enabledWhen)}`;
    return [
      {
        id: IdGenerator.generateEdgeId(item.linkId, dependencyItem.linkId),
        source: IdGenerator.generateNodeId(dependencyItem.linkId),
        target: IdGenerator.generateNodeId(item.linkId),
        label: label,
        type: "custom",
      },
    ];
  }

  const correctAnswerOptions = findCorrectAnswerOptions(
    dependencyItem.answerOption,
    enabledWhen
  );

  return correctAnswerOptions.map((option) => ({
    id: IdGenerator.generateEdgeId(option.id!, dependencyItem.linkId),
    source: IdGenerator.generateNodeId(option.id!),
    target: IdGenerator.generateNodeId(item.linkId),
    type: "custom",
  }));
}

function createEdgeForAnswerOption(
  itemLinkId: string,
  answerOption: QuestionnaireItemAnswerOption
): Edge {
  if (answerOption.id === undefined) {
    throw new Error(
      `the answer option ${JSON.stringify(answerOption)} has no valid id`
    );
  }

  return {
    id: IdGenerator.generateEdgeId(itemLinkId, answerOption.id),
    source: IdGenerator.generateNodeId(itemLinkId),
    target: IdGenerator.generateNodeId(answerOption.id!),
    type: "custom",
  };
}
