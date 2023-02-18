import { QuestionnaireItem } from "fhir/r4";
import { useLocation, useRoute } from "wouter";
import { encodeURLParam } from "../utils/urlParam";
import Button from "./common/Button";

interface QuestionnaireItemsNavProps {
  items: QuestionnaireItem[];
  activeItemId: string;
  className?: string;
}

export default function QuestionnaireItemsNav({
  items,
  activeItemId,
  className,
}: QuestionnaireItemsNavProps) {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/graph/:questionnaireId/:itemLinkId");
  const amountOfItems = items.length;

  function changeLocation(itemLinkId: string) {
    setLocation(
      `/graph/${params?.questionnaireId}/${encodeURLParam(itemLinkId)}`
    );
  }

  return (
    <nav className={className}>
      <h3 className="ml-5 mb-1 text-lg font-medium">Items ({amountOfItems})</h3>
      <div className="h-100 flex flex-col overflow-auto">
        {items.map((item) => (
          <QuestionnaireItemsNavEntry
            key={item.linkId}
            onClick={() => changeLocation(item.linkId)}
            isActive={item.linkId === activeItemId}
            prefix={item.prefix ?? ""}
            title={item.linkId}
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
  prefix: string;
}) {
  return (
    <Button
      onClick={onClick}
      variant="custom"
      className={`px-5  text-left text-xs font-medium  ${
        isActive
          ? "bg-primary py-3 font-extrabold text-white"
          : "py-2 text-slate-500 hover:bg-secondary-light hover:text-primary"
      }`}
    >
      <p>
        <strong className="mr-2">{prefix}</strong>
        {title}
      </p>
    </Button>
  );
}
