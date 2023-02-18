import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import data from "../assets/fhir-questionnaire-example.json";
import { Questionnaire } from "fhir/r4";
import QuestionnaireItemsNav from "../components/QuestionnaireItemsNav";
import { FHIRQuestionnaire } from "../fhir-questionnaire/FHIRQuestionnaire";
import Graph from "../modules/Graph/components/Graph";
const questionnaireData = data as Questionnaire;
const fhirQuestionnaire = new FHIRQuestionnaire(questionnaireData);

export const GRAPH_PAGE_ROUTE = "/graph/:questionnaireId/:itemLinkId";
export default function GraphPage({
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
