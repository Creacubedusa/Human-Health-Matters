import { useState } from 'react';

export type AddMethodType = 'card' | 'bank' | null;

export interface UseDonorAddPaymentMethodResult {
  selected: AddMethodType;
  setSelected: (v: AddMethodType) => void;
  canContinue: boolean;
  handleContinue: (onCard: () => void, onBank: () => void) => void;
}

export function useDonorAddPaymentMethod(): UseDonorAddPaymentMethodResult {
  const [selected, setSelected] = useState<AddMethodType>(null);

  function handleContinue(onCard: () => void, onBank: () => void) {
    if (selected === 'card') onCard();
    else if (selected === 'bank') onBank();
  }

  return { selected, setSelected, canContinue: selected !== null, handleContinue };
}
