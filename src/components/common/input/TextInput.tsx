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
      <InputLabel>{label}</InputLabel>
      <input
        {...htmlInputProps}
        onChange={(e) => handleInput(e.target.value)}
        type="text"
        className="block w-full rounded-md border border-slate-300 bg-slate-50 py-2 px-2 text-sm placeholder:text-slate-300 focus:border-primary-light"
      />
    </div>
  );
}
