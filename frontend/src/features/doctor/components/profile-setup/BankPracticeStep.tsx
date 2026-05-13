import { ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Input } from '@shared/components/ui/Input';
import type { BankInfo, PracticeInfo } from '../../types/doctorProfileSetup.types';

export interface BankPracticeStepProps {
  bankInfo: BankInfo;
  practiceInfo: PracticeInfo;
  onChangeBankInfo: (data: Partial<BankInfo>) => void;
  onChangePracticeInfo: (data: Partial<PracticeInfo>) => void;
  testID?: string;
}

export function BankPracticeStep({
  bankInfo,
  practiceInfo,
  onChangeBankInfo,
  onChangePracticeInfo,
  testID,
}: BankPracticeStepProps) {
  const { t } = useTranslation();

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-4 pt-2 pb-8 gap-6"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      testID={testID}
    >
      <View className="gap-4">
        <Text className="text-h4 font-semibold font-sans text-grey-900">
          {t('doctorProfileSetup.bank.heading')}
        </Text>

        <Input
          label={t('doctorProfileSetup.bank.bankNameLabel')}
          placeholder={t('doctorProfileSetup.bank.bankNamePlaceholder')}
          value={bankInfo.bankName}
          onChangeText={(v) => onChangeBankInfo({ bankName: v })}
          testID="bank-name"
        />

        <Input
          label={t('doctorProfileSetup.bank.accountNameLabel')}
          placeholder={t('doctorProfileSetup.bank.accountNamePlaceholder')}
          value={bankInfo.accountName}
          onChangeText={(v) => onChangeBankInfo({ accountName: v })}
          testID="bank-account-name"
        />

        <Input
          label={t('doctorProfileSetup.bank.accountNumberLabel')}
          placeholder={t('doctorProfileSetup.bank.accountNumberPlaceholder')}
          value={bankInfo.accountNumber}
          onChangeText={(v) => onChangeBankInfo({ accountNumber: v })}
          keyboardType="numeric"
          testID="bank-account-number"
        />

        <Input
          label={t('doctorProfileSetup.bank.sortCodeLabel')}
          placeholder={t('doctorProfileSetup.bank.sortCodePlaceholder')}
          value={bankInfo.sortCode}
          onChangeText={(v) => onChangeBankInfo({ sortCode: v })}
          testID="bank-sort-code"
        />

        <Input
          label={t('doctorProfileSetup.bank.accountTypeLabel')}
          placeholder={t('doctorProfileSetup.bank.accountTypePlaceholder')}
          value={bankInfo.accountType}
          onChangeText={(v) => onChangeBankInfo({ accountType: v })}
          testID="bank-account-type"
        />
      </View>

      <View className="gap-4">
        <View className="gap-1">
          <Text className="text-h4 font-semibold font-sans text-grey-900">
            {t('doctorProfileSetup.practice.heading')}
          </Text>
          <Text className="text-b3 font-sans text-grey-500">
            {t('doctorProfileSetup.practice.subtitle')}
          </Text>
        </View>

        <Input
          label={t('doctorProfileSetup.practice.taxIdLabel')}
          placeholder={t('doctorProfileSetup.practice.taxIdPlaceholder')}
          value={practiceInfo.taxId}
          onChangeText={(v) => onChangePracticeInfo({ taxId: v })}
          testID="practice-tax-id"
        />

        <Input
          label={t('doctorProfileSetup.practice.practiceNameLabel')}
          placeholder={t('doctorProfileSetup.practice.practiceNamePlaceholder')}
          value={practiceInfo.practiceName}
          onChangeText={(v) => onChangePracticeInfo({ practiceName: v })}
          testID="practice-name"
        />

        <Input
          label={t('doctorProfileSetup.practice.billingAddressLabel')}
          placeholder={t('doctorProfileSetup.practice.billingAddressPlaceholder')}
          value={practiceInfo.billingAddress}
          onChangeText={(v) => onChangePracticeInfo({ billingAddress: v })}
          testID="practice-billing-address"
        />

        <View className="flex-row gap-4">
          <View className="flex-1">
            <Input
              label={t('doctorProfileSetup.practice.zipLabel')}
              placeholder={t('doctorProfileSetup.practice.zipPlaceholder')}
              value={practiceInfo.zipCode}
              onChangeText={(v) => onChangePracticeInfo({ zipCode: v })}
              keyboardType="numeric"
              testID="practice-zip"
            />
          </View>
          <View className="flex-1">
            <Input
              label={t('doctorProfileSetup.practice.countryLabel')}
              placeholder={t('doctorProfileSetup.practice.countryPlaceholder')}
              value={practiceInfo.country}
              onChangeText={(v) => onChangePracticeInfo({ country: v })}
              testID="practice-country"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
