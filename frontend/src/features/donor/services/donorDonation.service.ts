import type { DonorDonationDraft, DonorSavedPaymentMethod } from '../types/donorDonation.types';

export async function fetchSavedPaymentMethods(): Promise<DonorSavedPaymentMethod[]> {
  await new Promise((r) => setTimeout(r, 600));
  return [
    { id: 'mc-1', brand: 'mastercard', last4: '8888', expires: '12/26' },
    { id: 'visa-1', brand: 'visa', last4: '8888', expires: '12/26' },
  ];
}

export async function submitDonation(_draft: DonorDonationDraft): Promise<void> {
  await new Promise((r) => setTimeout(r, 1500));
}
