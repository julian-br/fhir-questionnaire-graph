import {
  QuestionnaireItemAnswerOption,
  QuestionnaireItemEnableWhen,
} from "fhir/r4";
import { getAnswerOptionValue } from "./getAnswerOptionValue";
import { getEnabledWhenValue } from "./getEnableWhenValue";

export function findCorrectAnswerOptions(
  answerOptions: QuestionnaireItemAnswerOption[],
  enableWhen: QuestionnaireItemEnableWhen
) {
  return answerOptions.filter((answerOption) => {
    return compareValuesWithFHIROperator(
      getAnswerOptionValue(answerOption),
      getEnabledWhenValue(enableWhen),
      enableWhen.operator
    );
  });
}

type operatorType = QuestionnaireItemEnableWhen["operator"];
function compareValuesWithFHIROperator(
  valueA: any,
  valueB: any,
  operator: operatorType
) {
  switch (operator) {
    case "=":
      return valueA === valueB;
    case "!=":
      return valueA !== valueB;
    default:
      console.warn(`the operator ${operator} is not supported yet`);
      return false;
  }
}
