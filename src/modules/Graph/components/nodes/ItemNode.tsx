import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QuestionnaireItem, QuestionnaireItemEnableWhen } from "fhir/r4";
import { NodeProps } from "reactflow";
import { getItemAnnotations } from "../../../../utils/getItemAnnotations";
import NodeContainer from "./NodeContainer";

export interface ItemNodeData extends QuestionnaireItem {}

export function ItemNode({ data, selected }: NodeProps<ItemNodeData>) {
  const annotations = getItemAnnotations(data);

  return (
    <NodeContainer>
      <div
        className={`${
          selected ? "border-primary-400 shadow-lg shadow-primary-100" : ""
        } border-content  group w-80 rounded  border-2 border-slate-300 bg-white p-3 hover:border-[3px] hover:border-primary-300`}
      >
        <div className="relative w-full">
          <AnnotationNotification amountOfNotifications={annotations.length} />
          <div className="absolute top-1/2 -left-7 -translate-y-1/2">
            <EnableBehaviorBadge
              enableWhen={data.enableWhen}
              enableBehavior={data.enableBehavior}
            />
          </div>
          <p className="pb-2">
            {data.prefix !== undefined && (
              <span className="mr-2 font-semibold text-primary-800">
                {data.prefix}
              </span>
            )}
            <span className="font-medium text-slate-600">{data.text}</span>
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

function AnnotationNotification({
  amountOfNotifications,
}: {
  amountOfNotifications: number;
}) {
  if (amountOfNotifications === 0) return <></>;

  return (
    <div className="absolute -top-6 -right-6 z-20 flex h-10 w-10 rounded-full bg-primary-600 shadow-md">
      <span className="absolute -top-1 -right-2 mt-1 h-5 w-5 rounded-full bg-primary-400 text-center text-xs font-bold leading-5 text-white">
        {amountOfNotifications}
      </span>
      <FontAwesomeIcon
        className="h-4 w-5 p-3 text-primary-50"
        icon={faMessage}
      />
    </div>
  );
}

function EnableBehaviorBadge({
  enableWhen,
  enableBehavior,
}: {
  enableWhen?: QuestionnaireItemEnableWhen[];
  enableBehavior?: "all" | "any";
}) {
  const amountOfEnableWhens = enableWhen?.length ?? 0;
  if (amountOfEnableWhens <= 1 || enableBehavior !== "all") {
    return <></>;
  }

  return (
    <div className="border-content rounded-lg bg-primary-200 py-2 px-1 text-lg font-semibold text-primary-800 group-hover:border-2 group-hover:border-primary-300 group-hover:text-primary-600">
      &
    </div>
  );
}
