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
    <nav className="border-box w-[21rem] select-none">
      <h3 className="mb-2 ml-6 text-lg font-semibold text-slate-700">
        <FontAwesomeIcon
          icon={faLayerGroup}
          className="mr-2 h-5 text-slate-600"
        />
        Items ({amountOfItems})
      </h3>
      <div className="z-10 mt-1 ml-1 max-h-[90vh] overflow-y-auto overflow-x-hidden px-3">
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
      className={`z-20 block w-full rounded-lg px-4 text-left text-[0.76rem] font-medium  ${
        isActive
          ? "bg-primary-600 py-3 font-extrabold text-white"
          : "py-2 text-slate-700 hover:bg-primary-100 hover:text-primary-600"
      }`}
    >
      <p className="truncate">
        {prefix !== undefined && <strong className="mr-1">{prefix}</strong>}
        <span title={`${text} (${itemId})`}>{text}</span>
      </p>
    </Button>
  );
}
