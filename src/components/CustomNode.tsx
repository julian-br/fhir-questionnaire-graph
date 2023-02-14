import { NodeProps } from "reaflow";
import { useRef, useEffect } from "react";
import { useGraph } from "../stores/useGraph";

export default function CustomNode(props: NodeProps) {
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
