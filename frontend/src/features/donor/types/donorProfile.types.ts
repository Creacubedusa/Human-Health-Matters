export type DonorFrequency = 'one_time' | 'monthly';
export type DonorCardBrand = 'mastercard' | 'visa';

export interface DonorProfilePaymentCard {
  id: string;
  brand: DonorCardBrand;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export interface DonorProfileData {
  name: string;
  email: string;
  totalDonated: number;
  patientsHelped: number;
  savedCards: DonorProfilePaymentCard[];
  frequency: DonorFrequency;
  donationAmount: number;
  notificationsEnabled: boolean;
}
