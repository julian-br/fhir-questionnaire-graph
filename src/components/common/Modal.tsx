import { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface Props {
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: Props) {
  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={onClose}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="fixed inset-0 z-40 overflow-y-auto">
          <div className="relative flex min-h-full items-end justify-center p-4 text-center sm:items-center">
            <Dialog.Panel className="relative rounded-xl bg-white font-inter opacity-100 shadow-xl transition-all">
              <div className="static text-left">{children}</div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
