import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: keyof typeof buttonVariants;
  size?: keyof typeof sizeClassMap;
  children?: ReactNode;
}

const buttonVariants = {
  primary: "bg-primary-600 text-white font-semibold hover:bg-primary-200",
  custom: "",
} as const;

const sizeClassMap = {
  medium: "px-7 py-2 h-fit rounded-xl",
  large: "text-lg px-7 py-2 h-fit rounded-xl",
} as const;

export default function Button({
  variant,
  size,
  children,
  ...reactButtonProps
}: ButtonProps) {
  const variantClasses = buttonVariants[variant];

  // apply no sizing if the variant is custom
  const sizeClasses =
    variant === "custom" ? "" : sizeClassMap[size ?? "medium"];

  return (
    <button
      {...reactButtonProps}
      type={reactButtonProps.type ?? "button"}
      className={`select-none  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300  ${variantClasses} ${sizeClasses} ${reactButtonProps.className}`}
    >
      {children}
    </button>
  );
}
