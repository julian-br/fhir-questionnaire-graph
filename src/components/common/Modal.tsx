import { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCross, faXmark } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

interface Props {
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: Props) {
  return (
    <Dialog as="div" open className="relative z-30" onClose={onClose}>
      <div className="fixed inset-0 bg-slate-900 bg-opacity-20 backdrop-blur-sm" />

      <div className="fixed inset-0 z-40 overflow-y-auto">
        <div className="relative flex min-h-full items-center  justify-center p-4 pb-36 text-center">
          <Dialog.Panel className="relative min-w-[37rem] rounded-xl bg-white p-7 font-inter opacity-100 shadow-xl transition-all">
            <Button
              variant="custom"
              className="absolute right-5 top-4 h-7 rounded-lg py-1 px-2 text-slate-400 hover:bg-slate-100 hover:text-primary-500"
              onClick={() => (onClose !== undefined ? onClose() : null)}
            >
              <FontAwesomeIcon icon={faXmark} className="h-full" />
            </Button>
            <div className="static text-left">{children}</div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
