import { Questionnaire, QuestionnaireItem } from "fhir/r4";
import { useLocation, useRoute } from "wouter";
import Button from "./common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faLayerGroup,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { constructGraphPageUrl, GRAPH_PAGE_ROUTE } from "../pages/GraphPage";
import { getItemAnnotations } from "../utils/getItemAnnotations";
import { findGroupOfItem } from "../modules/Graph/utils/findGroupOfItem";
import { findItemByLinkId } from "../utils/findItemByLinkId";
import { ReactNode, useMemo } from "react";

interface QuestionnaireItemsNavProps {
  questionnaire: Questionnaire;
  activeItemId: string;
  className?: string;
}

export default function QuestionnaireNav({
  questionnaire,
  activeItemId,
}: QuestionnaireItemsNavProps) {
  const [, setLocation] = useLocation();

  function navigateToItem(itemLinkId: string) {
    setLocation(constructGraphPageUrl(questionnaire.id ?? "", itemLinkId));
  }

  const groupOfActiveItem = useMemo(() => {
    const activeItem = findItemByLinkId(activeItemId, questionnaire);
    if (activeItem?.type === "group" || activeItem === undefined) {
      return activeItemId;
    }
    return findGroupOfItem(activeItem, questionnaire)?.linkId;
  }, [activeItemId]);

  return (
    <nav className="border-box w-[22rem] select-none">
      <h3 className="mb-1 ml-4 text-base font-semibold text-primary-900">
        <FontAwesomeIcon icon={faLayerGroup} className="mr-1 h-4 " />
        <span className="text-primary-900"> Items</span>
      </h3>
      <div className="z-10 mt-1 ml-1 max-h-[85vh] overflow-y-auto overflow-x-hidden pr-4 pl-2">
        {questionnaire.item?.map((item) => {
          if (item.type === "group") {
            const isGroupOfActiveItem = groupOfActiveItem === item.linkId;
            const isActiveItem = activeItemId === item.linkId;
            return (
              <GroupItemNavEntry
                key={item.linkId}
                item={item}
                onClick={() => navigateToItem(item.linkId)}
                isActive={isActiveItem}
                isOpen={isGroupOfActiveItem || isActiveItem}
              >
                {item.item?.map((nestedItem) => (
                  <ItemNavEntry
                    key={nestedItem.linkId}
                    isActive={nestedItem.linkId === activeItemId}
                    onClick={() => navigateToItem(nestedItem.linkId)}
                    item={nestedItem}
                  />
                ))}
              </GroupItemNavEntry>
            );
          } else {
            return (
              <ItemNavEntry
                key={item.linkId}
                item={item}
                onClick={() => navigateToItem(item.linkId)}
                isActive={item.linkId === activeItemId}
              />
            );
          }
        })}
      </div>
    </nav>
  );
}

function BaseNavEntry({
  children,
  isActive,
  onClick,
}: {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      variant="custom"
      className={`${
        isActive
          ? " bg-primary-200 font-bold text-slate-600"
          : "font-medium hover:bg-slate-200"
      } z-20 block w-full rounded px-2 py-2 text-left text-[0.8rem] text-slate-500`}
    >
      {children}
    </Button>
  );
}

function GroupItemNavEntry({
  isActive,
  item,
  onClick,
  children,
  isOpen,
}: {
  isActive: boolean;
  item: QuestionnaireItem;
  onClick: () => void;
  children: ReactNode;
  isOpen: boolean;
}) {
  const itemInGroupHasAnnotations = item.item?.some(
    (item) => getItemAnnotations(item).length > 0
  );

  return (
    <>
      <BaseNavEntry isActive={isActive} onClick={onClick}>
        <div className="flex w-full items-center">
          <FontAwesomeIcon
            icon={faChevronRight}
            className={`${isOpen ? "mb-1 rotate-90" : ""} mr-2 h-3 `}
          />
          <p
            className={`${
              itemInGroupHasAnnotations && !isActive
                ? "font-semibold text-primary-600"
                : ""
            } ${isOpen ? "font-bold" : ""} mr-1 truncate`}
          >
            {item.prefix !== undefined && (
              <strong className="mr-1">{item.prefix}</strong>
            )}
            <span title={`${item.text} (${item.linkId})`}>{item.text}</span>
          </p>
        </div>
      </BaseNavEntry>
      {isOpen && (
        <div className="flex w-full">
          <div className="my-2 ml-2  mr-2 w-1 border-r-2 border-slate-300"></div>
          <div className=" w-full overflow-hidden whitespace-nowrap">
            {children}
          </div>
        </div>
      )}
    </>
  );
}

function ItemNavEntry({
  isActive,
  item,
  onClick,
}: {
  isActive: boolean;
  item: QuestionnaireItem;
  onClick: () => void;
}) {
  const hasAnnotations = getItemAnnotations(item).length > 0;

  return (
    <BaseNavEntry onClick={onClick} isActive={isActive}>
      <div className="flex items-center">
        <p
          className={`${
            hasAnnotations && !isActive ? "text-primary-600" : ""
          } mr-1 truncate`}
        >
          {item.prefix !== undefined && (
            <strong className="mr-1">{item.prefix}</strong>
          )}
          <span title={`${item.text} (${item.linkId})`}>{item.text}</span>
        </p>
        {hasAnnotations && (
          <FontAwesomeIcon
            className="ml-auto text-primary-600"
            icon={faMessage}
          />
        )}
      </div>
    </BaseNavEntry>
  );
}
