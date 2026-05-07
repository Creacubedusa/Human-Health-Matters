import { create } from 'zustand';
import { MOCK_DOCTOR_RECOMMENDATIONS } from '@features/patient/services/appointmentBooking.service';
import { getMockCoverageResultForScenario } from '@features/patient/services/insuranceCoverage.service';
import type { CoverageScenarioId } from '@features/patient/types/insuranceCoverage.types';
import { useDoctorProfileSetupStore } from './doctorProfileSetup.store';
import type {
  DoctorEarningDateRange,
  DoctorEarningFilter,
  DoctorEarningTransaction,
  DoctorWithdrawalBank,
  DoctorWithdrawalStep,
} from '../types/doctorEarnings.types';

const CURRENT_DOCTOR_ID = 'doctor-paul-grant';

interface MockDonorMatchedConsultation {
  id: string;
  doctorId: string;
  patientName: string;
  description: string;
  occurredAt: string;
  durationMinutes: number;
  coverageScenarioId: CoverageScenarioId;
  status: DoctorEarningTransaction['status'];
  payoutTimestamp: string;
  payoutBankMasked: string;
  receiptReference: string;
  receiptBankDisplay: string;
  receiptDate: string;
  receiptTime: string;
}

const MOCK_DONOR_MATCHED_CONSULTATIONS: MockDonorMatchedConsultation[] = [
  {
    id: 'txn-1',
    doctorId: CURRENT_DOCTOR_ID,
    patientName: 'Angela Dairo',
    description: 'Difficulty in breathing',
    occurredAt: '2025-08-09T10:30:00.000Z',
    durationMinutes: 30,
    coverageScenarioId: 'no_insurance_donor_approved',
    status: 'paid',
    payoutTimestamp: 'Apr 4th, 2026 at 8:00AM',
    payoutBankMasked: '****131071791 .ETF',
    receiptReference: 'WD-76675',
    receiptBankDisplay: 'Well Fargo ***09888',
    receiptDate: 'Apr 4th, 2026',
    receiptTime: '10:32 AM',
  },
  {
    id: 'txn-2',
    doctorId: CURRENT_DOCTOR_ID,
    patientName: 'Jordan Cole',
    description: 'Persistent migraine',
    occurredAt: '2025-08-16T09:15:00.000Z',
    durationMinutes: 45,
    coverageScenarioId: 'insured_partial_with_donor',
    status: 'processing',
    payoutTimestamp: 'Apr 6th, 2026 at 11:20AM',
    payoutBankMasked: '****131071791 .ETF',
    receiptReference: 'WD-76676',
    receiptBankDisplay: 'Well Fargo ***09888',
    receiptDate: 'Apr 6th, 2026',
    receiptTime: '11:20 AM',
  },
  {
    id: 'txn-3',
    doctorId: CURRENT_DOCTOR_ID,
    patientName: 'Maya Thompson',
    description: 'Difficulty in breathing',
    occurredAt: '2025-08-23T13:10:00.000Z',
    durationMinutes: 30,
    coverageScenarioId: 'no_insurance_donor_approved',
    status: 'paid',
    payoutTimestamp: 'Apr 8th, 2026 at 1:40PM',
    payoutBankMasked: '****131071791 .ETF',
    receiptReference: 'WD-76677',
    receiptBankDisplay: 'Well Fargo ***09888',
    receiptDate: 'Apr 8th, 2026',
    receiptTime: '01:40 PM',
  },
  {
    id: 'txn-4',
    doctorId: CURRENT_DOCTOR_ID,
    patientName: 'Liam Okafor',
    description: 'Chest tightness',
    occurredAt: '2025-09-02T11:05:00.000Z',
    durationMinutes: 25,
    coverageScenarioId: 'no_insurance_donor_approved',
    status: 'paid',
    payoutTimestamp: 'Apr 10th, 2026 at 9:00AM',
    payoutBankMasked: '****131071791 .ETF',
    receiptReference: 'WD-76678',
    receiptBankDisplay: 'Well Fargo ***09888',
    receiptDate: 'Apr 10th, 2026',
    receiptTime: '09:00 AM',
  },
  {
    id: 'txn-5',
    doctorId: CURRENT_DOCTOR_ID,
    patientName: 'Sofia Mensah',
    description: 'Blood pressure review',
    occurredAt: '2025-10-11T15:40:00.000Z',
    durationMinutes: 35,
    coverageScenarioId: 'insured_partial_with_donor',
    status: 'paid',
    payoutTimestamp: 'Apr 12th, 2026 at 7:30AM',
    payoutBankMasked: '****131071791 .ETF',
    receiptReference: 'WD-76679',
    receiptBankDisplay: 'Well Fargo ***09888',
    receiptDate: 'Apr 12th, 2026',
    receiptTime: '07:30 AM',
  },
];

const MOCK_WITHDRAWAL_BANKS: DoctorWithdrawalBank[] = [
  {
    id: 'bank-1',
    bankName: 'Wellness Cargo',
    accountName: 'Paul Grant',
    accountNumber: '2131071791',
    sortCode: '021000021',
    accountType: 'Checking',
  },
  {
    id: 'bank-2',
    bankName: 'HealthFirst Bank',
    accountName: 'Paul Grant',
    accountNumber: '0456719823',
    sortCode: '011401533',
    accountType: 'Savings',
  },
  {
    id: 'bank-3',
    bankName: 'CareTrust Credit',
    accountName: 'Paul Grant',
    accountNumber: '8876112304',
    sortCode: '031100209',
    accountType: 'Checking',
  },
];

function formatDateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTimeLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

const DONOR_TRANSACTIONS: DoctorEarningTransaction[] = MOCK_DONOR_MATCHED_CONSULTATIONS
  .filter((consultation) => consultation.doctorId === CURRENT_DOCTOR_ID)
  .flatMap((consultation, index) => {
    const doctor = MOCK_DOCTOR_RECOMMENDATIONS.find(
      (recommendation) => recommendation.id === consultation.doctorId,
    );
    const coverage = getMockCoverageResultForScenario(consultation.coverageScenarioId, {
      patientName: consultation.patientName,
    });

    if (!doctor?.donorFunded || coverage.donorCovers <= 0) {
      return [];
    }

    return [{
      id: consultation.id,
      patientName: consultation.patientName,
      description: consultation.description,
      amount: coverage.donorCovers,
      status: consultation.status,
      source: 'donor' as const,
      occurredAt: consultation.occurredAt,
      date: formatDateLabel(consultation.occurredAt),
      reference: `HHM-DONOR-${String(index + 1).padStart(4, '0')}`,
      transactionCode: `TXN-${String(index + 471).padStart(4, '0')}`,
      consultationTitle: 'Consultation',
      consultationDate: formatDateLabel(consultation.occurredAt),
      consultationTime: formatTimeLabel(consultation.occurredAt),
      consultationDuration: `${consultation.durationMinutes} min`,
      payoutTimestamp: consultation.payoutTimestamp,
      payoutBankMasked: consultation.payoutBankMasked,
      receiptReference: consultation.receiptReference,
      receiptBankDisplay: consultation.receiptBankDisplay,
      receiptDate: consultation.receiptDate,
      receiptTime: consultation.receiptTime,
    }];
  });

interface DoctorEarningsState {
  transactions: DoctorEarningTransaction[];
  selectedTransaction: DoctorEarningTransaction | null;
  selectedFilter: DoctorEarningFilter;
  dateRange: DoctorEarningDateRange;
  withdrawalStep: DoctorWithdrawalStep;
  withdrawalBanks: DoctorWithdrawalBank[];
  selectedWithdrawalBankId: string | null;
  withdrawalAmount: string;
  withdrawalCode: string;
  withdrawalSuccessVisible: boolean;
  setSelectedTransaction: (transaction: DoctorEarningTransaction | null) => void;
  setSelectedFilter: (filter: DoctorEarningFilter) => void;
  setDateRange: (range: DoctorEarningDateRange) => void;
  setWithdrawalStep: (step: DoctorWithdrawalStep) => void;
  setSelectedWithdrawalBankId: (bankId: string | null) => void;
  setWithdrawalAmount: (amount: string) => void;
  setWithdrawalCode: (code: string) => void;
  addWithdrawalBank: (bank: Omit<DoctorWithdrawalBank, 'id'>) => DoctorWithdrawalBank;
  submitWithdrawal: () => void;
  closeWithdrawalSuccess: () => void;
  resetWithdrawalFlow: () => void;
}

export const useDoctorEarningsStore = create<DoctorEarningsState>((set) => ({
  transactions: DONOR_TRANSACTIONS,
  selectedTransaction: null,
  selectedFilter: 'all',
  dateRange: {
    from: '2025-08-01T00:00:00.000Z',
    to: '2025-08-31T23:59:59.999Z',
  },
  withdrawalStep: 'overview',
  withdrawalBanks: MOCK_WITHDRAWAL_BANKS,
  selectedWithdrawalBankId: MOCK_WITHDRAWAL_BANKS[0]?.id ?? null,
  withdrawalAmount: '',
  withdrawalCode: '',
  withdrawalSuccessVisible: false,
  setSelectedTransaction: (selectedTransaction) => set({ selectedTransaction }),
  setSelectedFilter: (selectedFilter) => set({ selectedFilter }),
  setDateRange: (dateRange) => set({ dateRange }),
  setWithdrawalStep: (withdrawalStep) => set({ withdrawalStep }),
  setSelectedWithdrawalBankId: (selectedWithdrawalBankId) => set({ selectedWithdrawalBankId }),
  setWithdrawalAmount: (withdrawalAmount) => set({ withdrawalAmount }),
  setWithdrawalCode: (withdrawalCode) => set({ withdrawalCode }),
  addWithdrawalBank: (bank) => {
    const addedBank: DoctorWithdrawalBank = {
      ...bank,
      id: `bank-${Date.now()}`,
    };

    useDoctorProfileSetupStore.getState().updateBankInfo({
      bankName: bank.bankName,
      accountName: bank.accountName,
      accountNumber: bank.accountNumber,
      sortCode: bank.sortCode,
      accountType: bank.accountType,
    });

    set((state) => ({
      withdrawalBanks: [addedBank, ...state.withdrawalBanks],
      selectedWithdrawalBankId: addedBank.id,
      withdrawalStep: 'overview',
    }));

    return addedBank;
  },
  submitWithdrawal: () =>
    set({
      withdrawalSuccessVisible: true,
      withdrawalCode: '',
    }),
  closeWithdrawalSuccess: () =>
    set({
      withdrawalSuccessVisible: false,
      withdrawalStep: 'overview',
      withdrawalAmount: '',
      withdrawalCode: '',
    }),
  resetWithdrawalFlow: () =>
    set((state) => ({
      withdrawalStep: 'overview',
      selectedWithdrawalBankId: state.withdrawalBanks[0]?.id ?? null,
      withdrawalAmount: '',
      withdrawalCode: '',
      withdrawalSuccessVisible: false,
    })),
}));
