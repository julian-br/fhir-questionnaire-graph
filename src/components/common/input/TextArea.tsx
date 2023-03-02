import { TextareaHTMLAttributes } from "react";
import InputLabel from "./InputLabel";

interface Props
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onInput"> {
  label?: string;
  onInput?: (value: string) => void;
}

export default function TextArea({
  label,
  className: passedClassName,
  onInput,
  ...htmlTextAreaProps
}: Props) {
  function handleInput(value: string) {
    if (onInput !== undefined) {
      onInput(value);
    }
  }

  return (
    <div className={`${passedClassName ?? ""}`}>
      <InputLabel>{label}</InputLabel>
      <textarea
        {...htmlTextAreaProps}
        onChange={(e) => handleInput(e.target.value)}
        className="block w-full resize-none rounded-lg border border-slate-200 bg-slate-100 p-2 text-base placeholder:text-slate-400 focus:border-primary-400   focus-visible:outline-primary-300"
      />
    </div>
  );
}
