import { QuestionnaireItem, QuestionnaireItemAnswerOption } from "fhir/r4";
import { Edge } from "reactflow";
import { FHIRQuestionnaire } from "../../../fhir-questionnaire/FHIRQuestionnaire";

export function createEdgesFromQuestionnaire(
  questionnaire: FHIRQuestionnaire,
  itemLinkId: string
): Edge[] {
  const edges: Edge[] = [];

  const item = questionnaire.getItemById(itemLinkId);
  const nestedItems = questionnaire.getNestedItems(itemLinkId);

  if (item.answerOption !== undefined) {
    edges.push(...createEdgesForAnswerOptions(item.answerOption, itemLinkId));
  }
  const foreignItems = questionnaire.getForeignItems(itemLinkId);

  const allItems = nestedItems.concat(foreignItems);
  allItems.forEach((item) => {
    if (item.answerOption !== undefined) {
      edges.push(
        ...createEdgesForAnswerOptions(item.answerOption, item.linkId!)
      );
    }
  });

  const itemsWithDependency =
    questionnaire.getNestedItemsWithDependency(itemLinkId);
  itemsWithDependency.forEach((item) => {
    const dependencyItem = questionnaire.getItemById(
      item.enableWhen![0].question
    );

    edges.push(createEdgeForItem(item, dependencyItem));
  });

  return edges;
}

function createEdgeForItem(
  item: QuestionnaireItem,
  dependencyItem: QuestionnaireItem
) {
  return {
    id: dependencyItem.linkId + item.linkId,
    source: dependencyItem.linkId,
    target: item.linkId,
  };
}

function createEdgesForAnswerOptions(
  answerOptions: QuestionnaireItemAnswerOption[],
  itemLinkId: string
) {
  return answerOptions.map((answerOption) => ({
    id: itemLinkId + answerOption.id!,
    source: itemLinkId,
    target: answerOption.id!,
  }));
}
