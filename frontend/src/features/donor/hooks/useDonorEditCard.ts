import { useEffect, useState } from 'react';
import { useDonorProfileStore } from '../store/donorProfile.store';
import type { DonorProfilePaymentCard } from '../types/donorProfile.types';

export interface UseDonorEditCardResult {
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
  handleSave: (onSuccess: () => void) => void;
}

export function useDonorEditCard(cardId: string): UseDonorEditCardResult {
  const { profile, updateCard } = useDonorProfileStore();
  const existing = profile?.savedCards.find((c) => c.id === cardId);

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState(existing?.expiry ?? '');
  const [cvv, setCvv] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [saveCard, setSaveCard] = useState(true);

  useEffect(() => {
    if (existing) {
      setExpiry(existing.expiry);
    }
  }, [cardId]);

  function handleCardNumber(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  }

  function handleExpiry(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, 4);
    setExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
  }

  function handleCvv(text: string) {
    setCvv(text.replace(/\D/g, '').slice(0, 4));
  }

  function handleZip(text: string) {
    setZipCode(text.slice(0, 10));
  }

  const isValid = cardNumber.replace(/\s/g, '').length >= 15 && expiry.length === 5 && cvv.length >= 3 && zipCode.length >= 4;

  function handleSave(onSuccess: () => void) {
    if (!existing) return;
    const updated: DonorProfilePaymentCard = {
      ...existing,
      expiry,
    };
    updateCard(updated);
    onSuccess();
  }

  return {
    cardNumber,
    expiry,
    cvv,
    zipCode,
    saveCard,
    isValid,
    handleCardNumber,
    handleExpiry,
    handleCvv,
    handleZip,
    handleSaveCard: setSaveCard,
    handleSave,
  };
}
