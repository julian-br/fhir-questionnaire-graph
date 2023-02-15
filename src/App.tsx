import Graph from "./components/Graph/Graph";
import data from "./assets/fhir-questionnaire-example.json";
import { Questionnaire } from "fhir/r4";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiagramProject } from "@fortawesome/free-solid-svg-icons";
import SideBar from "./components/SideBar";

const questionnaireData = data as Questionnaire;

function App() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <h1 className="flex items-center border-b py-4 pl-3 text-3xl">
        <div className="ml-3">
          <FontAwesomeIcon
            className="mt-2 h-8 text-primary"
            icon={faDiagramProject}
          />
          <span className="ml-3 font-semibold">Questionnaire Tree</span>
        </div>
      </h1>
      <div className="flex flex-grow">
        <SideBar>
          <div>
            <h5 className="text-slate-900pl-5 pl-5 text-xl font-semibold">
              Groups
            </h5>
            <div className="mt-2 flex-col gap-2">
              <div className="py-2 pl-5">Gruppe 1</div>
              <div className="bg-primary py-2 pl-5 font-semibold text-white">
                Gruppe 2
              </div>
              <div className="py-2 pl-5">Gruppe 3</div>
              <div className="py-2 pl-5">Gruppe 4</div>
            </div>
          </div>
        </SideBar>
        <div className="w-full">
          <Graph questionnaire={questionnaireData} activeItemId={6} />
        </div>
      </div>
    </div>
  );
}

export default App;
