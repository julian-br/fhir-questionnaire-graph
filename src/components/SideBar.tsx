import { ReactNode, useState } from "react";
import Button from "./common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

interface Props {
  children: ReactNode;
}

export default function SideBar({ children }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  function toggleIsOpen() {
    setIsOpen(!isOpen);
  }

  return (
    <nav className="relative border-r bg-slate-100">
      <div className="absolute flex w-full pt-4">
        <Button
          onClick={toggleIsOpen}
          variant="custom"
          className={`${
            isOpen ? "ml-auto mr-2" : "mx-auto"
          }   rounded-lg px-2 py-1 text-lg font-bold text-slate-500 hover:bg-primary-100 hover:text-primary-600`}
        >
          <FontAwesomeIcon className="h-6" icon={faBars} />
        </Button>
      </div>
      <div className={isOpen ? "mt-6" : "w-16"}>{isOpen && children}</div>
    </nav>
  );
}
