import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import data from "../assets/fhir-questionnaire-example.json";
import { Questionnaire } from "fhir/r4";
import QuestionnaireItemsNav from "../components/QuestionnaireItemsNav";
import { FHIRQuestionnaire } from "../fhir-questionnaire/FHIRQuestionnaire";
import Graph from "../modules/Graph/components/Graph";
import TextInput from "../components/common/input/TextInput";
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
      <div className=" flex items-center justify-between border-b border-slate-300 bg-white px-7 pt-1 pb-2">
        <div className="w-2/3 text-sm text-slate-600">
          <span className="mr-1">Basis Anamnese beim Erwachsenen {">"}</span>
          <span className="font-semibold text-primary-900">
            {fhirQuestionnaire.getItemById(itemLinkId).text}
          </span>
        </div>
        <div className="w-1/3 pl-20">
          <TextInput
            className="text-sm"
            placeholder="search for item..."
          ></TextInput>
        </div>
      </div>
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
