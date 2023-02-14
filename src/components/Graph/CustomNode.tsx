import { NodeProps } from "reaflow";
import { useRef, useEffect } from "react";
import { useContext } from "react";

interface CustomNodeProps extends NodeProps {
  onRender: (newHeight: number) => void;
}

export default function CustomNode(props: CustomNodeProps) {
  const nodeContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const neededHeight = nodeContent.current!.offsetHeight;
    props.onRender(neededHeight);
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
        <h4 className="text-lg font-semibold">heading</h4>
        {props.properties.text}
      </div>
    </foreignObject>
  );
}
