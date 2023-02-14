import { Canvas, CanvasPosition } from "reaflow";
import CustomNode from "./CustomNode";
import { createContext } from "react";
import GraphContainer from "./GraphContainer";
import { Questionnaire } from "fhir/r4";
import { useState } from "react";
import {
  createEdgesFromQuestionnaire,
  createNodesFromQuestionnaire,
} from "./graphUtils";

interface GraphProps {
  questionnaire: Questionnaire;
  activeItemId: number;
}
export default function Graph({ questionnaire, activeItemId }: GraphProps) {
  const currentGroup = questionnaire.item![activeItemId];

  const [nodes, setNodes] = useState(
    createNodesFromQuestionnaire(currentGroup)
  );
  const edges = createEdgesFromQuestionnaire(currentGroup);

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
