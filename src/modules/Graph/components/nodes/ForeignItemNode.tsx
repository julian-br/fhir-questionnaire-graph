import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QuestionnaireItem } from "fhir/r4";
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
  return (
    <NodeContainer>
      <div className="w-80 rounded-lg border border-slate-300  bg-slate-50 p-4 text-slate-400 ">
        <ForeignItemLink
          foreignItemGroupId={data.foreignGroup.linkId}
          foreignItemGroupText={data.foreignGroup.text ?? ""}
        />
        <div className="w-full">
          <p className="pb-2">
            {data.prefix !== undefined && (
              <span className="mr-2 font-semibold text-slate-600">
                {data.prefix}
              </span>
            )}
            <span>{data.text}</span>
          </p>
          <span
            className={`p rounded-full border border-slate-300 bg-slate-100 py-1 px-2 text-xs font-semibold text-slate-500`}
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
      className="group mb-2 block truncate rounded-lg border border-amber-400 bg-amber-50 px-2 py-1 text-sm text-amber-600 "
    >
      <FontAwesomeIcon icon={faCircleInfo} className="mr-1" />
      <span>from: </span>
      <span className="font-semibold group-hover:underline">
        {foreignItemGroupText ? foreignItemGroupText : foreignItemGroupId}
      </span>
    </Link>
  );
}
