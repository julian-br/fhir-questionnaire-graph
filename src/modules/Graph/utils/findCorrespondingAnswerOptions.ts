import {
  QuestionnaireItemAnswerOption,
  QuestionnaireItemEnableWhen,
} from "fhir/r4";
import { getAnswerOptionValue } from "./getAnswerOptionValue";
import { getEnabledWhenValue } from "./getEnableWhenValue";

export function findCorrespondingAnswerOptions(
  answerOptions: QuestionnaireItemAnswerOption[],
  enableWhen: QuestionnaireItemEnableWhen[]
) {
  if (enableWhen.length > 1) {
    console.warn(
      "Currently only question with one entry for enableWhen are supported."
    );
  }
  const enableWhenCondition = enableWhen[0];
  const enabledWhenValue = getEnabledWhenValue(enableWhenCondition);

  if (enabledWhenValue === undefined) {
    throw new Error(
      `the enabledWhen has no value ${JSON.stringify(enableWhenCondition)}`
    );
  }

  const operator = enableWhenCondition.operator;
  const correspondingAnswerOptions = answerOptions.filter((answerOption) => {
    const answerOptionValue = getAnswerOptionValue(answerOption);

    return (
      answerOptionValue !== undefined &&
      compareValuesWithFHIROperator(
        answerOptionValue,
        enabledWhenValue,
        operator
      )
    );
  });

  return correspondingAnswerOptions;
}

type operatorType = QuestionnaireItemEnableWhen["operator"];
function compareValuesWithFHIROperator(
  valueA: string,
  valueB: string,
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
