import { ReactNode } from "react";
import { Handle, Position } from "reactflow";

interface NodeContainerProps {
  children: ReactNode;
}

export default function NodeContainer({ children }: NodeContainerProps) {
  return (
    <div>
      <Handle
        className="invisible translate-x-1"
        type="target"
        position={Position.Left}
      />
      <div className=" bg-white">{children}</div>
      <Handle
        className="invisible -translate-x-12"
        type="source"
        position={Position.Right}
      />
    </div>
  );
}
