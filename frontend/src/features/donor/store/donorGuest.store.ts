import { create } from 'zustand';

export type DonorGuestFrequency = 'one_time' | 'monthly';

interface DonorGuestState {
  amount: number;
  frequency: DonorGuestFrequency;
  cardNumber: string;
  expiry: string;
  cvv: string;
  zipCode: string;
  setAmount: (amount: number) => void;
  setFrequency: (frequency: DonorGuestFrequency) => void;
  setCardField: (field: 'cardNumber' | 'expiry' | 'cvv' | 'zipCode', value: string) => void;
  resetGuest: () => void;
}

export const useDonorGuestStore = create<DonorGuestState>((set) => ({
  amount: 100,
  frequency: 'one_time',
  cardNumber: '',
  expiry: '',
  cvv: '',
  zipCode: '',
  setAmount: (amount) => set({ amount }),
  setFrequency: (frequency) => set({ frequency }),
  setCardField: (field, value) => set({ [field]: value }),
  resetGuest: () => set({ amount: 100, frequency: 'one_time', cardNumber: '', expiry: '', cvv: '', zipCode: '' }),
}));
