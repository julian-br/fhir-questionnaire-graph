import { QuestionnaireItemAnswerOption } from "fhir/r4";
import { NodeProps } from "reactflow";
import NodeContainer from "./NodeContainer";

export interface AnswerNodeData extends QuestionnaireItemAnswerOption {}

export default function AnswerOptionNode({ data }: NodeProps<AnswerNodeData>) {
  return (
    <NodeContainer>
      <div className="w-44   bg-secondary-light p-2 text-sm text-slate-800">
        {data.initialSelected === true && (
          <p className="w-fit rounded border border-green-700 bg-green-50 px-1 text-green-700">
            default
          </p>
        )}
        <p>{data.valueString}</p>
      </div>
    </NodeContainer>
  );
}