import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import QuestionnaireItemsNav from "../components/QuestionnaireItemsNav";
import Graph from "../modules/Graph/components/Graph";
import Button from "../components/common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import SearchForItemsDialog from "../components/SearchForItemsDialog";
import { useMemo, useState } from "react";
import { useQuestionnaire } from "../api/questionnaire";
import ViewItemModal from "../components/ViewItemModal/ViewItemModal";
import { Node } from "reactflow";
import { findItemByLinkId } from "../utils/findItemByLinkId";
import { getRelevantItemsForGraph } from "../modules/Graph/utils/getRelevantItemsForGraph";

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

  const [selectedItemId, setSelectedItemId] = useState<string>();
  const [showSearchForItemsDialog, setShowSearchForItemsDialog] =
    useState(false);

  function handleNodeClicked(node: Node) {
    if (node.type === "item") {
      setSelectedItemId(node.data.linkId);
    }
  }

  const graphItems = useMemo(() => {
    if (questionnaire === undefined) return [];
    return getRelevantItemsForGraph(itemLinkId, questionnaire);
  }, [itemLinkId, questionnaire]);

  return (
    <>
      <Navbar>
        <div className="ml-4">
          <div className="font-medium text-slate-600">
            {questionnaire?.name}: {questionnaire?.title}
          </div>
        </div>
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
            items={graphItems}
            rootItemLinkId={itemLinkId}
            onNodeClicked={handleNodeClicked}
          />

          {showSearchForItemsDialog && (
            <SearchForItemsDialog
              root={questionnaire}
              onClose={() => setShowSearchForItemsDialog(false)}
            />
          )}

          {selectedItemId !== undefined && (
            <ViewItemModal
              questionnaireId={questionnaireId}
              item={findItemByLinkId(selectedItemId, questionnaire)!}
              onClose={() => setSelectedItemId(undefined)}
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
