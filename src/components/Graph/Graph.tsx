import { Canvas, CanvasPosition, ElkCanvasLayoutOptions } from "reaflow";
import CustomNode from "./CustomNode";
import GraphContainer from "./GraphContainer";
import { Questionnaire } from "fhir/r4";
import useGraph from "../../hooks/useGraph";

interface GraphProps {
  questionnaire: Questionnaire;
  activeItemId: string;
}

//elk layout options: https://www.eclipse.org/elk/reference/options.html
const LAYOUT_OPTIONS = {
  "elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES",
};

export default function Graph({ questionnaire, activeItemId }: GraphProps) {
  const { nodes, edges, updateNodeHeight } = useGraph(
    questionnaire,
    activeItemId
  );

  return (
    <GraphContainer>
      <Canvas
        zoomable={false}
        fit={true}
        nodes={nodes}
        edges={edges}
        readonly={true}
        direction="RIGHT"
        layoutOptions={LAYOUT_OPTIONS}
        defaultPosition={CanvasPosition.LEFT}
        node={(props) => (
          <CustomNode
            onRenderToDom={(newHeight) =>
              updateNodeHeight(props.properties.id, newHeight)
            }
            {...props}
          />
        )}
      />
    </GraphContainer>
  );
}
