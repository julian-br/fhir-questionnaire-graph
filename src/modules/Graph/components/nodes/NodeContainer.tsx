import { ReactNode } from "react";
import { Handle, Position } from "reactflow";

interface NodeContainerProps {
  children: ReactNode;
  variant?: keyof typeof nodeContainerVariants;
}

const nodeContainerVariants = {
  default:
    "rounded-xl border border-slate-300 hover:border-2 hover:border-primary-400 z-20 box-content overflow-hidden",
  custom: "",
};

export default function NodeContainer({
  children,
  variant,
}: NodeContainerProps) {
  return (
    <div>
      <Handle
        className="invisible translate-x-1"
        type="target"
        position={Position.Left}
      />
      <div className={nodeContainerVariants[variant ?? "default"]}>
        {children}
      </div>
      <Handle
        className="invisible -translate-x-14"
        type="source"
        position={Position.Right}
      />
    </div>
  );
}
