import { EdgeProps, getSmoothStepPath } from "reactflow";

export default function AnswerOptionEdge({ data, ...edgeData }: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    ...edgeData,
  });

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
    </>
  );
}
