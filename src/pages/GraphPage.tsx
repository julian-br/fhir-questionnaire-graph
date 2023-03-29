import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import QuestionnaireNav from "../components/QuestionnaireNav";
import Graph from "../modules/Graph/components/Graph";
import Button from "../components/common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import SearchForItemsDialog from "../components/SearchForItemsDialog";
import React, { useMemo, useState } from "react";
import { useQuestionnaire } from "../api/questionnaire";
import ViewItemModal from "../components/ViewItemModal/ViewItemModal";
import { Node } from "reactflow";
import { findItemByLinkId } from "../utils/findItemByLinkId";
import { getRelevantItemsForGraph } from "../modules/Graph/utils/getRelevantItemsForGraph";
import { encodeURLParam } from "../utils/urlParam";
import { useLocation } from "wouter";

export const GRAPH_PAGE_ROUTE = "/graph/:questionnaireId/:itemLinkId";

export function constructGraphPageUrl(
  questionnaireId: string,
  itemLinkId: string
) {
  return `/graph/${encodeURLParam(questionnaireId)}/${encodeURLParam(
    itemLinkId
  )}`;
}

export default function GraphPage({
  itemLinkId,
  questionnaireId,
}: {
  questionnaireId: string;
  itemLinkId: string;
}) {
  const [, setLocation] = useLocation();
  const {
    isSuccess,
    isLoading,
    data: questionnaire,
  } = useQuestionnaire(questionnaireId);

  const [selectedItemId, setSelectedItemId] = useState<string>();
  const [showSearchForItemsDialog, setShowSearchForItemsDialog] =
    useState(false);

  function handleNodeClicked(event: React.MouseEvent, node: Node) {
    if (node.type === "item") {
      if (event.ctrlKey) {
        navigateToItem(node.data.linkId);
        return;
      }
      setSelectedItemId(node.data.linkId);
    }
  }

  function navigateToItem(itemLinkId: string) {
    setLocation(constructGraphPageUrl(questionnaire?.id ?? "", itemLinkId));
  }

  const graphItems = useMemo(() => {
    if (questionnaire === undefined) return [];
    return getRelevantItemsForGraph(itemLinkId, questionnaire);
  }, [itemLinkId, questionnaire]);

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
        </Navbar.Controls>
      </Navbar>
      {isLoading && <div>...Loading</div>}
      {isSuccess && (
        <main className="flex flex-grow">
          <SideBar>
            <div>
              <QuestionnaireNav
                questionnaire={questionnaire}
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
              onEntrySelect={(entry) => navigateToItem(entry.linkTo)}
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
      className="box-border w-96 rounded-full border border-slate-300 bg-slate-50 px-3 py-2 text-left text-sm text-slate-400 hover:border-2 hover:border-primary-300 hover:text-primary-500"
    >
      <FontAwesomeIcon icon={faSearch} className="mr-2"></FontAwesomeIcon>
      <span>Search for item...</span>
    </Button>
  );
}
