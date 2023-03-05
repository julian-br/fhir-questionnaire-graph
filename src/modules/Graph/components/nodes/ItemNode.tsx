import { QuestionnaireItem } from "fhir/r4";
import { NodeProps } from "reactflow";
import NodeContainer from "./NodeContainer";

export interface ItemNodeData extends QuestionnaireItem {}

export function ItemNode({ data }: NodeProps<ItemNodeData>) {
  return (
    <NodeContainer>
      <div className="w-72 bg-white p-3">
        <div className="w-full">
          <p className="pb-2">
            {data.prefix !== undefined && (
              <span className="mr-2 font-semibold text-primary-800">
                {data.prefix}
              </span>
            )}
            <span className="text-slate-600">{data.text}</span>
          </p>
          <TypeBadge type={data.type} />
        </div>
      </div>
    </NodeContainer>
  );
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className={`p rounded-full border border-primary-200 bg-primary-50 py-1 px-2 text-xs font-semibold text-primary-700`}
    >
      {type}
    </span>
  );
}
