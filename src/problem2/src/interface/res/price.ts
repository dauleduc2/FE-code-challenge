export type Price = {
  currency: string;
  date: string;
  price: number;
};

export type GetPricesResponse = Price[];
