import type { FunctionComponent, HTMLProps } from "react";
import { twMerge } from "tailwind-merge";

const CurrencyIcon: FunctionComponent<HTMLProps<HTMLImageElement>> = ({
  className,
  ...rest
}) => {
  return (
    <img className={twMerge("w-6 h-6 rounded-full", className)} {...rest} />
  );
};

export default CurrencyIcon;
