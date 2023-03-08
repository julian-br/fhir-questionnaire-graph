import { Questionnaire, QuestionnaireItem } from "fhir/r4";

export function findGroupOfItem(
  item: QuestionnaireItem,
  questionnaire: Questionnaire
) {
  const itemLinkId = item.linkId;
  for (const item of questionnaire.item ?? []) {
    if (item.item?.find((childItem) => childItem.linkId === itemLinkId)) {
      return item;
    }
  }
}
