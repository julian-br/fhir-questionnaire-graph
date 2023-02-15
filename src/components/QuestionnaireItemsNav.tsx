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
      <h3 className="ml-5 mb-3 text-xl font-medium">Items ({amountOfItems})</h3>
      <div className="flex h-[700px] flex-col overflow-auto">
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
      className={`px-5 py-2 text-left text-sm  ${
        isActive
          ? "bg-primary font-semibold text-white"
          : "hover:bg-secondary-light hover:text-primary"
      }`}
    >
      <p>
        <strong className="mr-2">{prefix}</strong>
        {title}
      </p>
    </Button>
  );
}
