import { Canvas, CanvasPosition } from "reaflow";
import CustomNode from "./CustomNode";
import GraphContainer from "./GraphContainer";
import { Questionnaire } from "fhir/r4";
import useGraph from "../../hooks/useGraph";

interface GraphProps {
  questionnaire: Questionnaire;
  activeItemId: string;
}
export default function Graph({ questionnaire, activeItemId }: GraphProps) {
  const { nodes, edges, updateNodeHeight } = useGraph(
    questionnaire,
    activeItemId
  );

  console.log(nodes);

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
