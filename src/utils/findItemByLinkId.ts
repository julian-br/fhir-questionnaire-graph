import { Questionnaire, QuestionnaireItem } from "fhir/r4";
import fhirpath from "fhirpath";

export function findItemByLinkId(linkId: string, questionnaire: Questionnaire) {
  const matchingItems = fhirpath.evaluate(
    questionnaire,
    `Questionnaire.item.union(Questionnaire.item.item).where(linkId='${linkId}')`
  );

  return matchingItems[0] as QuestionnaireItem | undefined;
}
