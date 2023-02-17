import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QuestionnaireItem, QuestionnaireItemAnswerOption } from "fhir/r4";
import { Handle, Position, NodeProps } from "reactflow";
import NodeContainer from "./NodeContainer";

export type NodeData = NodeDataItem | NodeDataAnswerOption;

interface NodeDataItem {
  isForeign: boolean;
  foreignItemGroupId?: string;
  itemData: QuestionnaireItem;
}

interface NodeDataAnswerOption extends QuestionnaireItemAnswerOption {}

export function DefaultNode({ data }: NodeProps<NodeDataItem>) {
  const itemData = data.itemData;
  return (
    <NodeContainer>
      <div className="w-80 p-4">
        {data.isForeign && (
          <ForeignItemNotification
            foreignItemGroupId={data.foreignItemGroupId ?? ""}
          />
        )}
        <div className="w-full">
          <p className="pb-2">
            {itemData.prefix !== undefined && (
              <span className="mr-2 font-semibold text-primary">
                {itemData.prefix}
              </span>
            )}
            <span>{itemData.text}</span>
          </p>
          <span className="p rounded-full border border-secondary bg-secondary-light py-1 px-2 text-sm font-semibold text-primary">
            {itemData.type}
          </span>
        </div>
      </div>
    </NodeContainer>
  );
}

function ForeignItemNotification({
  foreignItemGroupId,
}: {
  foreignItemGroupId: string;
}) {
  return (
    <div className="mb-2 rounded border border-amber-400 bg-amber-50 px-2 py-1 text-sm text-amber-600">
      <FontAwesomeIcon icon={faCircleInfo} className="mr-1" />
      <span>from Item: </span>
      <a className="font-medium ">{foreignItemGroupId}</a>
    </div>
  );
}
