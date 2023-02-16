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
    width: 200,
    data: {
      itemData: item,
    },
    /* data: {
      ...item,
      isForeign,
      foreignItemGroupId,
    }, */
    type: "custom",
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
    const edge = {
      id:
        itemWithDependency.linkId + itemWithDependency.enableWhen![0].question,
      source: itemWithDependency.enableWhen![0].question,
      target: itemWithDependency.linkId,
    };

    console.log(edge);
    return edge;
  });
}
