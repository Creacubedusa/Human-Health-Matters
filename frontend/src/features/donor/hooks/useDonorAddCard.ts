import { useState } from 'react';
import { useDonorProfileStore } from '../store/donorProfile.store';
import type { DonorProfilePaymentCard } from '../types/donorProfile.types';

export interface UseDonorAddCardResult {
  cardNumber: string;
  expiry: string;
  cvv: string;
  zipCode: string;
  saveCard: boolean;
  isValid: boolean;
  handleCardNumber: (text: string) => void;
  handleExpiry: (text: string) => void;
  handleCvv: (text: string) => void;
  handleZip: (text: string) => void;
  handleSaveCard: (checked: boolean) => void;
  handleAdd: (onAdd: () => void) => void;
}

export function useDonorAddCard(): UseDonorAddCardResult {
  const { addCard } = useDonorProfileStore();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  function handleCardNumber(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, 16);
    setCardNumber(digits.replace(/(.{4})/g, '$1 ').trim());
  }

  function handleExpiry(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, 4);
    setExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
  }

  function handleCvv(text: string) { setCvv(text.replace(/\D/g, '').slice(0, 4)); }
  function handleZip(text: string) { setZipCode(text.slice(0, 10)); }

  const isValid = cardNumber.replace(/\s/g, '').length >= 15 && expiry.length === 5 && cvv.length >= 3 && zipCode.length >= 4;

  function handleAdd(onAdd: () => void) {
    const newCard: DonorProfilePaymentCard = {
      id: `card-${Date.now()}`,
      brand: 'visa',
      last4: cardNumber.replace(/\s/g, '').slice(-4),
      expiry,
      isDefault: false,
    };
    addCard(newCard);
    onAdd();
  }

  return { cardNumber, expiry, cvv, zipCode, saveCard, isValid, handleCardNumber, handleExpiry, handleCvv, handleZip, handleSaveCard: setSaveCard, handleAdd };
}
