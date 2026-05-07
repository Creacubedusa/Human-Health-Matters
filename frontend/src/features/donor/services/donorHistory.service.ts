import type { DonorHistoryItem } from '../types/donorHistory.types';

const MOCK_HISTORY: DonorHistoryItem[] = [
  {
    id: '1',
    amount: 100,
    dateTime: 'Apr 4th, 2026 at 8:00AM',
    status: 'allocated',
    paymentBrand: 'mastercard',
    maskedCard: '****8888',
    transactionId: 'TXN-8348',
  },
  {
    id: '2',
    amount: 100,
    dateTime: 'Mar 15th, 2026 at 11:30AM',
    status: 'allocated',
    paymentBrand: 'mastercard',
    maskedCard: '****8888',
    transactionId: 'TXN-7291',
  },
  {
    id: '3',
    amount: 100,
    dateTime: 'Feb 20th, 2026 at 9:15AM',
    status: 'allocated',
    paymentBrand: 'visa',
    maskedCard: '****8888',
    transactionId: 'TXN-6134',
  },
  {
    id: '4',
    amount: 100,
    dateTime: 'Jan 10th, 2026 at 2:00PM',
    status: 'allocated',
    paymentBrand: 'visa',
    maskedCard: '****8888',
    transactionId: 'TXN-5027',
  },
  {
    id: '5',
    amount: 50,
    dateTime: 'Dec 5th, 2025 at 10:45AM',
    status: 'pending',
    paymentBrand: 'mastercard',
    maskedCard: '****8888',
    transactionId: 'TXN-4816',
  },
];

export async function fetchDonorHistory(
  _fromDate?: string,
  _toDate?: string,
): Promise<DonorHistoryItem[]> {
  await new Promise((r) => setTimeout(r, 800));
  return MOCK_HISTORY;
}
