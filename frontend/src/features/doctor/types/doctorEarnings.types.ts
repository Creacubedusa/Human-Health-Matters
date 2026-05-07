export type DoctorEarningTransactionStatus = 'paid' | 'pending' | 'processing';
export type DoctorEarningTransactionSource = 'donor' | 'insurance';
export type DoctorEarningFilter = 'all' | 'paid' | 'pending' | 'processing';
export type DoctorEarningQuickAction = 'withdraw' | 'claimsTracker' | 'payoutHistory';
export type DoctorWithdrawalStep = 'overview' | 'addBank' | 'selectBank' | 'enterAmount' | 'verify';

export interface DoctorEarningDateRange {
  from: string;
  to: string;
}

export interface DoctorEarningTransaction {
  id: string;
  patientName: string;
  description: string;
  amount: number;
  status: DoctorEarningTransactionStatus;
  source: DoctorEarningTransactionSource;
  occurredAt: string;
  date: string;
  reference: string;
  transactionCode: string;
  consultationTitle: string;
  consultationDate: string;
  consultationTime: string;
  consultationDuration: string;
  payoutTimestamp: string;
  payoutBankMasked: string;
  receiptReference: string;
  receiptBankDisplay: string;
  receiptDate: string;
  receiptTime: string;
}

export interface DoctorWithdrawalBank {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  sortCode: string;
  accountType: string;
}
