import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import exampleQuestionnaire from "../assets/fhir-questionnaire-example.json";
import { Questionnaire } from "fhir/r4";
import { QuestionnaireHandler } from "../utils/QuestionnaireHandler";

export interface QuestionnaireItemAnnotation {
  id: string;
  authorString: string;
  time: string;
  text: string;
}

const questionnaires = [exampleQuestionnaire] as Questionnaire[];

export function useQuestionnaire(id: string) {
  const questionnaireQuery = useQuery({
    queryKey: ["questionnaires", id],
    queryFn: () => fetchQuestionnaireById(id),
  });

  return questionnaireQuery;
}

export function useQuestionnaires() {
  const questionnairesQuery = useQuery({
    queryKey: ["questionnaires"],
    queryFn: fetchAllQuestionnaires,
  });

  return questionnairesQuery;
}

export function useAnnotationMutation() {
  const queryClient = useQueryClient();
  const addAnnotationMutation = useMutation({
    mutationFn: postAnnotation,
    onSuccess: (_, { questionnaireId }) =>
      queryClient.invalidateQueries(["questionnaires", questionnaireId]),
  });

  return {
    add: addAnnotationMutation,
  };
}

async function fetchQuestionnaireById(id: string) {
  const questionnaire = questionnaires.find(
    (questionnaire) => questionnaire.id === id
  );

  if (questionnaire === undefined) {
    throw new Error("no questionnaire with the id " + id);
  }

  return { ...questionnaire };
}

async function fetchAllQuestionnaires() {
  return [...questionnaires];
}

async function postAnnotation({
  newAnnotation,
  questionnaireId,
  itemLinkId,
}: {
  newAnnotation: Omit<QuestionnaireItemAnnotation, "id">;
  questionnaireId: string;
  itemLinkId: string;
}) {
  const matchingQuestionnaireIndex = questionnaires.findIndex(
    (questionnaire) => questionnaire.id === questionnaireId
  );

  if (matchingQuestionnaireIndex === -1) {
    throw new Error("no questionnaire with the id: " + questionnaireId);
  }

  const questionnaireCopy = JSON.parse(
    JSON.stringify(questionnaires[matchingQuestionnaireIndex])
  );
  const questionnaireHandler = new QuestionnaireHandler(questionnaireCopy);
  const matchingItem = questionnaireHandler.getItemById(itemLinkId);

  if (matchingItem === undefined) {
    throw new Error("no item with the id: " + itemLinkId);
  }

  if (matchingItem.extension === undefined) {
    matchingItem.extension = [];
  }

  const annotationId = Math.random().toString() + Date.now();
  matchingItem.extension.push({
    url: "annotation",
    valueAnnotation: { ...newAnnotation, id: annotationId },
  });

  questionnaires[matchingQuestionnaireIndex] = questionnaireCopy;

  return { ...newAnnotation, id: annotationId };
}
