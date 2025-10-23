import { useEffect, useState } from "react";
import { switcheoClient } from "../config/axios";
import type { GetPricesResponse, Price } from "../interface/res/price";

// NOTE: the response from the API may contain some duplicate data with the same currency and price
// So solution for now is remove all duplicate prices has the same currency
const removeDuplicatePrices = (prices: Price[]): Price[] => {
  const uniquePricesMap = new Map<string, Price>();

  for (const price of prices) {
    const key = `${price.currency}`;
    if (!uniquePricesMap.has(key)) {
      uniquePricesMap.set(key, price);
    }
  }

  return Array.from(uniquePricesMap.values());
};

export const useGetPrices = () => {
  const [prices, setPrices] = useState<Price[]>([]);
  const [error, setError] = useState<unknown>();
  const [isFetching, setIsFetching] = useState(false);

  const fetchPrices = async () => {
    try {
      setIsFetching(true);
      const response = await switcheoClient.get<GetPricesResponse>(
        "/prices.json"
      );
      const filteredPrices = removeDuplicatePrices(response.data);
      setPrices(filteredPrices);
    } catch (error) {
      setError(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  return { prices, isFetching, refetch: fetchPrices, error };
};
