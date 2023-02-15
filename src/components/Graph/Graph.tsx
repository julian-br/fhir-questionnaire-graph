import {
  Canvas,
  CanvasPosition,
  ElkCanvasLayoutOptions,
  ElkRoot,
} from "reaflow";
import CustomNode from "./CustomNode";
import GraphContainer from "./GraphContainer";
import { Questionnaire } from "fhir/r4";
import useGraph from "../../hooks/useGraph";

interface GraphProps {
  questionnaire: Questionnaire;
  activeItemId: string;
}

//elk layout options: https://www.eclipse.org/elk/reference/options.html
const LAYOUT_OPTIONS: ElkCanvasLayoutOptions = {
  "elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES",
};

export default function Graph({ questionnaire, activeItemId }: GraphProps) {
  const { nodes, edges, updateNodeHeight, canvasSize, updateCanvasSize } =
    useGraph(questionnaire, activeItemId);

  function handleLayoutChange(root: ElkRoot) {
    updateCanvasSize(root.width, root.height);
  }

  return (
    <GraphContainer>
      <Canvas
        zoomable={false} // zoom gets handled by the graph container
        fit={true}
        onLayoutChange={handleLayoutChange}
        maxWidth={canvasSize.width}
        maxHeight={canvasSize.height}
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
