import { Questionnaire } from "fhir/r4";
import { useLocation } from "wouter";
import data from "../assets/fhir-questionnaire-example.json";
import { encodeURLParam } from "../utils/urlParam";
const questionnaireData = data as Questionnaire;

export default function IndexPage() {
  const [, setLocation] = useLocation();

  setLocation(
    `/graph/${encodeURLParam(questionnaireData.id!)}/${encodeURLParam(
      questionnaireData.item![0].linkId
    )}`,
    {
      replace: true,
    }
  );

  return <div>Index Page</div>;
}
