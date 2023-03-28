import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import exampleQuestionnaire from "../assets/example-dataset.json";
import { Questionnaire } from "fhir/r4";
import { findItemByLinkId } from "../utils/findItemByLinkId";

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

  const deleteAnnotationMutation = useMutation({
    mutationFn: deleteAnnotation,
    onSuccess: (_, { questionnaireId }) =>
      queryClient.invalidateQueries(["questionnaires", questionnaireId]),
  });

  return {
    add: addAnnotationMutation,
    delete: deleteAnnotationMutation,
  };
}

async function fetchQuestionnaireById(id: string) {
  const questionnaire = questionnaires.find(
    (questionnaire) => questionnaire.id === id
  );

  if (questionnaire === undefined) {
    throw new Error("no questionnaire with the id " + id);
  }

  return JSON.parse(JSON.stringify(questionnaire)) as Questionnaire;
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
  const questionnaire = questionnaires.find(
    (questionnaire) => questionnaire.id === questionnaireId
  );

  if (questionnaire === undefined) {
    throw new Error("no questionnaire with the id: " + questionnaireId);
  }

  const item = findItemByLinkId(itemLinkId, questionnaire);

  if (item === undefined) {
    throw new Error("no item with the id: " + itemLinkId);
  }

  if (item.extension === undefined) {
    item.extension = [];
  }

  const annotationId = Math.random().toString() + Date.now();
  item.extension.push({
    url: "annotation",
    valueAnnotation: { ...newAnnotation, id: annotationId },
  });

  return { ...newAnnotation, id: annotationId };
}

async function deleteAnnotation({
  annotationId,
  questionnaireId,
  itemLinkId,
}: {
  annotationId: string;
  questionnaireId: string;
  itemLinkId: string;
}) {
  const questionnaire = questionnaires.find(
    (questionnaire) => questionnaire.id === questionnaireId
  );

  if (questionnaire === undefined) {
    throw new Error("no questionnaire with the id: " + questionnaireId);
  }
  const item = findItemByLinkId(itemLinkId, questionnaire);
  if (item === undefined) {
    throw new Error("no item with the id: " + itemLinkId);
  }

  const matchingAnnotationIndex = item.extension?.findIndex(
    (extension) => extension.valueAnnotation?.id === annotationId
  );
  if (matchingAnnotationIndex === -1 || matchingAnnotationIndex === undefined) {
    throw new Error("no annotation with the id: " + annotationId);
  }

  item.extension?.splice(matchingAnnotationIndex, 1);
}
