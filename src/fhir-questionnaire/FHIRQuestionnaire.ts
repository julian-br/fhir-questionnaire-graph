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

  getAllRootItems() {
    return this.rootItems;
  }

  getItemByLinkId(itemLinkId: string) {
    return this.itemsMap.get(itemLinkId);
  }

  getItemsOfGroupItem(groupItemLinkId: string) {
    const item = this.getItemByLinkId(groupItemLinkId);
    if (item?.type !== "group") {
      console.warn(
        `the passed item with the linkId ${groupItemLinkId} is no group.`
      );
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

  getForeignDependendItemsOfGroup(groupItemLinkId: string) {
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

  private itemBelongsToGroup(
    dependencyLinkId: string,
    groupItemLinkId: string
  ) {
    if (!this.itemIsGroupItem(groupItemLinkId)) {
      return false;
    }
    const allNestedItems = this.getItemsOfGroupItem(groupItemLinkId);

    return (
      allNestedItems.find(
        (nestedItem) => nestedItem.linkId === dependencyLinkId
      ) !== undefined
    );
  }

  private itemIsGroupItem(itemLinkId: string) {
    const item = this.getItemByLinkId(itemLinkId);
    if (item?.type !== "group") {
      console.warn(
        `the passed item with the linkId ${itemLinkId} is no groupItem`
      );
      return false;
    }
    return true;
  }
}
