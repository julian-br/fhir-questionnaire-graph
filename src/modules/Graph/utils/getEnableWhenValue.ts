import { QuestionnaireItemEnableWhen } from "fhir/r4";

export function getEnabledWhenValue(enableWhen: QuestionnaireItemEnableWhen) {
  if (enableWhen.answerCoding !== undefined) {
    return enableWhen.answerCoding.display;
  }

  let key: keyof typeof enableWhen;
  for (key in enableWhen) {
    if (key.includes("answer")) {
      return enableWhen[key];
    }
  }
}
