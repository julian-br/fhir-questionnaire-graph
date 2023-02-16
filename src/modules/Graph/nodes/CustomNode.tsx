import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Handle, Position } from "reactflow";

export function CustomNode({ data }) {
  return (
    <div className="relativ">
      <Handle className="invisible" type="target" position={Position.Left} />
      <div className="w-[350px] rounded border border-slate-300 bg-white p-4">
        {data.isForeign && (
          <ForeignItemNotification
            foreignItemGroupId={data.foreignItemGroupId}
          />
        )}
        <div className="w-full">
          <p className="pb-2">
            {data.itemData.prefix !== undefined && (
              <span className="mr-2 font-semibold text-primary">
                {data.itemData.prefix}
              </span>
            )}
            <span>{data.itemData.text}</span>
          </p>
          <span className="p rounded-full border border-secondary bg-secondary-light py-1 px-2 text-sm font-semibold text-primary">
            {data.itemData.type}
          </span>
        </div>
      </div>
      <Handle className="invisible" type="source" position={Position.Right} />
    </div>
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
