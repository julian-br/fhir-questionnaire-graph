import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiagramProject } from "@fortawesome/free-solid-svg-icons";

interface NavbarProps {
  children?: ReactNode[] | ReactNode;
}

function Navbar({ children }: NavbarProps) {
  return (
    <nav className="z-20 flex h-16 items-center border-b border-slate-200 bg-white px-7 py-3 shadow-sm shadow-secondary-light">
      <Brand />
      {children}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center">
      <FontAwesomeIcon className="h-8 text-primary" icon={faDiagramProject} />
      <span className="ml-3 text-2xl font-semibold text-slate-700">
        <strong className="font-bold"> FHIR</strong> Questionnaire Graph
      </span>
    </div>
  );
}

function NavbarControls({ children }: { children: ReactNode }) {
  return <div className="ml-auto flex gap-3">{children}</div>;
}

Navbar.Controls = NavbarControls;
export default Navbar;
