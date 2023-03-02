import { useQuery } from "@tanstack/react-query";
import exampleQuestionnaire from "../assets/fhir-questionnaire-example.json";
import { Questionnaire } from "fhir/r4";

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

async function fetchQuestionnaireById(id: string) {
  const questionnaire = questionnaires.find(
    (questionnaire) => questionnaire.id === id
  );

  if (questionnaire === undefined) {
    throw new Error("no questionnaire with the id " + id);
  }

  return questionnaire;
}

async function fetchAllQuestionnaires() {
  return questionnaires;
}
