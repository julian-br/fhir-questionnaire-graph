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
    <nav className="relative border-r border-slate-200 bg-white">
      <div className="absolute flex w-full pt-5">
        <Button
          onClick={toggleIsOpen}
          variant="custom"
          className={`${
            isOpen ? "ml-auto mr-3" : "mx-auto"
          }  rounded-lg  p-2 text-lg font-bold text-slate-400 hover:bg-secondary-light hover:text-primary`}
        >
          <FontAwesomeIcon className="h-6" icon={faBars} />
        </Button>
      </div>
      <div className={isOpen ? "mt-6 w-80" : "w-16"}>{isOpen && children}</div>
    </nav>
  );
}
