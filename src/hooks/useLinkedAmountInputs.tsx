import { useState, useCallback } from "react";

export function useLinkedAmountInputs(wallet?: { price: number }, maxAmount?: number) {
  const [amount, setAmount] = useState(""); 
  const [amountConvert, setAmountConvert] = useState(""); 

  const isValidInput = (val: string) => /^\d*(?:[.,]\d+)?$/.test(val);
  const normalizeInput = (val: string) => val.replace(",", ".");

  const handleAmountChange = useCallback(
    (val: string) => {
      if (!wallet?.price) return;

      const normalized = normalizeInput(val);
      if (/^[^.]*[.,](?![.,])$/.test(val)) {
        setAmount(normalized);
        return;
      }

      if (isValidInput(val)) {
        setAmount(normalized);
        const usdValue = (Number(normalized) * wallet.price).toFixed(2);
        setAmountConvert(usdValue);
      }
    },
    [wallet]
  );

  const handleConvertChange = useCallback(
    (val: string) => {
      if (!wallet?.price) return;

      const normalized = normalizeInput(val);
      if (/^[^.]*[.,](?![.,])$/.test(val)) {
        setAmountConvert(normalized);
        return;
      }

      if (isValidInput(val)) {
        setAmountConvert(normalized);
        const originalValue = (Number(normalized) / wallet.price).toFixed(8);
        setAmount(originalValue);
      }
    },
    [wallet]
  );

  const handleMax = useCallback(() => {
    if(maxAmount === undefined || maxAmount === null || maxAmount === 0) {
      setAmount("0");
      setAmountConvert("0");
      return
    }
    if (!wallet?.price || !maxAmount) return;
    const usd = (maxAmount * wallet.price).toFixed(2);
    setAmount(String(maxAmount));
    setAmountConvert(usd);
  }, [wallet, maxAmount]);

  return {
    amount,
    amountConvert,
    handleAmountChange,
    handleConvertChange,
    handleMax,
  };
}
