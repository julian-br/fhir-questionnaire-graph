import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Combobox } from "@headlessui/react";
import Button from "./common/Button";
import { useState, ReactNode } from "react";

interface SearchForItemsComboxBoxProps {
  onClose: () => void;
}

export default function SearchForItemsComboxBox({
  onClose,
}: SearchForItemsComboxBoxProps) {
  const values = ["Avatars", "Alerts", "Sidebar"];
  const [selectedEntry, setSelectedEntry] = useState();
  return (
    <Dialog as="div" className="relative z-30" open onClose={onClose}>
      <div className="fixed inset-0 bg-slate-900 bg-opacity-20 backdrop-blur-sm" />

      <div className="fixed inset-0 z-40 overflow-y-auto">
        <div className="relative flex h-full justify-center">
          <Dialog.Panel className="relative mt-14 h-fit w-[30rem] rounded-xl font-inter opacity-100 shadow-xl">
            <Combobox value={selectedEntry} onChange={setSelectedEntry}>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute top-1/2 ml-4 -translate-y-1/2 transform text-slate-400"
                ></FontAwesomeIcon>
                <Combobox.Input
                  className=" block w-full rounded-t-xl border-b py-4 pl-10 pr-3 placeholder:text-slate-500 focus:outline-none"
                  placeholder="search for items..."
                  onChange={(event) => null}
                />
              </div>
              <Combobox.Options className="box-border h-fit overflow-y-auto rounded-b-xl bg-slate-100">
                {values.map((value) => (
                  <Combobox.Option
                    key={value}
                    value={value}
                    className="w-full border-b bg-white py-4 px-4 text-left font-semibold text-slate-600"
                  >
                    {value}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Combobox>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
