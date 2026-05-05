import { useMemo } from 'react';
import { useDoctorEarningsStore } from '../store/doctorEarnings.store';

function startOfDay(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return Number.NEGATIVE_INFINITY;
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function endOfDay(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return Number.POSITIVE_INFINITY;
  date.setHours(23, 59, 59, 999);
  return date.getTime();
}

function formatShortDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function useDoctorEarnings() {
  const transactions = useDoctorEarningsStore((state) => state.transactions);
  const selectedTransaction = useDoctorEarningsStore((state) => state.selectedTransaction);
  const selectedFilter = useDoctorEarningsStore((state) => state.selectedFilter);
  const dateRange = useDoctorEarningsStore((state) => state.dateRange);
  const withdrawalStep = useDoctorEarningsStore((state) => state.withdrawalStep);
  const withdrawalBanks = useDoctorEarningsStore((state) => state.withdrawalBanks);
  const selectedWithdrawalBankId = useDoctorEarningsStore((state) => state.selectedWithdrawalBankId);
  const withdrawalAmount = useDoctorEarningsStore((state) => state.withdrawalAmount);
  const withdrawalCode = useDoctorEarningsStore((state) => state.withdrawalCode);
  const withdrawalSuccessVisible = useDoctorEarningsStore((state) => state.withdrawalSuccessVisible);
  const setSelectedTransaction = useDoctorEarningsStore((state) => state.setSelectedTransaction);
  const setSelectedFilter = useDoctorEarningsStore((state) => state.setSelectedFilter);
  const setDateRange = useDoctorEarningsStore((state) => state.setDateRange);
  const setWithdrawalStep = useDoctorEarningsStore((state) => state.setWithdrawalStep);
  const setSelectedWithdrawalBankId = useDoctorEarningsStore((state) => state.setSelectedWithdrawalBankId);
  const setWithdrawalAmount = useDoctorEarningsStore((state) => state.setWithdrawalAmount);
  const setWithdrawalCode = useDoctorEarningsStore((state) => state.setWithdrawalCode);
  const addWithdrawalBank = useDoctorEarningsStore((state) => state.addWithdrawalBank);
  const submitWithdrawal = useDoctorEarningsStore((state) => state.submitWithdrawal);
  const closeWithdrawalSuccess = useDoctorEarningsStore((state) => state.closeWithdrawalSuccess);
  const resetWithdrawalFlow = useDoctorEarningsStore((state) => state.resetWithdrawalFlow);

  const rangeTransactions = useMemo(() => {
    const fromTime = startOfDay(dateRange.from);
    const toTime = endOfDay(dateRange.to);

    return transactions.filter((transaction) => {
      const transactionTime = new Date(transaction.occurredAt).getTime();
      if (Number.isNaN(transactionTime)) return false;
      return transactionTime >= fromTime && transactionTime <= toTime;
    });
  }, [dateRange.from, dateRange.to, transactions]);

  const filteredTransactions = useMemo(() => {
    if (selectedFilter === 'all') return rangeTransactions;
    return rangeTransactions.filter((transaction) => transaction.status === selectedFilter);
  }, [rangeTransactions, selectedFilter]);

  const recentTransactions = useMemo(
    () => filteredTransactions.slice(0, 5),
    [filteredTransactions],
  );

  const payoutTransactions = useMemo(
    () => rangeTransactions.filter((transaction) => transaction.status === 'paid'),
    [rangeTransactions],
  );

  const totalBalance = useMemo(
    () => payoutTransactions.reduce((total, transaction) => total + transaction.amount, 0),
    [payoutTransactions],
  );

  const periodEarnings = useMemo(
    () => rangeTransactions.reduce((total, transaction) => total + transaction.amount, 0),
    [rangeTransactions],
  );

  const availableToWithdraw = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.status === 'paid')
        .reduce((total, transaction) => total + transaction.amount, 0),
    [transactions],
  );

  const dateRangeLabel = useMemo(() => {
    const fromLabel = formatShortDate(dateRange.from);
    const toLabel = formatShortDate(dateRange.to);
    return fromLabel === toLabel ? fromLabel : `${fromLabel} - ${toLabel}`;
  }, [dateRange.from, dateRange.to]);

  const selectedWithdrawalBank = useMemo(
    () => withdrawalBanks.find((bank) => bank.id === selectedWithdrawalBankId) ?? null,
    [selectedWithdrawalBankId, withdrawalBanks],
  );

  return {
    totalBalance,
    periodEarnings,
    availableToWithdraw,
    transactions,
    rangeTransactions,
    payoutTransactions,
    selectedTransaction,
    selectedFilter,
    dateRange,
    dateRangeLabel,
    withdrawalStep,
    withdrawalBanks,
    selectedWithdrawalBankId,
    selectedWithdrawalBank,
    withdrawalAmount,
    withdrawalCode,
    withdrawalSuccessVisible,
    filteredTransactions,
    recentTransactions,
    setSelectedTransaction,
    setSelectedFilter,
    setDateRange,
    setWithdrawalStep,
    setSelectedWithdrawalBankId,
    setWithdrawalAmount,
    setWithdrawalCode,
    addWithdrawalBank,
    submitWithdrawal,
    closeWithdrawalSuccess,
    resetWithdrawalFlow,
  };
}
