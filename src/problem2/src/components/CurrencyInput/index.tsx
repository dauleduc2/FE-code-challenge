import { useMemo, type FunctionComponent } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useFormContext } from "react-hook-form";
import CurrencyIcon from "../CurrencyIcon";

export interface CurrencyInputValue {
  amount: number | "";
  currencyCode: string;
}

export interface CurrencyInputOption {
  label: string;
  value: string;
  iconUrl: string;
}

interface CurrencyInputProps {
  name: string;
  label: string;
  options: CurrencyInputOption[];
  defaultValue?: CurrencyInputValue;
  onPriceChange?: (price: number) => void;
}

const CurrencyInput: FunctionComponent<CurrencyInputProps> = ({
  label,
  name,
  options,
  onPriceChange,
}) => {
  const { setValue, watch, register } = useFormContext();
  const { onChange: registerAmountChange, ...registerAmountMethods } = register(
    `${name}.amount`
  );

  const currencyValue = watch(name) as CurrencyInputValue | undefined;
  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === currencyValue?.currencyCode);
  }, [currencyValue?.currencyCode, options]);

  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold uppercase text-gray-700">{label}</label>
      <div className="flex md:flex-row flex-col md:gap-0 gap-2">
        <input
          {...registerAmountMethods}
          onChange={(e) => {
            registerAmountChange(e);
            const value = Number.parseFloat(e.target.value);
            if (!Number.isNaN(value)) {
              onPriceChange?.(value);
            }
          }}
          step="0.00000001"
          min="0"
          type="number"
          className="block w-full min-w-[250px] rounded-md shadow-md bg-white md:rounded-tr-none md:rounded-br-none py-3 pr-2 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-brand-purple sm:text-sm/6"
        />
        <Listbox
          value={currencyValue?.currencyCode}
          onChange={(value) => setValue(`${name}.currencyCode`, value)}
        >
          <div className="relative">
            <ListboxButton className="w-full md:min-w-[200px] grid cursor-default grid-cols-1 shadow-md rounded-md md:rounded-bl-none md:rounded-tl-none outline-l bg-white py-3 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-purple sm:text-sm/6">
              <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                <CurrencyIcon
                  src={selectedOption?.iconUrl}
                  alt={selectedOption?.value}
                />
                <span className="block truncate">{selectedOption?.label}</span>
              </span>
              <ChevronUpDownIcon
                aria-hidden="true"
                className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              />
            </ListboxButton>

            <ListboxOptions
              transition
              className="absolute w-full md:min-w-[200px] z-10 mt-1 max-h-56 overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
            >
              {options.map((option, i) => (
                <ListboxOption
                  key={`${option.value}-${i}`}
                  value={option.value}
                  className="group relative py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-brand-outline-brand-purple data-focus:bg-gray-100 data-focus:outline-hidden cursor-pointer"
                >
                  <div className="flex items-center">
                    <CurrencyIcon src={option.iconUrl} alt={option.value} />
                    <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">
                      {option.label}
                    </span>
                  </div>

                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-brand-outline-brand-purple group-not-data-selected:hidden group-data-focus:text-white">
                    <CheckIcon aria-hidden="true" className="size-5" />
                  </span>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>
    </div>
  );
};

export default CurrencyInput;
