import { ReactNode } from "react";

export default function InputLabel({
  children,
  className: passedClassName,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <label
      className={`mb-1 block text-sm font-medium text-slate-500 ${
        passedClassName ?? ""
      }`}
    >
      {children}
    </label>
  );
}
