import { QuestionnaireItemAnswerOption } from "fhir/r4";

export function getAnswerOptionValue(
  answerOption: QuestionnaireItemAnswerOption
) {
  if (answerOption.valueCoding !== undefined) {
    return answerOption.valueCoding.display;
  }

  let key: keyof typeof answerOption;
  for (key in answerOption) {
    if (key.includes("value")) {
      return answerOption[key];
    }
  }
}
