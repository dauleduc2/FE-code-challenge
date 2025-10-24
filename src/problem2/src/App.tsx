import { FormProvider, useForm, useWatch } from "react-hook-form";
import Button from "./components/Button";
import CurrencyInput, {
  type CurrencyInputOption,
  type CurrencyInputValue,
} from "./components/CurrencyInput";
import { useGetPrices } from "./hooks/price";
import { useCallback, useEffect, useMemo, useState } from "react";
import SwapButton from "./components/SwapButton";
import { getConvertedAmount } from "./util/price";
import Loading from "./components/Loading";

interface CurrencySwapForm {
  from: CurrencyInputValue;
  to: CurrencyInputValue;
}

function App() {
  const [errorMessage, setErrorMessage] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { prices, error } = useGetPrices();
  const methods = useForm<CurrencySwapForm>({
    defaultValues: {
      from: {
        amount: 0,
        currencyCode: "USD",
      },
      to: {
        amount: 0,
        currencyCode: "LUNA",
      },
    },
  });

  const watchedValues = useWatch({
    control: methods.control,
    name: ["from", "to"],
  });
  const [from, to] = watchedValues;

  const watchFromCurrency = from.currencyCode;
  const watchFromAmount = from.amount;
  const watchToCurrency = to.currencyCode;
  const watchToAmount = to.amount;

  const availableOptions = useMemo<CurrencyInputOption[]>(() => {
    return prices.map((price) => ({
      label: price.currency,
      value: price.currency,
      iconUrl: `/tokens/${price.currency}.svg`,
    }));
  }, [prices]);

  const getCurrencyPrice = useCallback(
    (currencyCode: string) => {
      return prices.find((p) => p.currency === currencyCode)?.price || 0;
    },
    [prices]
  );

  const exchangeRate = useMemo(() => {
    const fromPrice = getCurrencyPrice(watchFromCurrency);
    const toPrice = getCurrencyPrice(watchToCurrency);
    if (fromPrice && toPrice) {
      return (fromPrice / toPrice).toFixed(6);
    }
    return 0;
  }, [getCurrencyPrice, watchFromCurrency, watchToCurrency]);

  const onSubmit = (data: CurrencySwapForm) => {
    setIsLoading(true);

    setTimeout(() => {
      alert(
        `Swap successful! You swapped ${data.from.amount} ${data.from.currencyCode} to ${data.to.amount} ${data.to.currencyCode}`
      );
      setIsLoading(false);
    }, 1000);
  };

  const onSwapCurrency = () => {
    const fromValue = methods.getValues("from");
    const toValue = methods.getValues("to");

    methods.setValue("from", toValue);
    methods.setValue("to", fromValue);
  };

  const onPriceChange = useCallback(
    (source: "from" | "to", amount: number) => {
      const fromPrice = getCurrencyPrice(watchFromCurrency);
      const toPrice = getCurrencyPrice(watchToCurrency);

      if (typeof fromPrice === "number" && typeof toPrice === "number") {
        const convertedAmount = getConvertedAmount({
          amount,
          fromPrice: source === "from" ? fromPrice : toPrice,
          toPrice: source === "from" ? toPrice : fromPrice,
        });

        if (convertedAmount === null) return;

        methods.setValue(
          source === "from" ? "to.amount" : "from.amount",
          convertedAmount
        );
      }
    },
    [getCurrencyPrice, methods, watchFromCurrency, watchToCurrency]
  );

  // if any currency changes, update the prices. Consider "from" as source for now
  useEffect(() => {
    onPriceChange("from", methods.getValues("from.amount") || 0);
  }, [methods, onPriceChange, watchFromCurrency, watchToCurrency]);

  useEffect(() => {
    if (!error) {
      setErrorMessage(null);
      return;
    }

    if (error instanceof Error) {
      setErrorMessage(`Failed to fetch prices: ${error.message}`);
    } else {
      setErrorMessage("An unknown error occurred while fetching prices.");
    }
  }, [error]);

  return (
    <main className="bg-linear-60 from-brand-blue via-brand-dark-purple/90 to-brand-purple flex justify-center items-center w-screen h-screen p-5">
      <div className="bg-white p-5 max-w-2xl md:w-fit rounded-3xl shadow-md flex flex-col gap-10 w-full py-10">
        <h1 className="text-3xl font-bold text-center">Currency Swap</h1>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <CurrencyInput
              options={availableOptions}
              name="from"
              label="From"
              onPriceChange={(newAmount) => onPriceChange("from", newAmount)}
            />
            <SwapButton
              className="self-center -mb-6"
              onClick={onSwapCurrency}
            />
            <CurrencyInput
              options={availableOptions}
              name="to"
              label="To"
              onPriceChange={(newAmount) => onPriceChange("to", newAmount)}
            />
            <span className="px-6 py-3 bg-gray-100 rounded-sm font-semibold text-gray-500 text-center">
              1 {watchFromCurrency} = {exchangeRate} {watchToCurrency}
            </span>
            {errorMessage && (
              <p className="text-red-500 px-6 py-3 bg-red-100 font-medium rounded-sm">
                {errorMessage}
              </p>
            )}
            <Button
              disabled={
                isLoading ||
                +watchFromAmount <= 0 ||
                +watchToAmount <= 0 ||
                watchFromCurrency === watchToCurrency ||
                Boolean(error)
              }
              className="cursor-pointer"
            >
              {isLoading ? <Loading /> : "Swap"}
            </Button>
          </form>
        </FormProvider>
      </div>
    </main>
  );
}

export default App;
