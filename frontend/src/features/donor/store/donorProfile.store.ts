import { create } from 'zustand';
import type { DonorFrequency, DonorProfileData, DonorProfilePaymentCard } from '../types/donorProfile.types';

interface DonorProfileState {
  profile: DonorProfileData | null;
  setProfile: (data: DonorProfileData) => void;
  updateFrequency: (frequency: DonorFrequency, amount: number) => void;
  updateNotifications: (enabled: boolean) => void;
  addCard: (card: DonorProfilePaymentCard) => void;
  updateCard: (card: DonorProfilePaymentCard) => void;
  clearProfile: () => void;
}

export const useDonorProfileStore = create<DonorProfileState>((set) => ({
  profile: null,

  setProfile: (data) => set({ profile: data }),

  updateFrequency: (frequency, amount) =>
    set((s) =>
      s.profile ? { profile: { ...s.profile, frequency, donationAmount: amount } } : s,
    ),

  updateNotifications: (enabled) =>
    set((s) =>
      s.profile ? { profile: { ...s.profile, notificationsEnabled: enabled } } : s,
    ),

  addCard: (card) =>
    set((s) =>
      s.profile
        ? { profile: { ...s.profile, savedCards: [...s.profile.savedCards, card] } }
        : s,
    ),

  updateCard: (card) =>
    set((s) =>
      s.profile
        ? {
            profile: {
              ...s.profile,
              savedCards: s.profile.savedCards.map((c) => (c.id === card.id ? card : c)),
            },
          }
        : s,
    ),

  clearProfile: () => set({ profile: null }),
}));
