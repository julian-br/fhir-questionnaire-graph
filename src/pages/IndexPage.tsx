import { Questionnaire } from "fhir/r4";
import { Redirect, useLocation } from "wouter";
import data from "../assets/fhir-questionnaire-example.json";
import { encodeURLParam } from "../utils/urlParam";
const questionnaireData = data as Questionnaire;

export const INDEX_PAGE_ROUTE = "";

export default function IndexPage() {
  return (
    <Redirect
      to={`/graph/${encodeURLParam(questionnaireData.id!)}/${encodeURLParam(
        questionnaireData.item![0].linkId
      )}`}
    />
  );
}
