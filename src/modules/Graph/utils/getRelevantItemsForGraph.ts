import { Questionnaire } from "fhir/r4";
import { findItemByLinkId } from "../../../utils/findItemByLinkId";
import { GraphItem } from "../components/Graph";
import { findGroupOfItem } from "./findGroupOfItem";

// TODO: refactor
export function getRelevantItemsForGraph(
  itemLinkId: string,
  questionnaire: Questionnaire
) {
  if (questionnaire === undefined) return [];
  const item = findItemByLinkId(itemLinkId, questionnaire);
  const childItems = item?.item;
  if (childItems === undefined) return item ? [item] : [];

  const relevantItems: GraphItem[] = [...childItems];

  // add foreign dependencies
  childItems.forEach((childItem) => {
    childItem.enableWhen?.forEach((enableWhen) => {
      const itemIsAlreadyIncluded =
        relevantItems.find((item) => item.linkId === enableWhen.question) !==
        undefined;

      if (itemIsAlreadyIncluded) return;

      const foreignItem = findItemByLinkId(enableWhen.question, questionnaire);
      if (foreignItem === undefined) return;

      const groupOfForeignItem = findGroupOfItem(foreignItem, questionnaire);
      relevantItems.push({
        ...foreignItem,
        foreignGroup: {
          text: groupOfForeignItem?.text ?? foreignItem.text,
          linkId: groupOfForeignItem?.linkId ?? foreignItem.linkId,
        },
      });
    });
  });

  return relevantItems;
}
