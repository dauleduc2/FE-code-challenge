export const getConvertedAmount = ({
  amount,
  fromPrice,
  toPrice,
}: {
  fromPrice: number;
  toPrice: number;
  amount: number; // amount of from currency
}) => {
  if (fromPrice && toPrice) {
    const exchangeRate = fromPrice / toPrice;
    return +(amount * exchangeRate).toFixed(6);
  }
  return null;
};
