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
      <div>{children}</div>
      <Handle
        className="invisible -translate-x-6"
        type="source"
        position={Position.Right}
      />
    </div>
  );
}
