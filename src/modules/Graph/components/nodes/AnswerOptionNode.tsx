import { QuestionnaireItemAnswerOption } from "fhir/r4";
import { NodeProps } from "reactflow";
import { getAnswerOptionValue } from "../../utils/getAnswerOptionValue";
import NodeContainer from "./NodeContainer";

export interface AnswerNodeData extends QuestionnaireItemAnswerOption {}

export default function AnswerOptionNode({ data }: NodeProps<AnswerNodeData>) {
  return (
    <NodeContainer>
      <div className="w-52 rounded-xl border border-slate-300 bg-primary-100 py-2 px-4 text-sm font-medium text-primary-900 hover:border-2 hover:border-primary-400">
        <p>{getAnswerOptionValue(data)?.toString()}</p>
      </div>
    </NodeContainer>
  );
}
