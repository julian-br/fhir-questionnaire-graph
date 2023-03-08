import { Questionnaire } from "fhir/r4";

export function findItemByLinkId(linkId: string, questionnaire: Questionnaire) {
  const rootItems = questionnaire.item ?? [];
  for (const item of rootItems) {
    if (item.linkId === linkId) {
      return item;
    }

    const childItems = item.item;
    if (childItems !== undefined) {
      for (const childItem of childItems) {
        if (childItem.linkId === linkId) {
          return childItem;
        }
      }
    }
  }
}
