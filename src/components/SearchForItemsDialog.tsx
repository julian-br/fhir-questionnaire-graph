import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Combobox } from "@headlessui/react";
import { QuestionnaireItem } from "fhir/r4";
import { useState, ReactNode, useMemo } from "react";

interface RootItem {
  item?: QuestionnaireItem[];
}

interface SearchEntry {
  group?: string;
  text: string;
  linkTo: string;
}
interface SearchForItemsDialogProps<T extends RootItem> {
  root: T;
  onClose: () => void;
  onEntrySelect: (entry: SearchEntry) => void;
}

export default function SearchForItemsDialog<T extends RootItem>({
  root,
  onClose,
  onEntrySelect,
}: SearchForItemsDialogProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");

  const searchEntries = useMemo(() => {
    const entries: SearchEntry[] = [];
    root.item?.forEach((item) => {
      entries.push({
        text: item.text ?? item.linkId,
        linkTo: item.linkId,
      });

      item.item?.forEach((childItem) => {
        entries.push({
          group: item.text,
          text: childItem.text ?? childItem.linkId,
          linkTo: childItem.linkId,
        });
      });
    });
    return entries;
  }, [root]);
  const matchingSearchEntries = useMemo(
    () =>
      searchEntries.filter((searchEntry) =>
        searchEntry.text.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );
  const hasResults = matchingSearchEntries.length > 0;

  function handleEntrySelected(selectedEntry: SearchEntry) {
    onEntrySelect(selectedEntry);
    onClose();
  }

  return (
    <SearchForItemDialogContainer onClose={onClose}>
      <Combobox onChange={handleEntrySelected} value={null}>
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
                open && hasResults ? "rounded-t-lg" : "rounded-lg"
              } block w-full border-b py-4 pl-10 pr-3 placeholder:text-slate-500 focus:outline-none`
            }
            placeholder="search for items..."
          />
        </div>
        <Combobox.Options as="ul" className="overflow-hidden rounded-b-xl">
          <div className="box-border h-fit max-h-[40rem] overflow-y-auto rounded-b-xl bg-slate-100">
            {matchingSearchEntries.map((searchEntry, index) => (
              <Combobox.Option as="li" key={index} value={searchEntry}>
                {({ active }) => (
                  <SearchResult
                    text={searchEntry.text}
                    group={searchEntry.group}
                    isActive={active}
                  />
                )}
              </Combobox.Option>
            ))}
          </div>
        </Combobox.Options>
      </Combobox>
    </SearchForItemDialogContainer>
  );
}

function SearchResult({
  group,
  text,
  isActive,
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
