import { QuestionnaireItemAnswerOption } from "fhir/r4";
import { NodeProps } from "reactflow";
import NodeContainer from "./NodeContainer";

export interface AnswerNodeData extends QuestionnaireItemAnswerOption {}

export default function AnswerOptionNode({ data }: NodeProps<AnswerNodeData>) {
  return (
    <NodeContainer>
      <div className="w-48 rounded-lg border border-slate-300 bg-primary-100 p-2 text-sm text-primary-900 hover:border-2 hover:border-primary-400">
        <p>{data.valueString}</p>
        {data.initialSelected === true && <InitalSelectedBadge />}
      </div>
    </NodeContainer>
  );
}

function InitalSelectedBadge() {
  return (
    <p className="mt-1 w-fit rounded border border-green-700 bg-green-50 px-1 font-medium text-green-700">
      initial selected
    </p>
  );
}
