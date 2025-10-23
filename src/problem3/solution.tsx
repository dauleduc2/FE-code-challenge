import type React from "react";
import { useMemo, type HTMLAttributes } from "react";

import classes from "./WalletPage.module.css";

// This type help to avoid misspellings in blockchain names and also allow to pass unknown blockchains in
type Blockchain =
  | "Osmosis"
  | "Ethereum"
  | "Arbitrum"
  | "Zilliqa"
  | "Neo"
  | (string & {});

const LOWEST_PRIORITY = -99;

const PRIORITY_MAP: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
} as const;

const getPriority = (blockchain: Blockchain): number =>
  PRIORITY_MAP[blockchain] ?? LOWEST_PRIORITY;

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

export const WalletPage: React.FC<HTMLAttributes<HTMLDivElement>> = (props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        if (balancePriority > LOWEST_PRIORITY && balance.amount <= 0) {
          return true;
        }
        return false;
      })
      .sort(
        (a: WalletBalance, b: WalletBalance) =>
          getPriority(b.blockchain) - getPriority(a.blockchain)
      );
  }, [balances]);

  const rows = useMemo(() => {
    return sortedBalances.map((balance: FormattedWalletBalance) => {
      const currencyPrice = prices[balance.currency];

      if (!currencyPrice) {
        return <></>;
      }

      const usdValue = currencyPrice * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={balance.currency}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [prices, sortedBalances]);

  return <div {...props}>{rows}</div>;
};
