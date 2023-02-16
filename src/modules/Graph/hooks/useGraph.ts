import { QuestionnaireItem } from "fhir/r4";
import { useEffect } from "react";
import { FHIRQuestionnaire } from "../../../fhir-questionnaire/FHIRQuestionnaire";
import { Edge, Node, useEdgesState, useNodesState } from "reactflow";
import { Layout } from "../calcGraphLayout";
import { NodeData } from "../components/CustomNode";

const NODE_WIDTH = 350;

export default function useGraph(
  questionnaire: FHIRQuestionnaire,
  activeItemId: string
) {
  const [nodes, setNodes] = useNodesState<NodeData>(
    createNodes(questionnaire, activeItemId)
  );
  const [edges, setEdges] = useEdgesState<Edge>(
    createEdges(questionnaire, activeItemId)
  );

  useEffect(() => {
    setNodes(createNodes(questionnaire, activeItemId));
    setEdges(createEdges(questionnaire, activeItemId));
  }, [activeItemId, questionnaire]);

  function setLayout(layout: Layout) {
    setNodes(layout.layoutedNodes);
    setEdges(layout.layoutedEdges);
  }

  return {
    nodes,
    edges,
    setLayout,
  };
}

export function createNodes(
  questionnaire: FHIRQuestionnaire,
  itemLinkId: string
) {
  const nestedItems = questionnaire.getNestedItems(itemLinkId);

  if (nestedItems.length === 0) {
    const item = questionnaire.getItemById(itemLinkId);
    return [createNodeFromItem(item!)];
  }

  const foreignItems = questionnaire.getForeignDependendNestedItems(itemLinkId);
  const foreignItemsNodes = foreignItems.map((foreignItem) => {
    const foreignItemGroupId = questionnaire.getGroupIdOfItem(
      foreignItem.linkId
    );
    return createNodeFromItem(foreignItem, true, foreignItemGroupId);
  });

  const nestedItemsNodes = nestedItems.map((nestedItem) =>
    createNodeFromItem(nestedItem)
  );

  return [...nestedItemsNodes, ...foreignItemsNodes];
}

function createNodeFromItem(
  item: QuestionnaireItem,
  isForeign: boolean = false,
  foreignItemGroupId?: string
): Node<NodeData> {
  return {
    id: item.linkId,
    width: NODE_WIDTH,
    data: {
      isForeign,
      foreignItemGroupId,
      itemData: item,
    },
    type: "custom",
    position: {
      x: NaN,
      y: NaN,
    },
  };
}

export function createEdges(
  questionnaire: FHIRQuestionnaire,
  itemLinkId: string
) {
  const nestedItemsWithDependency =
    questionnaire.getNestedItemsWithDependency(itemLinkId);

  return nestedItemsWithDependency.map((itemWithDependency) => {
    return {
      id:
        itemWithDependency.linkId + itemWithDependency.enableWhen![0].question,
      source: itemWithDependency.enableWhen![0].question,
      target: itemWithDependency.linkId,
    };
  });
}
