import { InputHTMLAttributes } from "react";
import InputLabel from "./InputLabel";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "onInput"> {
  label?: string;
  errorMessage?: string;
  onInput?: (value: string) => void;
}

export default function TextInput({
  label,
  className: passedClassName,
  onInput,
  ...htmlInputProps
}: Props) {
  function handleInput(value: string) {
    if (onInput !== undefined) {
      onInput(value);
    }
  }

  return (
    <div className={`relative ${passedClassName ?? ""}`}>
      {label !== undefined && <InputLabel>{label}</InputLabel>}
      <input
        {...htmlInputProps}
        onChange={(e) => handleInput(e.target.value)}
        type="text"
        className="block w-full rounded-xl border border-slate-300 bg-slate-50 py-2 px-3 placeholder:text-slate-400 focus:border-primary-400  focus:outline-none focus:ring-1 focus:ring-primary-400"
      />
    </div>
  );
}
