import { faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NodeProps } from "reactflow";
import { Link, useRoute } from "wouter";
import { GRAPH_PAGE_ROUTE } from "../../../../pages/GraphPage";
import { encodeURLParam } from "../../../../utils/urlParam";
import { GraphItem } from "../Graph";
import NodeContainer from "./NodeContainer";

export interface ForeignItemNodeData extends GraphItem {
  foreignGroup: NonNullable<GraphItem["foreignGroup"]>;
}

export default function ForeignItemNode({
  data,
}: NodeProps<ForeignItemNodeData>) {
  // only display the foreign item link for the first item of the foreign dependency tree
  const displayForeignItemLink = data.enableWhen === undefined;
  return (
    <NodeContainer>
      <div className="w-80 rounded border-2 border-slate-300 bg-slate-100 p-4 text-slate-500 ">
        {displayForeignItemLink && (
          <ForeignItemLink
            foreignItemGroupId={data.foreignGroup.linkId}
            foreignItemGroupText={data.foreignGroup.text ?? ""}
          />
        )}
        <div className="w-full">
          <p className="pb-2">
            <span>{data.text}</span>
          </p>
          <span
            className={`p rounded-full border border-slate-300 bg-slate-200 py-1 px-2 text-xs font-semibold text-slate-500`}
          >
            {data.type}
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
      className="group  block truncate rounded text-sm text-amber-600 "
    >
      <FontAwesomeIcon icon={faShareFromSquare} className="mr-1 scale-x-[-1]" />
      <span>from: </span>
      <span className="font-semibold group-hover:underline">
        {foreignItemGroupText ?? foreignItemGroupId}
      </span>
    </Link>
  );
}
