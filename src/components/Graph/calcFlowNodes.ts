import { QuestionnaireItem } from "fhir/r4";
import { Edge, Node } from "reactflow";
import { FHIRQuestionnaire } from "../../fhir-questionnaire/FHIRQuestionnaire";

const INITIAL_CANVAS_WIDTH = 2000;
const INITIAL_CANVAS_HEIGHT = 2000;

const NODE_WIDTH = 350;

export function createNodes(
  questionnaire: FHIRQuestionnaire,
  itemLinkId: string
) {
  const nestedItems = questionnaire.getNestedItems(itemLinkId);

  if (nestedItems.length === 0) {
    const item = questionnaire.getItemById(itemLinkId);
    return [createNodeFromItem(item!)];
  }

  const foreignItems = questionnaire.getForeignDependendNestedItems(itemLinkId);
  const foreignItemsNodes = foreignItems.map((foreignItem) => {
    const foreignItemGroupId = questionnaire.getGroupIdOfItem(
      foreignItem.linkId
    );
    return createNodeFromItem(foreignItem, true, foreignItemGroupId);
  });

  const nestedItemsNodes = nestedItems.map((nestedItem) =>
    createNodeFromItem(nestedItem)
  );

  return [...nestedItemsNodes, ...foreignItemsNodes];
}

function createNodeFromItem(
  item: QuestionnaireItem,
  isForeign: boolean = false,
  foreignItemGroupId?: string
): Node {
  return {
    id: item.linkId,
    data: {
      label: item.prefix + item.text,
    },
    /* data: {
      ...item,
      isForeign,
      foreignItemGroupId,
    }, */
    position: {
      x: NaN,
      y: NaN,
    },
  };
}

export function createEdges(
  questionnaire: FHIRQuestionnaire,
  itemLinkId: string
): Edge[] {
  const nestedItemsWithDependency =
    questionnaire.getNestedItemsWithDependency(itemLinkId);

  return nestedItemsWithDependency.map((itemWithDependency) => {
    return {
      id: itemWithDependency.linkId,
      source: itemWithDependency.enableWhen![0].question,
      target: itemWithDependency.linkId,
    };
  });
}
