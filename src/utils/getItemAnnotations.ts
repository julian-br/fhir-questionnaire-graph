import { QuestionnaireItem } from "fhir/r4";
import { QuestionnaireItemAnnotation } from "../api/questionnaire";
import fhirpath from "fhirpath";

export function getItemAnnotations(item: QuestionnaireItem) {
  return fhirpath.evaluate(
    item,
    `extension.valueAnnotation`
  ) as QuestionnaireItemAnnotation[];
}
