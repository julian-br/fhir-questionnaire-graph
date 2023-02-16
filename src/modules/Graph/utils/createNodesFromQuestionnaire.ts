import { QuestionnaireItem, QuestionnaireItemAnswerOption } from "fhir/r4";
import { Node } from "reactflow";
import { FHIRQuestionnaire } from "../../../fhir-questionnaire/FHIRQuestionnaire";
import { NodeData } from "../components/DefaultNode";

const NODE_WIDTH = 350;

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
    return [createNodeFromItem(item)];
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

  const itemsOfTypeChoice = allItems.filter(
    (item) => item.type === "choice" || item.type === "open-choice"
  );

  const answerOptionsNodes: any[] = [];
  itemsOfTypeChoice.forEach((item) => {
    const createdNodes = createNodesFromAnswerOptions(
      item.answerOption!,
      item.linkId
    );
    answerOptionsNodes.push(...createdNodes);
  });
  console.log(answerOptionsNodes);

  return [...nestedItemsNodes, ...foreignItemsNodes, ...answerOptionsNodes];
}

function createNodeFromItem(
  item: QuestionnaireItem,
  isForeign: boolean = false,
  foreignItemGroupId?: string
): Node<NodeData> {
  return {
    id: item.linkId,
    width: NODE_WIDTH,
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
  answerOptions: QuestionnaireItemAnswerOption[],
  itemLinkId: string
) {
  return answerOptions.map((answerOption) => ({
    id: itemLinkId + answerOption.id,
    width: NODE_WIDTH,
    data: {
      ...answerOption,
    },
    type: "default",
    position: POSITION,
  }));
}
