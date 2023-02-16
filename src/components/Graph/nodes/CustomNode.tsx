import { NodeProps } from "reaflow";
import { useRef, useEffect } from "react";
import { QuestionnaireItem } from "fhir/r4";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

export interface QuestionnaireItemNodeData extends QuestionnaireItem {
  isForeign: boolean;
  foreignItemGroupId?: string;
}

interface CustomNodeProps extends NodeProps<QuestionnaireItemNodeData> {
  onRenderToDom: (newHeight: number) => void;
}

export default function CustomNode({
  width,
  height,
  x,
  y,
  properties: nodeData,
  onRenderToDom,
}: CustomNodeProps) {
  const nodeElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodeDiv = nodeElement.current;
    if (nodeDiv !== null) {
      const requiredHeight = nodeDiv.offsetHeight;
      onRenderToDom(requiredHeight);
    }
  }, []);

  const itemData = nodeData.data;
  const isForeign = nodeData.data?.isForeign ?? false;

  return (
    <foreignObject width={width} height={height} x={x} y={y}>
      <div ref={nodeElement} className="fixed w-full">
        <div className="w-full rounded border border-slate-300 bg-white  p-4">
          {isForeign && (
            <ForeignItemNotification
              foreignItemGroupId={itemData?.foreignItemGroupId!}
            />
          )}
          {itemData !== undefined && <DefaultNode itemData={itemData} />}
        </div>
      </div>
    </foreignObject>
  );
}

function ForeignItemNotification({
  foreignItemGroupId,
}: {
  foreignItemGroupId: string;
}) {
  return (
    <div className="mb-2 rounded border border-amber-600 bg-amber-50 px-2 py-1 text-sm text-amber-600">
      <FontAwesomeIcon icon={faCircleInfo} className="mr-1" />
      <span>from Item: </span>
      <a className="font-medium ">{foreignItemGroupId}</a>
    </div>
  );
}

function DefaultNode({ itemData }: { itemData: QuestionnaireItemNodeData }) {
  return (
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
  );
}
