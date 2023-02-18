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
      <div className="w-80 rounded border border-secondary p-4 hover:border-primary-highlight">
        <div className="w-full">
          <p className="pb-2">
            {itemData.prefix !== undefined && (
              <span className="mr-2 font-semibold text-primary">
                {itemData.prefix}
              </span>
            )}
            <span>{itemData.text}</span>
          </p>
          <span
            className={`p rounded-full border border-secondary bg-secondary-light py-1 px-2 text-sm font-semibold text-primary`}
          >
            {itemData.type}
          </span>
        </div>
      </div>
    </NodeContainer>
  );
}
