export type DonorDonationType = 'one_time' | 'monthly';

export type PaymentBrand = 'mastercard' | 'visa';

export interface DonorSavedPaymentMethod {
  id: string;
  brand: PaymentBrand;
  last4: string;
  expires: string;
}

export interface DonorDonationDraft {
  amount: number;
  type: DonorDonationType;
  selectedPaymentMethodId: string | null;
  cardNumber: string;
  expiry: string;
  cvv: string;
  zipCode: string;
  saveCard: boolean;
}
