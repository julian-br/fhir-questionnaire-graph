import { Questionnaire, QuestionnaireItem } from "fhir/r4";

export class FHIRQuestionnaire {
  private data;
  private rootItems;
  private itemsMap;
  constructor(data: Questionnaire) {
    this.data = data;
    if (data.item === undefined) {
      throw new Error("this questionnaire has no items");
    }

    this.rootItems = data.item;

    const flatMappedItems = data.item.flatMap((item) => item.item ?? item);
    const allItems = [...data.item, ...flatMappedItems];
    const itemMap = new Map<string, QuestionnaireItem>();
    allItems.forEach((item) => itemMap.set(item.linkId, item));
    this.itemsMap = itemMap;
  }

  getRawData() {
    return this.data;
  }

  /**
   *
   * @returns all root items of the questionnaire
   */
  getAllRootItems() {
    return this.rootItems;
  }

  /**
   *
   * @returns the item matching the Id | undefined if the item does not exits
   */
  getItemById(itemId: string) {
    const matchingItem = this.itemsMap.get(itemId);
    if (matchingItem === undefined) {
      throw new Error(`no item with the linkId ${itemId}`);
    }
    return matchingItem;
  }

  getAllItems() {
    return Array.from(this.itemsMap.values());
  }

  /**
   * Gets all relevant items for an item.
   * This means all nested items and also all foreign items.
   * If the item has no nested items the item itself gets returned.
   */
  getRelevantItemsForItem(itemLinkId: string) {
    const item = this.getItemById(itemLinkId);
    if (item.item === undefined) {
      return [item];
    }

    const nestedItems = item.item;
    const foreignItems = this.getForeignItems(item.linkId);

    return nestedItems.concat(foreignItems);
  }

  getNestedItems(groupId: string) {
    if (this.itemIsGroup(groupId)) {
      const item = this.getItemById(groupId);
      return item!.item!;
    }
    return [];
  }

  getNestedItemsWithDependency(groupId: string) {
    if (!this.itemIsGroup(groupId)) {
      return [];
    }
    const item = this.getItemById(groupId)!;
    return item.item!.filter((item) => item.enableWhen !== undefined);
  }

  getForeignItems(groupId: string) {
    if (!this.itemIsGroup(groupId)) {
      return [];
    }
    const itemsWithDependency = this.getNestedItemsWithDependency(groupId);
    const uniqueForeignItems = new Set<QuestionnaireItem>();

    itemsWithDependency.forEach((item) => {
      const dependencyId = item.enableWhen![0].question;
      const dependencyIsForeign = !this.itemBelongsToGroup(
        dependencyId,
        groupId
      );
      const dependencyItem = this.getItemById(dependencyId);
      if (dependencyIsForeign && dependencyItem !== undefined) {
        uniqueForeignItems.add(dependencyItem);
      }
    });

    return Array.from(uniqueForeignItems.values());
  }

  getGroupOfItem(itemId: string) {
    for (const rootItem of this.rootItems) {
      if (this.itemIsGroup(rootItem.linkId)) {
        for (const nestedItem of rootItem.item!) {
          if (nestedItem.linkId === itemId) {
            return rootItem;
          }
        }
      }
    }
  }

  private itemBelongsToGroup(itemId: string, groupId: string) {
    if (!this.itemIsGroup(groupId)) {
      return false;
    }
    const allNestedItems = this.getNestedItems(groupId);

    return (
      allNestedItems.find((nestedItem) => nestedItem.linkId === itemId) !==
      undefined
    );
  }

  private itemIsGroup(itemId: string) {
    const item = this.getItemById(itemId);
    if (item?.type !== "group") {
      return false;
    }
    return true;
  }
}
