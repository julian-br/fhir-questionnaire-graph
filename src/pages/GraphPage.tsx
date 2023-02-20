import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import data from "../assets/fhir-questionnaire-example.json";
import { Questionnaire } from "fhir/r4";
import QuestionnaireItemsNav from "../components/QuestionnaireItemsNav";
import { FHIRQuestionnaire } from "../fhir-questionnaire/FHIRQuestionnaire";
import Graph from "../modules/Graph/components/Graph";
import TextInput from "../components/common/input/TextInput";
import Button from "../components/common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
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
      <div className="flex items-center justify-between border-b border-slate-300 px-7 py-3 text-base">
        <div>
          <h4 className="text-sm font-normal text-slate-500">
            {fhirQuestionnaire.getRawData().id}
          </h4>
          <h4 className="mb-0 pb-0 font-semibold text-slate-700">
            <span> Basis Anamnese beim Erwachsenen</span>
            <span className="font-normal text-slate-600">
              {" >"} {fhirQuestionnaire.getItemById(itemLinkId).text}
            </span>
          </h4>
        </div>
        <Button
          variant="custom"
          className="h-fit w-72 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-left text-sm text-slate-500 hover:border-primary-600 hover:text-primary-800"
        >
          <FontAwesomeIcon icon={faSearch} className="mr-2"></FontAwesomeIcon>
          <span>Search for item...</span>
        </Button>
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
