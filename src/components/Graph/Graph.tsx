import { Canvas, CanvasPosition } from "reaflow";
import CustomNode from "./CustomNode";
import { createContext, useEffect } from "react";
import GraphContainer from "./GraphContainer";
import { Questionnaire, QuestionnaireItem } from "fhir/r4";
import { useState } from "react";
import {
  createEdgesFromQuestionnaire,
  createNodesFromQuestionnaire,
} from "./graphUtils";

interface GraphProps {
  questionnaire: Questionnaire;
  activeItemId: string;
}
export default function Graph({ questionnaire, activeItemId }: GraphProps) {
  const activeItem = questionnaire.item!.find(
    (item) => item.linkId === activeItemId
  )!;

  const [nodes, setNodes] = useState(createNodesFromQuestionnaire(activeItem));
  const edges = createEdgesFromQuestionnaire(activeItem);

  useEffect(() => {
    const activeItem = questionnaire.item!.find(
      (item) => item.linkId === activeItemId
    )!;

    setNodes(createNodesFromQuestionnaire(activeItem));
  }, [activeItemId]);

  console.log(nodes, activeItem);
  function updateNodeHeight(nodeId: string, newHeight: number) {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, height: newHeight };
        }
        return node;
      })
    );
  }

  return (
    <GraphContainer>
      <Canvas
        zoomable={false}
        fit={true}
        nodes={nodes}
        edges={edges}
        readonly={true}
        direction="RIGHT"
        defaultPosition={CanvasPosition.LEFT}
        node={(props) => (
          <CustomNode
            onRender={(newHeight) =>
              updateNodeHeight(props.properties.id, newHeight)
            }
            {...props}
          />
        )}
      />
    </GraphContainer>
  );
}
