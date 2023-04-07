import { Questionnaire, QuestionnaireItem } from "fhir/r4";
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

  if (item.type === "group") {
    return findReleventItemsForGroup(item, questionnaire);
  }

  return findRelevantItemsForSingleQuestion(item, questionnaire);
}

function findRelevantItemsForSingleQuestion(
  item: QuestionnaireItem,
  questionnaire: Questionnaire
) {
  const groupOfItem = findGroupOfItem(item, questionnaire);
  const relevantItems: GraphItem[] = [];
  const itemsToAddDependeciesFor = [item];

  while (itemsToAddDependeciesFor.length > 0) {
    const currentItem = itemsToAddDependeciesFor.shift()!;
    const groupOfCurrentItem = findGroupOfItem(currentItem, questionnaire);
    const itemIsForeign = groupOfCurrentItem !== groupOfItem;

    if (itemIsForeign && groupOfCurrentItem !== undefined) {
      relevantItems.push({
        ...currentItem,
        foreignGroup: {
          linkId: groupOfCurrentItem.linkId,
          text: groupOfCurrentItem.text,
        },
      });
    } else {
      relevantItems.push(currentItem);
    }
    currentItem.enableWhen?.forEach((enabledWhen) => {
      const dependency = findItemByLinkId(enabledWhen.question, questionnaire);

      if (dependency === undefined) {
        throw new Error(
          `dependency can't be added: no item with the id ${enabledWhen.question}`
        );
      }

      itemsToAddDependeciesFor.push(dependency);
    });
  }
  return relevantItems;
}

function findReleventItemsForGroup(
  groupItem: QuestionnaireItem,
  questionnaire: Questionnaire
) {
  const relevantItems: GraphItem[] = [...groupItem.item!];

  // add foreign dependencies
  relevantItems.forEach((relevantItem) => {
    relevantItem.enableWhen?.forEach((enableWhen) => {
      const itemIsAlreadyIncluded =
        relevantItems.find((item) => item.linkId === enableWhen.question) !==
        undefined;

      if (itemIsAlreadyIncluded) return;

      const foreignItem = findItemByLinkId(enableWhen.question, questionnaire);
      if (foreignItem === undefined) {
        throw new Error(`no item with the id ${enableWhen.question}`);
      }

      relevantItems.push(
        ...findRelevantItemsForSingleQuestion(relevantItem, questionnaire)
      );
    });
  });

  return relevantItems;
}
