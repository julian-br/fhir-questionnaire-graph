import { Questionnaire } from "fhir/r4";
import { findItemByLinkId } from "../../../utils/findItemByLinkId";
import { GraphItem } from "../components/Graph";
import { findGroupOfItem } from "./findGroupOfItem";

// TODO: refactor with firepath
export function getRelevantItemsForGraph(
  rootItemLinkId: string,
  questionnaire: Questionnaire
) {
  const item = findItemByLinkId(rootItemLinkId, questionnaire);
  if (item === undefined) return [];

  const relevantItems: GraphItem[] = item.item ?? [item];

  // add foreign dependencies
  relevantItems.forEach((relevantItem) => {
    relevantItem.enableWhen?.forEach((enableWhen) => {
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
