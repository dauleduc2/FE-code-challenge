import type {
  ButtonHTMLAttributes,
  FunctionComponent,
  PropsWithChildren,
} from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & PropsWithChildren;

const Button: FunctionComponent<ButtonProps> = ({
  children,
  className,
  disabled,
  ...rest
}) => {
  return (
    <button
      className={twMerge(
        "px-6 inline-flex justify-center items-center rounded-lg text-white text-left font-bold transition-all py-3 gap-1 w-auto bg-linear-60 from-brand-purple via-brand-dark-purple to-brand-blue shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
