import { useEffect, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Canvas, CanvasPosition, NodeProps } from "reaflow";
import { useGraph } from "./stores/useGraph";

function App() {
  const graph = useGraph();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <h1 className="border-b py-4 text-3xl font-semibold">
        <span className="ml-3 font-bold text-blue-600">FHIR TREE</span>
      </h1>
      <div className="flex flex-grow">
        <div className="border-slate-60 w-1/6 border-r">
          <div className="pl-3 pt-5 text-2xl font-medium">Sidebar</div>
          <div className="py-2 pl-3 ">entry</div>
          <div className="bg-blue-500 py-2 pl-3 font-medium text-blue-50">
            entry
          </div>
          <div className="pl-3 pt-1 ">entry</div>
        </div>
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
      </div>
    </div>
  );
}

function CustomNode(props: NodeProps) {
  const nodeContent = useRef<HTMLDivElement>(null);
  const setNodeHeight = useGraph((state) => state.setNodeHeight);
  useEffect(() => {
    const neededHeight = nodeContent.current!.scrollHeight;
    setNodeHeight(props.properties.id, neededHeight);
  }, []);
  return (
    <foreignObject
      width={props.width}
      height={props.height}
      x={props.x}
      y={props.y}
    >
      <div
        ref={nodeContent}
        className="fixed w-full rounded border bg-white p-4"
      >
        <h4 className="text-lg font-semibold">test heading</h4>
        {props.properties.text}
      </div>
    </foreignObject>
  );
}

export default App;
