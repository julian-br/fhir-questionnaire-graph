import { QuestionnaireItem } from "fhir/r4";
import { QuestionnaireItemAnnotation } from "../api/questionnaire";

export function getItemAnnotations(item: QuestionnaireItem) {
  if (item.extension === undefined) {
    return [];
  }

  return item.extension
    ?.map((extension) => extension.valueAnnotation)
    .filter(
      (extension) => extension !== undefined
    ) as QuestionnaireItemAnnotation[];
}
