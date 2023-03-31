import { Menu } from "@headlessui/react";
import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

interface ContextMenuProps {
  children: ReactNode[] | ReactNode;
}

function ContextMenu({ children }: ContextMenuProps) {
  return (
    <div className="h-full">
      <Menu as="nav" className="relative">
        <Menu.Button className="rounded-full px-2 py-2 text-slate-400 hover:bg-slate-100">
          <FontAwesomeIcon className="h-6" icon={faEllipsisVertical} />
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-1 w-56 rounded border bg-white py-3 shadow">
          {children}
        </Menu.Items>
      </Menu>
    </div>
  );
}

function ContextMenuEntry({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: ReactNode;
}) {
  function handleEntryClicked() {
    if (onClick !== undefined) {
      onClick();
    }
  }

  return (
    <Menu.Item>
      <div
        onClick={handleEntryClicked}
        className="w-full cursor-pointer py-2 px-3 text-left text-sm text-slate-600 hover:bg-slate-200"
      >
        <div>{children}</div>
      </div>
    </Menu.Item>
  );
}

ContextMenu.Entry = ContextMenuEntry;
export default ContextMenu;
