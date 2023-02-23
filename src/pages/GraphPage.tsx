import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import data from "../assets/fhir-questionnaire-example.json";
import { Questionnaire } from "fhir/r4";
import QuestionnaireItemsNav from "../components/QuestionnaireItemsNav";
import { FHIRQuestionnaire } from "../fhir-questionnaire/FHIRQuestionnaire";
import Graph from "../modules/Graph/components/Graph";
import Button from "../components/common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Dialog } from "@headlessui/react";
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
      <Navbar>
        <Navbar.Controls>
          <SearchForItemButton onClick={() => null} />
        </Navbar.Controls>
      </Navbar>
      <main className="flex flex-grow">
        <SideBar>
          <div>
            <QuestionnaireItemsNav
              items={questionnaireData.item!}
              activeItemId={itemLinkId}
            />
          </div>
        </SideBar>
        <Graph questionnaire={fhirQuestionnaire} activeItemId={itemLinkId} />
      </main>

      <Dialog as="div" className="relative z-30" open onClose={() => null}>
        <div className="fixed inset-0 bg-slate-900 bg-opacity-20 backdrop-blur-sm" />

        <div className="fixed inset-0 z-40 overflow-y-auto">
          <div className="relative flex h-full justify-center">
            <Dialog.Panel className="relative mt-14 h-fit w-[30rem] rounded-xl font-inter opacity-100 shadow-xl">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute top-1/2 ml-4 -translate-y-1/2 transform text-slate-400"
                ></FontAwesomeIcon>
                <input
                  type="text"
                  placeholder="search for items..."
                  className="block w-full rounded-t-xl border-b py-4 pl-10 pr-3 placeholder:text-slate-500 focus:outline-none"
                />
              </div>
              <div className="box-border h-fit overflow-y-auto rounded-b-xl bg-slate-100">
                <div className="border-b bg-slate-100 py-4 px-4 font-semibold text-primary-500">
                  Avatars
                </div>
                <div className="border-b bg-white py-4 px-4 font-semibold text-slate-600">
                  Store Navigation
                </div>
                <div className="border-b bg-white py-4 px-4 font-semibold text-slate-600">
                  Tabs
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

function SearchForItemButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      variant="custom"
      className="box-border w-96 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-left text-sm text-slate-400 hover:border-2 hover:border-primary-300 hover:text-primary-500"
    >
      <FontAwesomeIcon icon={faSearch} className="mr-2"></FontAwesomeIcon>
      <span>Search for item...</span>
    </Button>
  );
}
