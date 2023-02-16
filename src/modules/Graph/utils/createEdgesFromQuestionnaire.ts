import { Edge } from "reactflow";
import { FHIRQuestionnaire } from "../../../fhir-questionnaire/FHIRQuestionnaire";

export function createEdgesFromQuestionnaire(
  questionnaire: FHIRQuestionnaire,
  itemLinkId: string
): Edge[] {
  const nestedItemsWithDependency =
    questionnaire.getNestedItemsWithDependency(itemLinkId);

  return nestedItemsWithDependency.map((itemWithDependency) => {
    return {
      id:
        itemWithDependency.linkId + itemWithDependency.enableWhen![0].question,
      source: itemWithDependency.enableWhen![0].question,
      target: itemWithDependency.linkId,
    };
  });
}
