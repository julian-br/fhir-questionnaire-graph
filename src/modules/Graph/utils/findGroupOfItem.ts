import { Questionnaire, QuestionnaireItem } from "fhir/r4";
import fhirpath from "fhirpath";

export function findGroupOfItem(
  item: QuestionnaireItem,
  questionnaire: Questionnaire
): QuestionnaireItem | undefined {
  console.log(item);
  const group: QuestionnaireItem[] = fhirpath.evaluate(
    questionnaire,
    `Questionnaire.item.where(item.where(linkId='${item.linkId}'))`
  );
  return group[0];
}
