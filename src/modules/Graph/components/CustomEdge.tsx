import { EdgeLabelRenderer, EdgeProps, getBezierPath } from "reactflow";

export default function CustomEdge({ data, ...edgeData }: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    ...edgeData,
  });

  const hasLabel = edgeData.label !== undefined;
  return (
    <>
      <path
        id={edgeData.id}
        className="react-flow__edge-path stroke-slate-400"
        d={edgePath}
        markerEnd={edgeData.markerEnd}
      />
      {hasLabel && (
        <EdgeLabelRenderer>
          <div
            className="absolute"
            style={{
              transform: `translate(${labelX}px,${labelY}px) translate(-50%, -50%)`,
            }}
          >
            <EdgeLabel text={edgeData.label!.toString()} />
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

function EdgeLabel({ text }: { text: string }) {
  return (
    <div className=" rounded border bg-white px-3 py-1 text-xs font-bold text-primary">
      {text}
    </div>
  );
}
