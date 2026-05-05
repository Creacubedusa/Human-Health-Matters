export type DonorHistoryStatus = 'allocated' | 'pending' | 'failed';
export type DonorHistoryBrand = 'mastercard' | 'visa';

export interface DonorHistoryItem {
  id: string;
  amount: number;
  dateTime: string;
  status: DonorHistoryStatus;
  paymentBrand: DonorHistoryBrand;
  maskedCard: string;
  transactionId: string;
}
