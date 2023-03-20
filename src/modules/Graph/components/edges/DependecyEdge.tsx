import { EdgeLabelRenderer, EdgeProps, getBezierPath } from "reactflow";

export default function DependecyEdge({ data, ...edgeData }: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    ...edgeData,
  });

  const hasLabel = edgeData.label !== undefined;
  return (
    <>
      <path
        id={edgeData.id}
        className={`fill-none ${
          edgeData.selected ? "stroke-primary-400 stroke-2" : "stroke-slate-400"
        }`}
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
            <EdgeLabel
              selected={edgeData.selected ?? false}
              text={edgeData.label!.toString()}
            />
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

function EdgeLabel({ text, selected }: { text: string; selected: boolean }) {
  return (
    <div
      className={`mb-4 text-sm font-bold  ${
        selected ? "text-primary-500" : "text-primary-700"
      }`}
    >
      {text}
    </div>
  );
}
