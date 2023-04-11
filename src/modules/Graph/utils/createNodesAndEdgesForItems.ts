import {
  QuestionnaireItem as GraphItems,
  QuestionnaireItem,
  QuestionnaireItemAnswerOption,
  QuestionnaireItemEnableWhen,
} from "fhir/r4";
import { Edge, Node } from "reactflow";
import { GraphItem } from "../components/Graph";
import { AnswerNodeData } from "../components/nodes/AnswerOptionNode";
import { ForeignItemNodeData } from "../components/nodes/ForeignItemNode";
import { ItemNodeData } from "../components/nodes/ItemNode";
import { findCorrectAnswerOptions } from "./findCorrectAnswerOptions";
import { getEnabledWhenValue } from "./getEnableWhenValue";
import { getAnswerOptionValue } from "./getAnswerOptionValue";

export type NodeData = ItemNodeData | AnswerNodeData | ForeignItemNodeData;

// this position will be overwritten as soon as the Graph is layouted
const DEFAULT_POSITION = {
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
    return itemLinkId + this.groupLinkId; // include groupLinkId and random string in each node id to prevent wrong memoization from ReactFlow
  }

  static generateAnswerOptionId(
    answerOption: QuestionnaireItemAnswerOption,
    ofItem: QuestionnaireItem
  ) {
    return (
      ofItem.linkId + getAnswerOptionValue(answerOption) + this.groupLinkId
    );
  }
}

//TODO: refactor
export function createNodesAndEdgesForItems(
  activeItemId: string,
  items: GraphItem[]
) {
  IdGenerator.setGroupLinkId(activeItemId);

  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];

  for (const item of items) {
    nodes.push(createNodeForItem(item, item.linkId === activeItemId));

    item.answerOption?.forEach((answerOption) => {
      nodes.push(createNodeForAnswerOption(answerOption, item));
      edges.push(createEdgeForAnswerOption(item, answerOption));
    });

    item.enableWhen?.forEach((enabledWhen) => {
      const dependencyItem = items.find(
        (item) => item.linkId === enabledWhen.question
      );

      if (dependencyItem === undefined) {
        throw new Error(
          `can not find dependency item with the id ${enabledWhen.question}`
        );
      }

      edges.push(
        ...createEdgeForDependecy({ enabledWhen, dependencyItem, item })
      );
    });
  }

  return [nodes, edges] as const;
}

function createNodeForItem(item: GraphItem, isActive = false): Node<NodeData> {
  return {
    id: IdGenerator.generateNodeId(item.linkId),
    width: NaN,
    data: item,
    type: item.foreignGroup ? "foreignItem" : "item",
    selected: isActive,
    position: DEFAULT_POSITION,
  };
}

function createNodeForAnswerOption(
  answerOption: QuestionnaireItemAnswerOption,
  ofItem: QuestionnaireItem
): Node {
  const answerOptionId = IdGenerator.generateAnswerOptionId(
    answerOption,
    ofItem
  );
  return {
    id: IdGenerator.generateNodeId(answerOptionId),
    width: NaN,
    data: {
      ...answerOption,
    },
    type: "answerOption",
    position: DEFAULT_POSITION,
  };
}

function createEdgeForDependecy({
  enabledWhen,
  item,
  dependencyItem,
}: {
  enabledWhen: QuestionnaireItemEnableWhen;
  item: GraphItems;
  dependencyItem: GraphItems;
}): Edge[] {
  if (dependencyItem.answerOption === undefined) {
    const label = `${enabledWhen.operator} ${getEnabledWhenValue(enabledWhen)}`;
    return [
      {
        id: IdGenerator.generateEdgeId(item.linkId, dependencyItem.linkId),
        source: IdGenerator.generateNodeId(dependencyItem.linkId),
        target: IdGenerator.generateNodeId(item.linkId),
        label: label,
        type: "dependency",
      },
    ];
  }

  const correctAnswerOptions = findCorrectAnswerOptions(
    dependencyItem.answerOption,
    enabledWhen
  );
  return correctAnswerOptions.map((option) => {
    const answerOptionId = IdGenerator.generateAnswerOptionId(
      option,
      dependencyItem
    );
    return {
      id: IdGenerator.generateEdgeId(answerOptionId, dependencyItem.linkId),
      source: IdGenerator.generateNodeId(answerOptionId),
      target: IdGenerator.generateNodeId(item.linkId),
      type: "dependency",
    };
  });
}

function createEdgeForAnswerOption(
  item: QuestionnaireItem,
  answerOption: QuestionnaireItemAnswerOption
): Edge {
  const answerOptionId = IdGenerator.generateAnswerOptionId(answerOption, item);
  return {
    id: IdGenerator.generateEdgeId(item.linkId, answerOptionId),
    source: IdGenerator.generateNodeId(item.linkId),
    target: IdGenerator.generateNodeId(answerOptionId),
    type: "answerOption",
  };
}
