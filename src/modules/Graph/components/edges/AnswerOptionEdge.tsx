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
          edgeData.selected
            ? "stroke-primary-300 stroke-[3]"
            : "stroke-slate-300 stroke-2"
        }`}
        d={edgePath}
        markerEnd={edgeData.markerEnd}
      />
    </>
  );
}
