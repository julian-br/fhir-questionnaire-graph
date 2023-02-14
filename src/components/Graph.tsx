import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Canvas, CanvasPosition } from "reaflow";
import { useGraph } from "../stores/useGraph";
import CustomNode from "./CustomNode";

export default function Graph() {
  const graph = useGraph();
  return (
    <div className="w-5/6 bg-slate-100">
      <TransformWrapper
        wheel={{ step: 0.2 }}
        limitToBounds={false}
        panning={{ velocityDisabled: true }}
        doubleClick={{
          disabled: true,
        }}
      >
        <TransformComponent
          wrapperStyle={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Canvas
            onLayoutChange={(e) => console.log(e)}
            zoomable={false}
            fit={true}
            nodes={graph.nodes}
            edges={graph.edges}
            readonly={true}
            direction="RIGHT"
            defaultPosition={CanvasPosition.LEFT}
            node={(props) => <CustomNode {...props} />}
          />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
