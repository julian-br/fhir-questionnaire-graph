import { EdgeProps, getSmoothStepPath } from "reactflow";

export default function AnswerOptionEdge({ data, ...edgeData }: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    ...edgeData,
  });

  return (
    <>
      <path
        id={edgeData.id}
        className={`fill-none stroke-2 ${
          edgeData.selected ? "stroke-primary-300 " : "stroke-slate-300"
        }`}
        d={edgePath}
        markerEnd={edgeData.markerEnd}
      />
    </>
  );
}
