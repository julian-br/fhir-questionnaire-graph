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
      <div className="w-[350px] rounded border border-slate-300 bg-white p-4">
        {children}
      </div>
      <Handle
        className="invisible -translate-x-10"
        type="source"
        position={Position.Right}
      />
    </div>
  );
}
