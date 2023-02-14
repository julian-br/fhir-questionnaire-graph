import { NodeProps } from "reaflow";
import { useRef, useEffect } from "react";
import { QuestionnaireItem } from "fhir/r4";

interface CustomNodeProps extends NodeProps {
  onRender: (newHeight: number) => void;
}

export default function CustomNode({
  width,
  height,
  x,
  y,
  properties: nodeData,
  onRender,
}: CustomNodeProps) {
  const nodeElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodeDiv = nodeElement.current;
    if (nodeDiv !== null) {
      const requiredHeight = nodeDiv.offsetHeight;
      onRender(requiredHeight);
    }
  }, []);

  const itemData: QuestionnaireItem = nodeData.data;

  return (
    <foreignObject width={width} height={height} x={x} y={y}>
      <div
        ref={nodeElement}
        className="fixed w-full rounded border bg-white p-4"
      >
        <div className="flex">
          <span className="mr-2 font-semibold">{itemData.prefix}</span>
          <p>{itemData.text}</p>
        </div>
      </div>
    </foreignObject>
  );
}
