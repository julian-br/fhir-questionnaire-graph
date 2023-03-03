import { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface Props {
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: Props) {
  return (
    <Dialog as="div" open className="relative z-30" onClose={onClose}>
      <div className="fixed inset-0 bg-slate-900 bg-opacity-20 backdrop-blur-sm" />

      <div className="fixed inset-0 z-40 overflow-y-auto">
        <div className="relative flex min-h-full  items-center justify-center p-4 text-center">
          <Dialog.Panel className="relative min-w-[37rem] rounded-xl bg-white p-7 font-inter opacity-100 shadow-xl transition-all">
            <div className="static text-left">{children}</div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
