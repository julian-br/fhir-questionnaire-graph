import {
  QuestionnaireItemAnswerOption,
  QuestionnaireItemEnableWhen,
} from "fhir/r4";

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

function getEnabledWhenValue(enableWhen: QuestionnaireItemEnableWhen) {
  let key: keyof typeof enableWhen;
  for (key in enableWhen) {
    if (key.includes("answer")) {
      return enableWhen[key]?.toString();
    }
  }
}

function getAnswerOptionValue(answerOption: QuestionnaireItemAnswerOption) {
  let key: keyof typeof answerOption;
  for (key in answerOption) {
    if (key.includes("value")) {
      return answerOption[key]?.toString();
    }
  }
}
