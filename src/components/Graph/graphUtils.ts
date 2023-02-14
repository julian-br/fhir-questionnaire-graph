import { QuestionnaireItem } from "fhir/r4";

export function createEdgesFromQuestionnaire(item: QuestionnaireItem) {
  if (item.type === "group" && item.item !== undefined) {
    const nestedQuestions = item.item.filter(
      (question) => question.enableWhen !== undefined
    );

    return nestedQuestions.map((nestedQuestion) => {
      return {
        id: nestedQuestion.linkId,
        from: nestedQuestion.enableWhen![0].question,
        to: nestedQuestion.linkId,
      };
    });
  }

  return [];
}

export function createNodesFromQuestionnaire(item: QuestionnaireItem) {
  if (item.type === "group" && item.item !== undefined) {
    return item.item.map((question) => ({
      id: question.linkId,
      text: question.text ?? "",
      width: 400,
    }));
  }

  return [
    {
      id: item.linkId,
      text: item.text ?? "",
      width: 400,
    },
  ];
}
