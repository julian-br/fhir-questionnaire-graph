import { TextareaHTMLAttributes, useEffect, useRef, useState } from "react";
import InputLabel from "./InputLabel";

interface Props {
  label?: string;
  fitContent?: boolean;
  onInput?: (value: string) => void;
  placeholder: string;
  rows?: number;
}

export default function TextArea({
  label,
  fitContent = false,
  onInput,
  rows = 1,
  placeholder,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initialHeight = useRef(0);

  useEffect(() => {
    initialHeight.current = textareaRef.current?.offsetHeight ?? 0;
  }, []);

  function handleInput(value: string) {
    if (onInput !== undefined) {
      onInput(value);
    }

    if (fitContent === true) {
      resizeToFitContent();
    }
  }

  function resizeToFitContent() {
    if (textareaRef.current === null) {
      return;
    }

    // reset height to get correct scroll height
    textareaRef.current.style.height = initialHeight.current + "px";
    const scrollHeight = textareaRef.current.scrollHeight + 2 + "px";
    textareaRef.current.style.height = scrollHeight;
  }

  return (
    <div className="w-full">
      <InputLabel>{label}</InputLabel>
      <textarea
        ref={textareaRef}
        placeholder={placeholder}
        rows={rows}
        onChange={(e) => handleInput(e.target.value)}
        className={`box-border block w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm placeholder:text-slate-500 focus:border-primary-400   focus-visible:outline-primary-300`}
      />
    </div>
  );
}
