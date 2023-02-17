import { QuestionnaireItem, QuestionnaireItemAnswerOption } from "fhir/r4";
import { Node } from "reactflow";
import { FHIRQuestionnaire } from "../../../fhir-questionnaire/FHIRQuestionnaire";
import { AnswerNodeData } from "../components/AnswerOptionNode";
import { DefaultNodeData } from "../components/DefaultNode";

export type NodeData = DefaultNodeData | AnswerNodeData;

// this position will be overwritten as soon as the Graph is layouted
const POSITION = {
  x: NaN,
  y: NaN,
};

export function createNodesFromQuestionnaire(
  questionnaire: FHIRQuestionnaire,
  itemLinkId: string
) {
  const nestedItems = questionnaire.getNestedItems(itemLinkId);
  const itemIsGroup = nestedItems.length !== 0;
  if (!itemIsGroup) {
    const item = questionnaire.getItemById(itemLinkId);
    return [
      createNodeFromItem(item),
      ...createNodesFromAnswerOptions(item.answerOption ?? []),
    ];
  }

  const nestedItemsNodes = nestedItems.map((nestedItem) =>
    createNodeFromItem(nestedItem)
  );

  const foreignItems = questionnaire.getForeignItems(itemLinkId);
  const foreignItemsNodes = foreignItems.map((foreignItem) => {
    const foreignItemGroupId = questionnaire.getGroupIdOfItem(
      foreignItem.linkId
    );
    return createNodeFromItem(foreignItem, true, foreignItemGroupId);
  });

  const allItems = nestedItems.concat(foreignItems);

  const itemsWithAnswerOption = allItems.filter(
    (item) => item.answerOption !== undefined
  );

  const answerOptionsNodes: Node[] = [];
  itemsWithAnswerOption.forEach((item) => {
    answerOptionsNodes.push(
      ...createNodesFromAnswerOptions(item.answerOption!)
    );
  });

  return [...nestedItemsNodes, ...foreignItemsNodes, ...answerOptionsNodes];
}

function createNodeFromItem(
  item: QuestionnaireItem,
  isForeign: boolean = false,
  foreignItemGroupId?: string
): Node<NodeData> {
  return {
    id: item.linkId,
    width: NaN,
    data: {
      isForeign,
      foreignItemGroupId,
      itemData: item,
    },
    type: "customDefault",
    position: POSITION,
  };
}

function createNodesFromAnswerOptions(
  answerOptions: QuestionnaireItemAnswerOption[]
) {
  return answerOptions.map((answerOption) => ({
    id: answerOption.id!,
    width: NaN,

    data: {
      ...answerOption,
    },
    type: "answerOption",
    position: POSITION,
  }));
}
