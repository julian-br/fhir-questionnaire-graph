import { QuestionnaireItem } from "fhir/r4";
import { useLocation, useRoute } from "wouter";
import { encodeURLParam } from "../utils/urlParam";
import Button from "./common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup, faMessage } from "@fortawesome/free-solid-svg-icons";
import { GRAPH_PAGE_ROUTE } from "../pages/GraphPage";
import { getItemAnnotations } from "../utils/getItemAnnotations";

interface QuestionnaireItemsNavProps {
  items: QuestionnaireItem[];
  activeItemId: string;
  className?: string;
}

export default function QuestionnaireItemsNav({
  items,
  activeItemId,
}: QuestionnaireItemsNavProps) {
  const [, setLocation] = useLocation();
  const [, params] = useRoute(GRAPH_PAGE_ROUTE);
  const amountOfItems = items.length;

  function navigateToItem(itemLinkId: string) {
    setLocation(
      `/graph/${params?.questionnaireId}/${encodeURLParam(itemLinkId)}`
    );
  }

  function checkIfItemHasAnnotation(item: QuestionnaireItem) {
    if (item.type === "group") {
      for (const childItem of item.item!) {
        if (getItemAnnotations(childItem).length > 0) {
          return true;
        }
      }
    }
    return getItemAnnotations(item).length > 0;
  }

  return (
    <nav className="border-box w-[20rem] select-none">
      <h3 className="mb-2 ml-6 text-base font-semibold text-primary-900">
        <FontAwesomeIcon icon={faLayerGroup} className="mr-1 h-4 " />
        <span className="text-primary-900"> Items ({amountOfItems})</span>
      </h3>
      <div className="z-10 mt-1 ml-1 max-h-[90vh] overflow-y-auto overflow-x-hidden pl-2 pr-3">
        {items.map((item) => (
          <QuestionnaireItemsNavEntry
            key={item.linkId}
            hasAnnotation={checkIfItemHasAnnotation(item)}
            onClick={() => navigateToItem(item.linkId)}
            isActive={item.linkId === activeItemId}
            prefix={item.prefix}
            text={item.text ?? ""}
            itemId={item.linkId}
          />
        ))}
      </div>
    </nav>
  );
}

function QuestionnaireItemsNavEntry({
  text,
  isActive,
  onClick,
  prefix,
  itemId,
  hasAnnotation,
}: {
  text: string;
  isActive: boolean;
  hasAnnotation: boolean;
  onClick: () => void;
  prefix?: string;
  itemId: string;
}) {
  return (
    <Button
      onClick={onClick}
      variant="custom"
      className={`z-20 block w-full rounded-xl px-4 text-left text-xs ${
        isActive
          ? "bg-primary-200 py-3 font-bold text-primary-600"
          : `py-2 font-semibold ${
              hasAnnotation ? "text-primary-600" : "text-slate-500"
            } hover:bg-slate-200 hover:text-primary-600`
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="mr-1 truncate">
          {prefix !== undefined && <strong className="mr-1">{prefix}</strong>}
          <span className="" title={`${text} (${itemId})`}>
            {text}
          </span>
        </p>
        {hasAnnotation && <FontAwesomeIcon icon={faMessage} />}
      </div>
    </Button>
  );
}
