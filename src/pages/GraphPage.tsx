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
import { faDiagramProject, faSearch } from "@fortawesome/free-solid-svg-icons";
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
          <div className="z-50 flex items-center justify-between border-b border-slate-200 px-7 pt-4 pb-4 text-base shadow-md">
            <div>
              <h4 className="text-sm font-normal text-slate-500">
                {fhirQuestionnaire.getRawData().id}
              </h4>
              <h4 className="mb-0 pb-0 font-semibold text-primary-900">
                <span> Basis Anamnese beim Erwachsenen</span>
                <span className="font-normal text-slate-600">
                  {" >"} {fhirQuestionnaire.getItemById(itemLinkId).text}
                </span>
              </h4>
            </div>
            <Button
              variant="custom"
              className="w-96 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-left text-sm text-slate-400 hover:border-2 hover:border-primary-300 hover:text-primary-500"
            >
              <FontAwesomeIcon
                icon={faSearch}
                className="mr-2"
              ></FontAwesomeIcon>
              <span>Search for item...</span>
            </Button>
          </div>
          <Graph questionnaire={fhirQuestionnaire} activeItemId={itemLinkId} />
        </div>
      </main>
    </>
  );
}
