import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QuestionnaireItem } from "fhir/r4";
import { NodeProps } from "reactflow";
import { Link, useRoute } from "wouter";
import { encodeURLParam } from "../../../../utils/urlParam";
import NodeContainer from "./NodeContainer";

export interface ForeignItemNodeData {
  foreignItemGroupId: string;
  itemData: QuestionnaireItem;
}

export default function ForeignItemNode({
  data,
}: NodeProps<ForeignItemNodeData>) {
  const itemData = data.itemData;
  return (
    <NodeContainer>
      <div className="w-80 rounded border border-slate-300 bg-slate-50 p-4 text-slate-400">
        <ForeignItemNotification
          foreignItemGroupId={data.foreignItemGroupId ?? ""}
        />
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
            className={`p rounded-full border border-slate-300 bg-slate-100 py-1 px-2 text-sm font-semibold text-slate-500`}
          >
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
  const [, params] = useRoute("/graph/:questionnaireId/:itemLinkId");
  return (
    <Link
      to={`/graph/${params?.questionnaireId}/${encodeURLParam(
        foreignItemGroupId
      )}`}
      className="mb-2 block truncate rounded border border-amber-400 bg-amber-50 px-2 py-1 text-sm text-amber-600"
      onClick={() => console.log("test")}
    >
      <FontAwesomeIcon icon={faCircleInfo} className="mr-1" />
      <span>from Item: </span>
      <span className="font-semibold underline" title={foreignItemGroupId}>
        {foreignItemGroupId}
      </span>
    </Link>
  );
}
