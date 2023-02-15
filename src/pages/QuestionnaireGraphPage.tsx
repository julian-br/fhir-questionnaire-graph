import Graph from "../components/Graph/Graph";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import data from "../assets/fhir-questionnaire-example.json";
import { Questionnaire } from "fhir/r4";
import QuestionnaireItemsNav from "../components/QuestionnaireItemsNav";
import { FHIRQuestionnaire } from "../fhir-questionnaire/FHIRQuestionnaire";
const questionnaireData = data as Questionnaire;
const fhirQuestionnaire = new FHIRQuestionnaire(questionnaireData);

export default function QuestionnaireGraphPage({
  questionnaireId,
  itemLinkId,
}: {
  questionnaireId: string;
  itemLinkId: string;
}) {
  return (
    <>
      <Navbar />
      <main className="flex flex-grow">
        <SideBar>
          <div>
            <QuestionnaireItemsNav
              items={questionnaireData.item!}
              activeItemId={itemLinkId}
            />
          </div>
        </SideBar>
        <div className="w-full">
          <Graph questionnaire={fhirQuestionnaire} activeItemId={itemLinkId} />
        </div>
      </main>
    </>
  );
}
