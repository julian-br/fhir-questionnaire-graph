import { Questionnaire, QuestionnaireItem } from "fhir/r4";

export function findItemInQuestionnaire(
  questionnaire: Questionnaire,
  itemLinkId: string
) {
  if (questionnaire.item === undefined) {
    return undefined;
  }

  const allItemsFlatMap = questionnaire.item.flatMap(
    (item) => item.item ?? item
  );
  return allItemsFlatMap.find((item) => item?.linkId === itemLinkId);
}
