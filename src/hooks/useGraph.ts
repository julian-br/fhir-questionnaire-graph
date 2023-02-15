import { QuestionnaireItem } from "fhir/r4";
import { EdgeData, NodeData } from "reaflow";
import { useState, useEffect } from "react";
import { FHIRQuestionnaire } from "../fhir-questionnaire/FHIRQuestionnaire";

const INITIAL_CANVAS_WIDTH = 2000;
const INITIAL_CANVAS_HEIGHT = 2000;

const NODE_WIDTH = 350;

export default function useGraph(
  questionnaire: FHIRQuestionnaire,
  activeItemId: string
) {
  const [nodes, setNodes] = useState<NodeData<QuestionnaireItem>[]>();
  const [edges, setEdges] = useState<EdgeData[]>();
  const [canvasSize, setCanvasSize] = useState({
    width: INITIAL_CANVAS_WIDTH,
    height: INITIAL_CANVAS_HEIGHT,
  });

  useEffect(() => {
    const activeItem = questionnaire.getItemByLinkId(activeItemId);

    if (activeItem !== undefined) {
      setNodes(createNodes(questionnaire, activeItemId));
      setEdges(createEdges(questionnaire, activeItemId));
    }
  }, [activeItemId]);

  function updateNodeHeight(nodeId: string, newHeight: number) {
    setNodes((prevNodes) =>
      prevNodes?.map((node) => {
        if (node.id === nodeId) {
          return { ...node, height: newHeight };
        }
        return node;
      })
    );
  }

  function updateCanvasSize(
    newWitdh: number | undefined,
    newHeight: number | undefined
  ) {
    // an update of the canvas size is not neccesary until every node has a set height
    const everyNodeHasASetHeight = nodes?.every(
      (node) => node.height !== undefined
    );

    if (
      newWitdh !== undefined &&
      newHeight !== undefined &&
      everyNodeHasASetHeight
    ) {
      setCanvasSize({ width: newWitdh, height: newHeight });
    }
  }

  return {
    canvasSize,
    nodes,
    edges,
    updateNodeHeight,
    updateCanvasSize,
  };
}

function createNodes(
  questionnaire: FHIRQuestionnaire,
  itemLinkId: string
): NodeData<QuestionnaireItem>[] {
  const nestedItems = questionnaire.getNestedItems(itemLinkId);

  if (nestedItems.length === 0) {
    const item = questionnaire.getItemByLinkId(itemLinkId);
    return [createNodeFromItem(item!)];
  }

  const foreignItems = questionnaire.getForeignDependendNestedItems(itemLinkId);
  const foreignItemsNodes = foreignItems.map((foreignItem) =>
    createNodeFromItem(foreignItem, true)
  );

  const nestedItemsNodes = nestedItems.map((nestedItem) =>
    createNodeFromItem(nestedItem)
  );

  return [...nestedItemsNodes, ...foreignItemsNodes];
}

function createNodeFromItem(
  item: QuestionnaireItem,
  isForeign: boolean = false
) {
  return {
    id: item.linkId,
    data: item,
    width: NODE_WIDTH,
  };
}

function createEdges(
  questionnaire: FHIRQuestionnaire,
  itemLinkId: string
): EdgeData[] {
  const nestedItemsWithDependency =
    questionnaire.getNestedItemsWithDependency(itemLinkId);

  return nestedItemsWithDependency.map((itemWithDependency) => {
    return {
      id: itemWithDependency.linkId,
      from: itemWithDependency.enableWhen![0].question,
      to: itemWithDependency.linkId,
    };
  });
}
