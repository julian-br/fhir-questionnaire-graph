import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiagramProject } from "@fortawesome/free-solid-svg-icons";

interface NavbarProps {
  children?: ReactNode[] | ReactNode;
}

function Navbar({ children }: NavbarProps) {
  return (
    <nav className="z-10 flex items-center border-b bg-white  py-1 pl-7 pr-2 ">
      <Brand />
      {children}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center text-primary-600">
      <FontAwesomeIcon className="h-7 " icon={faDiagramProject} />
      <span className="ml-3 text-xl font-normal ">
        <strong className="mr-2 font-bold">FHIR</strong>
        Questionnaire Graph
      </span>
    </div>
  );
}

function NavbarControls({ children }: { children: ReactNode }) {
  return <div className="ml-auto flex items-center gap-1">{children}</div>;
}

Navbar.Controls = NavbarControls;
export default Navbar;
