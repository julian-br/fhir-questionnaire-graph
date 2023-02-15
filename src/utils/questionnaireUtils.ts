import { Questionnaire, QuestionnaireItem } from "fhir/r4";

export function findItemInQuestionnaire(
  questionnaire: Questionnaire,
  itemLinkId: string
) {
  if (questionnaire.item === undefined) {
    return undefined;
  }

  for (const item of questionnaire.item) {
    const result = findItemInItem(item, itemLinkId);
    if (result !== undefined) {
      return result;
    }
  }
}

function findItemInItem(item: QuestionnaireItem, itemLinkId: string) {
  if (item.linkId === itemLinkId) {
    return item;
  }

  const subGroups = item.item;
  if (subGroups !== undefined) {
    for (const item of subGroups) {
      findItemInItem(item, itemLinkId);
    }
  }
}
