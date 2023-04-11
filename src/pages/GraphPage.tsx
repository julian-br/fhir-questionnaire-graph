import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import QuestionnaireNav from "../components/QuestionnaireNav";
import Graph from "../modules/Graph/components/Graph";
import Button from "../components/common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import SearchForItemsDialog from "../components/SearchForItemsDialog";
import React, { useMemo, useState } from "react";
import { useQuestionnaire } from "../api/questionnaire";
import ViewItemModal from "../components/ViewItemModal/ViewItemModal";
import { Node } from "reactflow";
import { findItemByLinkId } from "../utils/findItemByLinkId";
import { getRelevantItemsForGraph } from "../modules/Graph/utils/getRelevantItemsForGraph";
import { encodeURLParam } from "../utils/urlParam";
import { useLocation } from "wouter";
import ContextMenu from "../components/ContextMenu";
import { downloadQuestionnaire } from "../utils/downloadQuestionnaire";

export const GRAPH_PAGE_ROUTE = "/graph/:questionnaireId/:activeItemLinkId";

export function constructGraphPageUrl(
  questionnaireId: string,
  activeItemLinkId: string
) {
  return `/graph/${encodeURLParam(questionnaireId)}/${encodeURLParam(
    activeItemLinkId
  )}`;
}

export default function GraphPage({
  activeItemLinkId,
  questionnaireId,
}: {
  questionnaireId: string;
  activeItemLinkId: string;
}) {
  const [, setLocation] = useLocation();
  const {
    isSuccess,
    isLoading,
    data: questionnaire,
  } = useQuestionnaire(questionnaireId);

  const [itemIdForDetailView, setItemIdForDetailView] = useState<string>();
  const [showSearchForItemsDialog, setShowSearchForItemsDialog] =
    useState(false);

  function handleNodeClicked(event: React.MouseEvent, node: Node) {
    if (node.type === "item") {
      if (event.ctrlKey) {
        navigateToItem(node.data.linkId);
        return;
      }
      setItemIdForDetailView(node.data.linkId);
    }
  }

  function navigateToItem(itemLinkId: string) {
    setLocation(constructGraphPageUrl(questionnaire?.id ?? "", itemLinkId));
  }

  const graphItems = useMemo(() => {
    if (questionnaire === undefined) return [];
    return getRelevantItemsForGraph(activeItemLinkId, questionnaire);
  }, [activeItemLinkId, questionnaire]);

  return (
    <>
      <Navbar>
        <div className="ml-9">
          <div className="font-medium text-slate-600">
            {questionnaire?.name}: {questionnaire?.title}
          </div>
        </div>
        <Navbar.Controls>
          <SearchForItemButton
            onClick={() => setShowSearchForItemsDialog(true)}
          />
          <ContextMenu>
            <ContextMenu.Entry
              onClick={() =>
                questionnaire ? downloadQuestionnaire(questionnaire) : null
              }
            >
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faFileArrowDown}
                  className="mr-2 h-4 text-slate-500"
                />
                <span>Download Json</span>
              </div>
            </ContextMenu.Entry>
          </ContextMenu>
        </Navbar.Controls>
      </Navbar>
      {isLoading && <div>...Loading</div>}
      {isSuccess && (
        <main className="flex flex-grow">
          <SideBar>
            <div>
              <QuestionnaireNav
                questionnaire={questionnaire}
                activeItemId={activeItemLinkId}
              />
            </div>
          </SideBar>

          <Graph
            items={graphItems}
            rootItemLinkId={activeItemLinkId}
            onNodeClicked={handleNodeClicked}
          />

          {showSearchForItemsDialog && (
            <SearchForItemsDialog
              onEntrySelect={(entry) => navigateToItem(entry.linkTo)}
              root={questionnaire}
              onClose={() => setShowSearchForItemsDialog(false)}
            />
          )}

          {itemIdForDetailView !== undefined && (
            <ViewItemModal
              questionnaireId={questionnaireId}
              item={findItemByLinkId(itemIdForDetailView, questionnaire)!}
              onClose={() => setItemIdForDetailView(undefined)}
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
      className="h- box-border w-96 rounded-full border border-slate-300 bg-slate-50 px-3 py-2 text-left text-sm text-slate-400 hover:border-2 hover:border-primary-300 hover:text-primary-500"
    >
      <FontAwesomeIcon icon={faSearch} className="mr-2"></FontAwesomeIcon>
      <span>Search for item...</span>
    </Button>
  );
}
