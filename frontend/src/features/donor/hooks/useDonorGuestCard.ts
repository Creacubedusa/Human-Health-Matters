import { useDonorGuestStore } from '../store/donorGuest.store';

export function useDonorGuestCard() {
  const { cardNumber, expiry, cvv, zipCode, setCardField } = useDonorGuestStore();

  function handleCardNumber(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, 16);
    setCardField('cardNumber', digits.replace(/(.{4})/g, '$1 ').trim());
  }

  function handleExpiry(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, 4);
    setCardField('expiry', digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
  }

  function handleCvv(text: string) {
    setCardField('cvv', text.replace(/\D/g, '').slice(0, 4));
  }

  function handleZip(text: string) {
    setCardField('zipCode', text.slice(0, 10));
  }

  const isValid =
    cardNumber.replace(/\s/g, '').length >= 15 &&
    expiry.length === 5 &&
    cvv.length >= 3 &&
    zipCode.length >= 4;

  return { cardNumber, expiry, cvv, zipCode, isValid, handleCardNumber, handleExpiry, handleCvv, handleZip };
}
