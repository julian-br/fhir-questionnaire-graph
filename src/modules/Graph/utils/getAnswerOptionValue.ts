import { QuestionnaireItemAnswerOption } from "fhir/r4";

export function getAnswerOptionValue(
  answerOption: QuestionnaireItemAnswerOption
) {
  let key: keyof typeof answerOption;
  for (key in answerOption) {
    if (key.includes("value")) {
      return answerOption[key]?.toString();
    }
  }
}
