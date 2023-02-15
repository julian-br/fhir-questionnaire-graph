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
   * @returns the item matching the linkId | undefined if the item does not exits
   */
  getItemByLinkId(itemLinkId: string) {
    return this.itemsMap.get(itemLinkId);
  }

  getNestedItems(groupItemLinkId: string) {
    const item = this.getItemByLinkId(groupItemLinkId);
    if (item?.type !== "group") {
      return [];
    }
    return item.item!;
  }

  getNestedItemsWithDependency(groupItemLinkId: string) {
    if (!this.itemIsGroupItem(groupItemLinkId)) {
      return [];
    }
    const item = this.getItemByLinkId(groupItemLinkId)!;
    return item.item!.filter((item) => item.enableWhen !== undefined);
  }

  getForeignDependendNestedItems(groupItemLinkId: string) {
    if (!this.itemIsGroupItem(groupItemLinkId)) {
      return [];
    }
    const itemsWithDependency =
      this.getNestedItemsWithDependency(groupItemLinkId);
    const uniqueForeignItems = new Set<QuestionnaireItem>();

    itemsWithDependency.forEach((item) => {
      const dependencyId = item.enableWhen![0].question;
      const dependencyIsForeign = !this.itemBelongsToGroup(
        dependencyId,
        groupItemLinkId
      );
      const dependencyItem = this.getItemByLinkId(dependencyId);
      if (dependencyIsForeign && dependencyItem !== undefined) {
        uniqueForeignItems.add(dependencyItem);
      }
    });

    return Array.from(uniqueForeignItems.values());
  }

  private itemBelongsToGroup(itemLinkId: string, groupItemLinkId: string) {
    if (!this.itemIsGroupItem(groupItemLinkId)) {
      return false;
    }
    const allNestedItems = this.getNestedItems(groupItemLinkId);

    return (
      allNestedItems.find((nestedItem) => nestedItem.linkId === itemLinkId) !==
      undefined
    );
  }

  private itemIsGroupItem(itemLinkId: string) {
    const item = this.getItemByLinkId(itemLinkId);
    if (item?.type !== "group") {
      return false;
    }
    return true;
  }
}
