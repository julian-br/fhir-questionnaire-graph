import { Questionnaire, QuestionnaireItem } from "fhir/r4";
import { Link, useLocation, useRoute } from "wouter";
import { encodeURLParam } from "../utils/urlParam";
import Button from "./common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faLayerGroup,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { GRAPH_PAGE_ROUTE } from "../pages/GraphPage";
import { getItemAnnotations } from "../utils/getItemAnnotations";
import { findGroupOfItem } from "../modules/Graph/utils/findGroupOfItem";
import { findItemByLinkId } from "../utils/findItemByLinkId";
import { Children, ReactNode, useMemo, useState } from "react";

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
  const [, params] = useRoute(GRAPH_PAGE_ROUTE);

  function navigateToItem(itemLinkId: string) {
    setLocation(
      `/graph/${params?.questionnaireId}/${encodeURLParam(itemLinkId)}`
    );
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
      <div className="z-10 mt-1 ml-1 max-h-[90vh] overflow-y-auto overflow-x-hidden  pl-2 pr-3">
        {questionnaire.item?.map((item) => {
          if (item.type === "group") {
            return (
              <GroupItemNavEntry
                key={item.linkId}
                item={item}
                onClick={() => navigateToItem(item.linkId)}
                isActive={groupOfActiveItem === item.linkId}
              >
                {item.item?.map((nestedItem) => (
                  <ItemNavEntry
                    isActive={nestedItem.linkId === activeItemId}
                    onClick={() => navigateToItem(nestedItem.linkId)}
                    hasAnnotation={false}
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
                hasAnnotation={false}
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

function GroupItemNavEntry({
  isActive,
  item,
  onClick,
  children,
}: {
  isActive: boolean;
  item: QuestionnaireItem;
  onClick: () => void;
  children: ReactNode;
}) {
  const itemInGroupHasAnnotation = item.item?.some(
    (item) => getItemAnnotations(item).length > 0
  );

  return (
    <div>
      <Button
        onClick={onClick}
        variant="custom"
        className={`z-20 block w-full rounded px-2 py-2 text-left text-xs ${
          isActive
            ? "bg-primary-200 font-bold text-primary-600"
            : `py-2 font-semibold ${
                itemInGroupHasAnnotation ? "text-primary-600" : "text-slate-500"
              } hover:bg-slate-200 hover:text-primary-600`
        }`}
      >
        <div className="flex w-full items-center">
          <FontAwesomeIcon
            icon={faChevronRight}
            className={`${
              isActive
                ? "mb-1 rotate-90 font-bold text-primary-500"
                : "text-slate-400"
            } mr-2 h-3 `}
          />
          <p className="mr-1 truncate">
            {item.prefix !== undefined && (
              <strong className="mr-1">{item.prefix}</strong>
            )}
            <span className="" title={`${item.text} (${item.linkId})`}>
              {item.text}
            </span>
          </p>
          {itemInGroupHasAnnotation && (
            <FontAwesomeIcon className="ml-auto" icon={faMessage} />
          )}
        </div>
      </Button>
      {isActive && (
        <div className="flex w-full">
          <div className="my-2 ml-3  mr-2 w-1 border-r-2 border-slate-300"></div>
          <div className=" w-full overflow-hidden whitespace-nowrap">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

function ItemNavEntry({
  isActive,
  item,
  hasAnnotation,
  onClick,
}: {
  isActive: boolean;
  item: QuestionnaireItem;
  hasAnnotation: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      variant="custom"
      className={`z-20 block w-full rounded px-2 py-2 text-left text-xs ${
        isActive
          ? "bg-primary-200 font-bold text-primary-600"
          : `py-2 font-semibold ${
              hasAnnotation ? "text-primary-600" : "text-slate-500"
            } hover:bg-slate-200 hover:text-primary-600`
      }`}
    >
      <div className="flex items-center">
        <p className="mr-1 truncate">
          {item.prefix !== undefined && (
            <strong className="mr-1">{item.prefix}</strong>
          )}
          <span className="" title={`${item.text} (${item.linkId})`}>
            {item.text}
          </span>
        </p>
        {hasAnnotation && <FontAwesomeIcon icon={faMessage} />}
      </div>
    </Button>
  );
}
