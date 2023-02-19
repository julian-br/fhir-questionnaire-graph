import { QuestionnaireItem } from "fhir/r4";
import { NodeProps } from "reactflow";
import NodeContainer from "./NodeContainer";

export interface ItemNodeData {
  itemData: QuestionnaireItem;
}

export function ItemNode({ data }: NodeProps<ItemNodeData>) {
  const itemData = data.itemData;
  return (
    <NodeContainer>
      <div className="w-72 bg-white p-4">
        <div className="w-full">
          <p className="pb-2">
            {itemData.prefix !== undefined && (
              <span className="mr-2 font-semibold text-primary-700">
                {itemData.prefix}
              </span>
            )}
            <span>{itemData.text}</span>
          </p>
          <span
            className={`p rounded-full border border-primary-600 bg-primary-50 py-1 px-2 text-xs font-semibold text-primary-700`}
          >
            {itemData.type}
          </span>
        </div>
      </div>
    </NodeContainer>
  );
}
