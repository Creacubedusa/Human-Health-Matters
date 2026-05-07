import { create } from 'zustand';
import type { DonorDonationDraft } from '../types/donorDonation.types';

const INITIAL_DRAFT: DonorDonationDraft = {
  amount: 100,
  type: 'one_time',
  selectedPaymentMethodId: null,
  cardNumber: '',
  expiry: '',
  cvv: '',
  zipCode: '',
  saveCard: false,
};

interface DonorDonationState {
  draft: DonorDonationDraft;
  setAmount: (amount: number) => void;
  setType: (type: DonorDonationDraft['type']) => void;
  setPaymentMethod: (id: string) => void;
  setCardField: (field: keyof Pick<DonorDonationDraft, 'cardNumber' | 'expiry' | 'cvv' | 'zipCode' | 'saveCard'>, value: string | boolean) => void;
  resetDraft: () => void;
}

export const useDonorDonationStore = create<DonorDonationState>((set) => ({
  draft: { ...INITIAL_DRAFT },
  setAmount: (amount) => set((s) => ({ draft: { ...s.draft, amount } })),
  setType: (type) => set((s) => ({ draft: { ...s.draft, type } })),
  setPaymentMethod: (id) => set((s) => ({ draft: { ...s.draft, selectedPaymentMethodId: id } })),
  setCardField: (field, value) => set((s) => ({ draft: { ...s.draft, [field]: value } })),
  resetDraft: () => set({ draft: { ...INITIAL_DRAFT } }),
}));
