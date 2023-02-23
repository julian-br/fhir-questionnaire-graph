import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QuestionnaireItem } from "fhir/r4";
import { NodeProps } from "reactflow";
import { Link, useRoute } from "wouter";
import { GRAPH_PAGE_ROUTE } from "../../../../pages/GraphPage";
import { encodeURLParam } from "../../../../utils/urlParam";
import NodeContainer from "./NodeContainer";

export interface ForeignItemNodeData {
  foreignItemGroupId: string;
  foreignItemGroupText?: string;
  itemData: QuestionnaireItem;
}

export default function ForeignItemNode({
  data,
}: NodeProps<ForeignItemNodeData>) {
  const itemData = data.itemData;
  return (
    <NodeContainer variant="custom">
      <div className="w-80 rounded-xl border border-slate-300  bg-slate-50 p-4 text-slate-400 ">
        <ForeignItemLink
          foreignItemGroupId={data.foreignItemGroupId}
          foreignItemGroupText={data.foreignItemGroupText}
        />
        <div className="w-full">
          <p className="pb-2">
            {itemData.prefix !== undefined && (
              <span className="mr-2 font-semibold text-slate-600">
                {itemData.prefix}
              </span>
            )}
            <span>{itemData.text}</span>
          </p>
          <span
            className={`p rounded-full border border-slate-300 bg-slate-100 py-1 px-2 text-xs font-semibold text-slate-500`}
          >
            {itemData.type}
          </span>
        </div>
      </div>
    </NodeContainer>
  );
}

function ForeignItemLink({
  foreignItemGroupId,
  foreignItemGroupText,
}: {
  foreignItemGroupId: string;
  foreignItemGroupText?: string;
}) {
  const [_, params] = useRoute(GRAPH_PAGE_ROUTE);
  return (
    <Link
      to={`/graph/${params?.questionnaireId}/${encodeURLParam(
        foreignItemGroupId
      )}`}
      title={`${foreignItemGroupText} (${foreignItemGroupId})`}
      className="group mb-2 block truncate rounded-lg border border-amber-400 bg-amber-50 px-2 py-2 text-sm text-amber-600 "
    >
      <FontAwesomeIcon icon={faCircleInfo} className="mr-1" />
      <span>from: </span>
      <span className="font-semibold group-hover:underline">
        {foreignItemGroupText ? foreignItemGroupText : foreignItemGroupId}
      </span>
    </Link>
  );
}
