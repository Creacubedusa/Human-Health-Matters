import type { DonorProfileData, DonorProfilePaymentCard } from '../types/donorProfile.types';

export async function fetchDonorProfile(): Promise<DonorProfileData> {
  await new Promise((r) => setTimeout(r, 800));
  return {
    name: 'Sarah Dairo',
    email: 'sarah@gmail.com',
    totalDonated: 1000,
    patientsHelped: 24,
    savedCards: [
      { id: 'visa-1', brand: 'visa', last4: '4821', expiry: '04/28', isDefault: true },
    ],
    frequency: 'monthly',
    donationAmount: 25,
    notificationsEnabled: true,
  };
}

export async function saveCardToProfile(_card: Omit<DonorProfilePaymentCard, 'id'>): Promise<DonorProfilePaymentCard> {
  await new Promise((r) => setTimeout(r, 600));
  return {
    id: `card-${Date.now()}`,
    brand: 'visa',
    last4: '0000',
    expiry: '01/30',
    isDefault: false,
    ..._card,
  };
}
