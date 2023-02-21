import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiagramProject } from "@fortawesome/free-solid-svg-icons";

interface NavbarProps {
  children?: ReactNode[] | ReactNode;
}

function Navbar({ children }: NavbarProps) {
  return (
    <nav className="z-20 flex items-center bg-white px-7 py-4 shadow">
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
  return <div className="ml-auto flex gap-3">{children}</div>;
}

Navbar.Controls = NavbarControls;
export default Navbar;
