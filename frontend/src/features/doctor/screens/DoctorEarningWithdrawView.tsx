import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { primitiveColors } from '@design/tokens';
import { ProfileHeader } from '@features/patient/components/profile/ProfileHeader';
import { useAuthStore } from '@shared/store/auth.store';
import { Button } from '@shared/components/ui/Button';
import { CodeInput } from '@shared/components/ui/CodeInput';
import { Input } from '@shared/components/ui/Input';
import { useDoctorEarnings } from '../hooks/useDoctorEarnings';

const CODE_LENGTH = 6;
const PRESET_AMOUNTS = [50, 100, 150, 500, 1000, 1500];

function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function maskAccountNumber(accountNumber: string) {
  const trimmed = accountNumber.replace(/\s/g, '');
  if (trimmed.length <= 4) return trimmed;
  return `••••${trimmed.slice(-4)}`;
}

function maskEmail(email: string | null) {
  if (!email || !email.includes('@')) return '***iro@gmail.com';

  const [localPart, domain] = email.split('@');
  if (localPart.length <= 3) return `***@${domain}`;
  return `***${localPart.slice(-3)}@${domain}`;
}

function normalizeAmount(value: string) {
  const sanitized = value.replace(/[^0-9.]/g, '');
  const [integerPart = '', decimalPart] = sanitized.split('.');

  if (decimalPart == null) return integerPart;
  return `${integerPart}.${decimalPart.slice(0, 2)}`;
}

