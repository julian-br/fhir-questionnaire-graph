import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Combobox } from "@headlessui/react";
import { useState, ReactNode, useMemo } from "react";
import { useLocation, useRoute } from "wouter";
import { FHIRQuestionnaire } from "../fhir-questionnaire/FHIRQuestionnaire";
import { GRAPH_PAGE_ROUTE } from "../pages/GraphPage";
import { encodeURLParam } from "../utils/urlParam";

interface SearchForItemsComboxBoxProps {
  questionnaire: FHIRQuestionnaire;
  onClose: () => void;
}

export default function SearchForItemsDialog({
  questionnaire,
  onClose,
}: SearchForItemsComboxBoxProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [, params] = useRoute(GRAPH_PAGE_ROUTE);
  const [, setLocation] = useLocation();

  const allItems = useMemo(() => questionnaire.getAllItems(), [questionnaire]);
  const filteredItems = allItems.filter((item) =>
    item.text?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasResults = filteredItems.length > 0;

  function navigateToItem(itemLinkId: string) {
    setLocation(
      `/graph/${params?.questionnaireId}/${encodeURLParam(itemLinkId)}`
    );
    onClose();
  }

  return (
    <SearchForItemDialogContainer onClose={onClose}>
      <Combobox onChange={navigateToItem}>
        <div className="relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute top-1/2 ml-4 -translate-y-1/2 transform text-slate-400"
          ></FontAwesomeIcon>
          <Combobox.Input
            onChange={(event) => setSearchQuery(event.target.value)}
            spellCheck="false"
            className={({ open }) =>
              `${
                open && hasResults ? "rounded-t-xl" : "rounded-xl"
              } block w-full border-b py-4 pl-10 pr-3 placeholder:text-slate-500 focus:outline-none`
            }
            placeholder="search for items..."
          />
        </div>
        <Combobox.Options className="overflow-hidden rounded-b-xl">
          <div className="box-border h-fit max-h-[40rem] overflow-y-auto rounded-b-xl bg-slate-100">
            {filteredItems.map((item) => {
              const group = questionnaire.getGroupOfItem(item.linkId);
              return (
                <Combobox.Option
                  key={item.linkId}
                  value={group?.linkId ?? item.linkId}
                >
                  {({ active }) => (
                    <SearchResult
                      text={item.text ?? ""}
                      group={group?.text}
                      isActive={active}
                    />
                  )}
                </Combobox.Option>
              );
            })}
          </div>
        </Combobox.Options>
      </Combobox>
    </SearchForItemDialogContainer>
  );
}

function SearchResult({
  text,
  isActive,
  group,
}: {
  group?: string;
  text: string;
  isActive: boolean;
}) {
  return (
    <div
      className={`w-full border-b  py-4 px-4 text-left text-sm ${
        isActive ? "text-primary-600" : "bg-white text-slate-600"
      }`}
    >
      {group !== undefined && <div className="text-xs font-light">{group}</div>}
      <div className="font-medium">{text}</div>
    </div>
  );
}

function SearchForItemDialogContainer({
  onClose,
  children,
}: {
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Dialog as="div" className="relative z-30" open onClose={onClose}>
      <div className="fixed inset-0 bg-slate-900 bg-opacity-20 backdrop-blur-sm" />

      <div className="fixed inset-0 z-40 overflow-y-auto">
        <div className="relative flex h-full justify-center">
          <Dialog.Panel className="relative mt-14 h-fit w-[30rem] rounded-xl font-inter opacity-100 shadow-xl">
            {children}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
