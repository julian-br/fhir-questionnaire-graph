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
    <nav>
      <h3 className="mb-2 ml-2 text-lg font-semibold text-slate-600">
        <FontAwesomeIcon
          icon={faLayerGroup}
          className="mr-2 h-5 text-slate-500"
        />
        Items ({amountOfItems})
      </h3>
      <div className="h-100 mt-1 flex w-80 flex-col">
        {items.map((item) => (
          <QuestionnaireItemsNavEntry
            key={item.linkId}
            onClick={() => navigateToItem(item.linkId)}
            isActive={item.linkId === activeItemId}
            prefix={item.prefix}
            title={item.text ?? ""}
          />
        ))}
      </div>
    </nav>
  );
}

function QuestionnaireItemsNavEntry({
  title,
  isActive,
  onClick,
  prefix,
}: {
  title: string;
  isActive: boolean;
  onClick: () => void;
  prefix?: string;
}) {
  return (
    <Button
      onClick={onClick}
      variant="custom"
      className={`w-full rounded-lg px-4 text-left text-[0.76rem] font-medium ${
        isActive
          ? "bg-primary py-3 font-extrabold text-white"
          : "py-2 text-slate-500 hover:bg-secondary-light hover:text-primary"
      }`}
    >
      <p className="truncate">
        {prefix !== undefined && <strong className="mr-1">{prefix}</strong>}
        <span title={title}>{title}</span>
      </p>
    </Button>
  );
}