export function DoctorEarningWithdrawView() {
  const { t } = useTranslation();
  const router = useRouter();
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  const {
    availableToWithdraw,
    withdrawalStep,
    withdrawalBanks,
    selectedWithdrawalBank,
    selectedWithdrawalBankId,
    withdrawalAmount,
    withdrawalCode,
    withdrawalSuccessVisible,
    setWithdrawalStep,
    setSelectedWithdrawalBankId,
    setWithdrawalAmount,
    setWithdrawalCode,
    addWithdrawalBank,
    submitWithdrawal,
    closeWithdrawalSuccess,
    resetWithdrawalFlow,
  } = useDoctorEarnings();

  const [bankForm, setBankForm] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    sortCode: '',
    accountType: '',
  });
  const [bankErrors, setBankErrors] = useState<Record<string, string>>({});
  const [amountError, setAmountError] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(30);

  const hasBanks = withdrawalBanks.length > 0;
  const parsedAmount = Number(withdrawalAmount);
  const isAmountValid =
    withdrawalAmount.trim().length > 0 &&
    !Number.isNaN(parsedAmount) &&
    parsedAmount > 0 &&
    parsedAmount <= availableToWithdraw;

  const headerTitle = useMemo(() => {
    switch (withdrawalStep) {
      case 'addBank':
        return t('doctorEarnings.addBankTitle');
      case 'selectBank':
      case 'enterAmount':
        return t('doctorEarnings.payoutTitle');
      case 'verify':
        return t('doctorEarnings.confirmTitle');
      case 'overview':
      default:
        return t('doctorEarnings.withdrawalTitle');
    }
  }, [t, withdrawalStep]);

  const verifySubtitle = useMemo(() => {
    const maskedEmail = maskEmail(pendingEmail);
    const amountLabel = parsedAmount > 0 ? `$${parsedAmount.toFixed(0)}` : '$0';

    return t('doctorEarnings.verifySubtitle', {
      email: maskedEmail,
      amount: amountLabel,
    });
  }, [parsedAmount, pendingEmail, t]);

  const successMessage = useMemo(() => {
    if (!selectedWithdrawalBank) return t('doctorEarnings.withdrawSuccessFallback');

    return t('doctorEarnings.withdrawSuccessMessage', {
      bankName: selectedWithdrawalBank.bankName,
      last4: maskAccountNumber(selectedWithdrawalBank.accountNumber),
    });
  }, [selectedWithdrawalBank, t]);

  useEffect(() => {
    resetWithdrawalFlow();
  }, [resetWithdrawalFlow]);

  useEffect(() => {
    if (withdrawalStep !== 'verify') {
      setSecondsRemaining(30);
      return;
    }

    if (secondsRemaining <= 0) return;

    const timeout = setTimeout(() => {
      setSecondsRemaining((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [secondsRemaining, withdrawalStep]);

  function handleBack() {
    if (withdrawalSuccessVisible) {
      closeWithdrawalSuccess();
      router.back();
      return;
    }

    switch (withdrawalStep) {
      case 'addBank':
      case 'selectBank':
        setWithdrawalStep('overview');
        return;
      case 'enterAmount':
        setWithdrawalStep('selectBank');
        return;
      case 'verify':
        setWithdrawalStep('enterAmount');
        return;
      case 'overview':
      default:
        resetWithdrawalFlow();
        router.back();
    }
  }

  function handleChangeBankField(field: keyof typeof bankForm, value: string) {
    setBankForm((current) => ({ ...current, [field]: value }));
    setBankErrors((current) => ({ ...current, [field]: '' }));
  }

  function handleAddBank() {
    const nextErrors: Record<string, string> = {};

    if (!bankForm.bankName.trim()) nextErrors.bankName = t('doctorEarnings.errors.bankNameRequired');
    if (!bankForm.accountName.trim()) nextErrors.accountName = t('doctorEarnings.errors.accountNameRequired');
    if (!bankForm.accountNumber.trim()) nextErrors.accountNumber = t('doctorEarnings.errors.accountNumberRequired');
    if (!bankForm.sortCode.trim()) nextErrors.sortCode = t('doctorEarnings.errors.sortCodeRequired');

    if (Object.keys(nextErrors).length > 0) {
      setBankErrors(nextErrors);
      return;
    }

    addWithdrawalBank({
      bankName: bankForm.bankName.trim(),
      accountName: bankForm.accountName.trim(),
      accountNumber: bankForm.accountNumber.trim(),
      sortCode: bankForm.sortCode.trim(),
      accountType: bankForm.accountType.trim() || 'Checking',
    });

    setBankForm({
      bankName: '',
      accountName: '',
      accountNumber: '',
      sortCode: '',
      accountType: '',
    });
    setBankErrors({});
  }

  function handleAmountContinue() {
    if (!isAmountValid) {
      setAmountError(
        parsedAmount > availableToWithdraw
          ? t('doctorEarnings.errors.amountExceedsBalance')
          : t('doctorEarnings.errors.amountRequired'),
      );
      return;
    }

    setAmountError(null);
    setWithdrawalStep('verify');
  }

  function handleVerifySubmit() {
    if (withdrawalCode.length !== CODE_LENGTH) return;
    submitWithdrawal();
  }

  function renderBankCard(bankId: string, interactive: boolean) {
    const bank = withdrawalBanks.find((item) => item.id === bankId);
    if (!bank) return null;

    const isSelected = bank.id === selectedWithdrawalBankId;

    return (
      <Pressable
        key={bank.id}
        onPress={
          interactive
            ? () => {
                setSelectedWithdrawalBankId(bank.id);
                setWithdrawalStep('enterAmount');
              }
            : undefined
        }
        disabled={!interactive}
        className={[
          'rounded-lg border px-4 py-4',
          interactive && isSelected ? 'border-primary-500 bg-primary-50/30' : 'border-grey-300 bg-white',
        ].join(' ')}
      >
        <View className="flex-row items-center justify-between gap-4">
          <View className="flex-1 flex-row items-center gap-3">
            <View className="size-10 items-center justify-center rounded-[4px] bg-primary-50">
              <MaterialCommunityIcons name="bank-outline" size={20} color={primitiveColors['primary-500']} />
            </View>

            <View className="flex-1 gap-1.5">
              <Text className="text-b3 font-medium font-sans text-grey-900">
                {bank.bankName}
              </Text>
              <Text className="text-c1 font-sans text-grey-500">
                {`${bank.accountName}. ${bank.accountNumber}. ${bank.accountType.toLowerCase()}`}
              </Text>
            </View>
          </View>

          {interactive ? (
            <View
              className={[
                'size-6 rounded-full border-2 items-center justify-center',
                isSelected ? 'border-primary-500' : 'border-primary-500/90',
              ].join(' ')}
            >
              {isSelected ? <View className="size-3 rounded-full bg-primary-500" /> : null}
            </View>
          ) : null}
        </View>
      </Pressable>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ProfileHeader
        title={headerTitle}
        backLabel={t('common.back')}
        onBack={handleBack}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-6 pb-10 gap-6"
        showsVerticalScrollIndicator={false}
      >
        {withdrawalStep === 'overview' ? (
          <>
            <View className="items-center gap-4 pt-8">
              <Text className="text-b3 font-sans text-grey-500">
                {t('doctorEarnings.availableToWithdraw')}
              </Text>
              <Text className="text-h3 font-semibold font-sans text-grey-900">
                {formatCurrency(availableToWithdraw)}
              </Text>
              <View className="w-full">
                <Button
                  label={t('doctorEarnings.withdraw')}
                  variant="filled"
                  size="large"
                  fullWidth
                  onPress={() => setWithdrawalStep(hasBanks ? 'selectBank' : 'addBank')}
                />
              </View>
            </View>

            <View className="gap-6">
              <View className="flex-row items-center justify-between">
                <Text className="text-s2 font-semibold font-sans text-grey-900">
                  {t('doctorEarnings.bankSection')}
                </Text>

                {hasBanks ? (
                  <Pressable
                    onPress={() => setWithdrawalStep('addBank')}
                    className="flex-row items-center gap-2"
                  >
                    <Text className="text-btn-medium font-semibold font-sans text-primary-500">
                      {t('doctorEarnings.add')}
                    </Text>
                    <Ionicons name="arrow-forward" size={18} color={primitiveColors['primary-500']} />
                  </Pressable>
                ) : null}
              </View>

              {hasBanks ? (
                <View className="gap-4">
                  {withdrawalBanks.map((bank) => renderBankCard(bank.id, false))}
                </View>
              ) : (
                <View className="items-center gap-6 px-4 py-8">
                  <View className="gap-2">
                    <Text className="text-center text-h4 font-semibold font-sans text-grey-900">
                      {t('doctorEarnings.noBankTitle')}
                    </Text>
                    <Text className="text-center text-b1 font-sans text-grey-500">
                      {t('doctorEarnings.noBankSubtitle')}
                    </Text>
                  </View>

                  <View className="w-[221px]">
                    <Button
                      label={t('doctorEarnings.addBankCta')}
                      variant="filled"
                      size="large"
                      fullWidth
                      onPress={() => setWithdrawalStep('addBank')}
                    />
                  </View>
                </View>
              )}
            </View>
          </>
        ) : null}

        {withdrawalStep === 'addBank' ? (
          <>
            <Text className="text-h4 font-semibold font-sans text-grey-900">
              {t('doctorEarnings.addBankHeading')}
            </Text>

            <View className="gap-4">
              <Input
                label={t('doctorProfileSetup.bank.bankNameLabel')}
                placeholder={t('doctorProfileSetup.bank.bankNamePlaceholder')}
                value={bankForm.bankName}
                onChangeText={(value) => handleChangeBankField('bankName', value)}
                status={bankErrors.bankName ? 'error' : 'default'}
                helperText={bankErrors.bankName || undefined}
              />
              <Input
                label={t('doctorProfileSetup.bank.accountNameLabel')}
                placeholder={t('doctorProfileSetup.bank.accountNamePlaceholder')}
                value={bankForm.accountName}
                onChangeText={(value) => handleChangeBankField('accountName', value)}
                status={bankErrors.accountName ? 'error' : 'default'}
                helperText={bankErrors.accountName || undefined}
              />
              <Input
                label={t('doctorProfileSetup.bank.accountNumberLabel')}
                placeholder={t('doctorProfileSetup.bank.accountNumberPlaceholder')}
                value={bankForm.accountNumber}
                onChangeText={(value) => handleChangeBankField('accountNumber', value.replace(/\D/g, ''))}
                keyboardType="numeric"
                status={bankErrors.accountNumber ? 'error' : 'default'}
                helperText={bankErrors.accountNumber || undefined}
              />
              <Input
                label={t('doctorProfileSetup.bank.sortCodeLabel')}
                placeholder={t('doctorProfileSetup.bank.sortCodePlaceholder')}
                value={bankForm.sortCode}
                onChangeText={(value) => handleChangeBankField('sortCode', value)}
                status={bankErrors.sortCode ? 'error' : 'default'}
                helperText={bankErrors.sortCode || undefined}
              />
              <Input
                label={t('doctorProfileSetup.bank.accountTypeLabel')}
                placeholder={t('doctorProfileSetup.bank.accountTypePlaceholder')}
                value={bankForm.accountType}
                onChangeText={(value) => handleChangeBankField('accountType', value)}
              />
            </View>

            <View className="pt-4">
              <Button
                label={t('doctorEarnings.add')}
                variant="filled"
                size="large"
                fullWidth
                onPress={handleAddBank}
              />
            </View>
          </>
        ) : null}

        {withdrawalStep === 'selectBank' ? (
          <>
            <Text className="text-h4 font-semibold font-sans text-grey-900">
              {t('doctorEarnings.chooseBankHeading')}
            </Text>

            <View className="gap-4">
              {withdrawalBanks.map((bank) => renderBankCard(bank.id, true))}
            </View>
          </>
        ) : null}

        {withdrawalStep === 'enterAmount' ? (
          <>
            {selectedWithdrawalBank ? (
              <View className="rounded-lg bg-grey-50 px-4 py-4">
                <View className="flex-row items-center gap-3">
                  <View className="size-10 items-center justify-center rounded-[4px] bg-primary-50">
                    <MaterialCommunityIcons name="bank-outline" size={20} color={primitiveColors['primary-500']} />
                  </View>

                  <View className="gap-1.5">
                    <Text className="text-b3 font-medium font-sans text-grey-900">
                      {selectedWithdrawalBank.bankName}
                    </Text>
                    <Text className="text-c1 font-sans text-grey-500">
                      {`${selectedWithdrawalBank.accountName}. ${selectedWithdrawalBank.accountNumber}. ${selectedWithdrawalBank.accountType.toLowerCase()}`}
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}

            <Text className="text-s2 font-semibold font-sans text-grey-900">
              {t('doctorEarnings.withdrawAmount')}
            </Text>

            <Input
              value={withdrawalAmount}
              onChangeText={(value) => {
                setWithdrawalAmount(normalizeAmount(value));
                setAmountError(null);
              }}
              keyboardType="decimal-pad"
              iconLeft={<Text className="text-b1 font-sans text-grey-900">$</Text>}
              status={amountError ? 'error' : 'default'}
              helperText={amountError || undefined}
            />

            <View className="gap-5 pt-2">
              <View className="flex-row flex-wrap justify-between gap-y-5">
                {PRESET_AMOUNTS.map((amount) => {
                  const isActive = withdrawalAmount === String(amount);
                  return (
                    <Pressable
                      key={amount}
                      onPress={() => {
                        setWithdrawalAmount(String(amount));
                        setAmountError(null);
                      }}
                      className={[
                        'w-[31%] rounded-md px-3 py-2 items-center justify-center',
                        isActive ? 'bg-primary-50 border border-primary-500' : 'bg-grey-200',
                      ].join(' ')}
                    >
                      <Text
                        className={[
                          'text-b3 font-sans text-center',
                          isActive ? 'text-primary-500' : 'text-grey-400',
                        ].join(' ')}
                      >
                        {`$${amount}`}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Button
                label={
                  isAmountValid
                    ? t('doctorEarnings.withdrawAmountCta', { amount: `$${parsedAmount.toFixed(0)}` })
                    : t('doctorEarnings.withdraw')
                }
                variant="filled"
                size="large"
                fullWidth
                onPress={handleAmountContinue}
                iconRight={
                  isAmountValid ? (
                    <Ionicons name="arrow-forward" size={18} color={primitiveColors.white} />
                  ) : undefined
                }
              />
            </View>
          </>
        ) : null}

        {withdrawalStep === 'verify' ? (
          <View className="flex-1 justify-between pt-4">
            <View className="items-center gap-14">
              <View className="gap-2">
                <Text className="text-center text-h4 font-semibold font-sans text-grey-900">
                  {t('doctorEarnings.verifyTitle')}
                </Text>
                <Text className="text-center text-b1 font-sans text-grey-500">
                  {verifySubtitle}
                </Text>
              </View>

              <CodeInput
                length={CODE_LENGTH}
                value={withdrawalCode}
                onChangeText={setWithdrawalCode}
                testID="withdrawal-code-input"
                variant="auth"
              />

              <Text className="text-h5 font-semibold font-sans text-primary-500">
                {`0:${String(secondsRemaining).padStart(2, '0')}`}
              </Text>
            </View>

            <View className="items-center gap-6 pt-20">
              <Button
                label={t('doctorEarnings.confirmWithdrawal')}
                variant="filled"
                size="large"
                fullWidth
                disabled={withdrawalCode.length !== CODE_LENGTH}
                onPress={handleVerifySubmit}
              />

              <Pressable
                onPress={() => {
                  if (secondsRemaining > 0) return;
                  setWithdrawalCode('');
                  setSecondsRemaining(30);
                }}
                disabled={secondsRemaining > 0}
              >
                <Text className={['text-b1 font-sans', secondsRemaining > 0 ? 'text-grey-400' : 'text-primary-500'].join(' ')}>
                  {t('doctorEarnings.resendCode')}
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </ScrollView>

      <Modal
        visible={withdrawalSuccessVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          closeWithdrawalSuccess();
          router.back();
        }}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full overflow-hidden rounded-lg border border-grey-200 bg-white">
            <View className="items-end px-4 pt-4">
              <Pressable
                onPress={() => {
                  closeWithdrawalSuccess();
                  router.back();
                }}
                accessibilityRole="button"
                accessibilityLabel={t('common.dismiss')}
              >
                <Ionicons name="close" size={20} color={primitiveColors['grey-400']} />
              </Pressable>
            </View>

            <View className="items-center gap-4 px-6 py-5">
              <Ionicons name="checkmark-circle" size={50} color={primitiveColors['primary-500']} />
              <Text className="text-center text-b1 font-sans text-grey-900">
                {successMessage}
              </Text>
            </View>

            <View className="items-center px-6 pb-6">
              <View className="w-[127px]">
                <Button
                  label={t('doctorEarnings.goIt')}
                  variant="filled"
                  size="small"
                  fullWidth
                  onPress={() => {
                    closeWithdrawalSuccess();
                    router.back();
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
