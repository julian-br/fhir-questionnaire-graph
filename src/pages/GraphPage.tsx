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
import SearchForItemsDialog from "../components/SearchForItemsDialog";
import { useState } from "react";

const questionnaireData = data as Questionnaire;
const fhirQuestionnaire = new FHIRQuestionnaire(questionnaireData);

export const GRAPH_PAGE_ROUTE = "/graph/:questionnaireId/:itemLinkId";
export default function GraphPage({
  itemLinkId,
}: {
  questionnaireId: string;
  itemLinkId: string;
}) {
  const [showSearchForItemsComboBox, setShowSearchForItemsComboBox] =
    useState(false);

  return (
    <>
      <Navbar>
        <Navbar.Controls>
          <SearchForItemButton
            onClick={() => setShowSearchForItemsComboBox(true)}
          />
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

      {showSearchForItemsComboBox && (
        <SearchForItemsDialog
          questionnaire={fhirQuestionnaire}
          onClose={() => setShowSearchForItemsComboBox(false)}
        />
      )}
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
