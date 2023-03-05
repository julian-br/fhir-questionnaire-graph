import { Questionnaire, QuestionnaireItem } from "fhir/r4";
import { findItemByLinkId } from "../../../utils/findItemByLinkId";

export function getRelevantItemsForGraph(
  itemLinkId: string,
  questionnaire: Questionnaire
) {
  if (questionnaire === undefined) return [];
  const item = findItemByLinkId(itemLinkId, questionnaire);
  const childItems = item?.item;
  if (childItems === undefined) return item ? [item] : [];

  const relevantItems: QuestionnaireItem[] = [];

  childItems.forEach((childItem) => {
    relevantItems.push(childItem);
    childItem.enableWhen?.forEach((enableWhen) => {
      const dependecyIsForeign =
        childItems.find((item) => item.id === enableWhen.question) ===
        undefined;
      if (dependecyIsForeign) {
        const foreignItem = findItemByLinkId(
          enableWhen.question,
          questionnaire
        );
        if (foreignItem !== undefined) {
          relevantItems.push(foreignItem);
        }
      }
    });
  });

  return relevantItems;
}
