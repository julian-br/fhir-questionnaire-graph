import { QuestionnaireItem } from "fhir/r4";
import { useLocation, useRoute } from "wouter";
import { encodeURLParam } from "../utils/urlParam";
import Button from "./common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";

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
  const [, params] = useRoute("/graph/:questionnaireId/:itemLinkId");
  const amountOfItems = items.length;

  function navigateToItem(itemLinkId: string) {
    setLocation(
      `/graph/${params?.questionnaireId}/${encodeURLParam(itemLinkId)}`
    );
  }

  return (
    <nav className="border-box w-[20rem] select-none">
      <h3 className="mb-2 ml-6 text-base font-semibold text-primary-900">
        <FontAwesomeIcon icon={faLayerGroup} className="mr-1 h-4 " />
        <span className="text-primary-900"> Items ({amountOfItems})</span>
      </h3>
      <div className="z-10 mt-1 ml-1 max-h-[90vh] overflow-y-auto overflow-x-hidden pl-3 pr-5">
        {items.map((item) => (
          <QuestionnaireItemsNavEntry
            key={item.linkId}
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
}: {
  text: string;
  isActive: boolean;
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
          : "py-2 font-medium text-slate-700 hover:bg-slate-200 hover:text-primary-600"
      }`}
    >
      <p className="truncate">
        {prefix !== undefined && <strong className="mr-1">{prefix}</strong>}
        <span title={`${text} (${itemId})`}>{text}</span>
      </p>
    </Button>
  );
}
