import type { FunctionComponent } from "react";
import { ArrowsUpDownIcon } from "@heroicons/react/16/solid";
import { twMerge } from "tailwind-merge";
interface SwapButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const SwapButton: FunctionComponent<SwapButtonProps> = ({
  onClick,
  className,
  ...rest
}) => {
  return (
    <button
      className={twMerge(
        "w-14 h-14 p-3 cursor-pointer rounded-full bg-white flex justify-center items-center hover:bg-gray-100 hover:rotate-180 duration-200 text-gray-400 hover:scale-[1.1] active:scale-95 transition-all",
        className
      )}
      onClick={onClick}
      type="button"
      {...rest}
    >
      <ArrowsUpDownIcon />
    </button>
  );
};

export default SwapButton;
