import { Questionnaire, QuestionnaireItem } from "fhir/r4";
import fhirpath from "fhirpath";

export function findGroupOfItem(
  item: QuestionnaireItem,
  questionnaire: Questionnaire
) {
  const group = fhirpath.evaluate(
    questionnaire,
    `Questionnaire.item.where(item.where(linkId=${item.linkId}))`
  );
  return group[0] as QuestionnaireItem | undefined;
}
