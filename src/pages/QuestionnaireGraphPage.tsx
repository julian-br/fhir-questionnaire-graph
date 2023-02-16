import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import data from "../assets/fhir-questionnaire-example.json";
import { Questionnaire } from "fhir/r4";
import QuestionnaireItemsNav from "../components/QuestionnaireItemsNav";
import { FHIRQuestionnaire } from "../fhir-questionnaire/FHIRQuestionnaire";
import Flow from "../modules/Graph/components/Flow";
const questionnaireData = data as Questionnaire;
const fhirQuestionnaire = new FHIRQuestionnaire(questionnaireData);

export default function QuestionnaireGraphPage({
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
          <Flow
            questionnaire={fhirQuestionnaire}
            activeItemId={itemLinkId}
          ></Flow>
        </div>
      </main>
    </>
  );
}
