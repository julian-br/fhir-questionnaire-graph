import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import QuestionnaireItemsNav from "../components/QuestionnaireItemsNav";
import Graph from "../modules/Graph/components/Graph";
import Button from "../components/common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import SearchForItemsDialog from "../components/SearchForItemsDialog";
import { useState } from "react";
import { useQuestionnaire } from "../api/questionnaire";
import ViewItemModal from "../components/ViewItemModal";
import { QuestionnaireItem } from "fhir/r4";
import { Node } from "reactflow";

export const GRAPH_PAGE_ROUTE = "/graph/:questionnaireId/:itemLinkId";

export default function GraphPage({
  itemLinkId,
  questionnaireId,
}: {
  questionnaireId: string;
  itemLinkId: string;
}) {
  const {
    isSuccess,
    isLoading,
    data: questionnaire,
  } = useQuestionnaire(questionnaireId);

  const [selectedItem, setSelectedItem] = useState<QuestionnaireItem | null>(
    null
  );
  const [showSearchForItemsDialog, setShowSearchForItemsDialog] =
    useState(false);

  function handleNodeClicked(node: Node) {
    if (node.type === "item") {
      setSelectedItem(node.data.itemData);
    }
  }

  return (
    <>
      <Navbar>
        <Navbar.Controls>
          <SearchForItemButton
            onClick={() => setShowSearchForItemsDialog(true)}
          />
        </Navbar.Controls>
      </Navbar>
      {isLoading && <div>...Loading</div>}
      {isSuccess && (
        <main className="flex flex-grow">
          <SideBar>
            <div>
              <QuestionnaireItemsNav
                items={questionnaire.item!}
                activeItemId={itemLinkId}
              />
            </div>
          </SideBar>
          <Graph
            questionnaire={questionnaire}
            activeItemId={itemLinkId}
            onNodeClicked={handleNodeClicked}
          />

          {showSearchForItemsDialog && (
            <SearchForItemsDialog
              questionnaire={questionnaire}
              onClose={() => setShowSearchForItemsDialog(false)}
            />
          )}

          {selectedItem !== null && (
            <ViewItemModal
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
            />
          )}
        </main>
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
