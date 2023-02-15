import { NodeProps } from "reaflow";
import { useRef, useEffect } from "react";
import { QuestionnaireItem } from "fhir/r4";

interface CustomNodeProps extends NodeProps {
  onRenderToDom: (newHeight: number) => void;
}

export default function CustomNode({
  width,
  height,
  x,
  y,
  properties: nodeData,
  onRenderToDom,
}: CustomNodeProps) {
  const nodeElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodeDiv = nodeElement.current;
    if (nodeDiv !== null) {
      const requiredHeight = nodeDiv.offsetHeight;
      onRenderToDom(requiredHeight);
    }
  }, []);

  const itemData: QuestionnaireItem = nodeData.data;

  return (
    <foreignObject width={width} height={height} x={x} y={y}>
      <div
        ref={nodeElement}
        className="fixed w-full rounded border border-slate-300 bg-white p-4"
      >
        <p>
          <span className="mr-2 font-semibold text-primary">
            {itemData.prefix}
          </span>
          {itemData.text}
        </p>
      </div>
    </foreignObject>
  );
}
