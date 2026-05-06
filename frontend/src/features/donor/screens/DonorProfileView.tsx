import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { DonorProfilePaymentRow } from '../components/profile/DonorProfilePaymentRow';
import { DonorProfileSettingNavRow } from '../components/profile/DonorProfileSettingNavRow';
import { DonorProfileSettingToggleRow } from '../components/profile/DonorProfileSettingToggleRow';
import { useDonorProfile } from '../hooks/useDonorProfile';

export interface DonorProfileViewProps {
  onEditCard: (cardId: string) => void;
  onEditFrequency: () => void;
  onAddMethod: () => void;
  onLanguage: () => void;
  onPrivacyPolicy: () => void;
}

const BRAND_ICON: Record<'mastercard' | 'visa', React.ReactNode> = {
  mastercard: <MaterialCommunityIcons name="credit-card" size={20} color={primitiveColors['primary-500']} />,
  visa: <MaterialCommunityIcons name="credit-card-outline" size={20} color={primitiveColors['primary-500']} />,
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function DonorProfileView({
  onEditCard,
  onEditFrequency,
  onAddMethod,
  onLanguage,
  onPrivacyPolicy,
}: DonorProfileViewProps) {
  const { t } = useTranslation();
  const { status, profile, retry, handleToggleNotifications } = useDonorProfile();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="bg-primary-50 px-5 py-4 items-center justify-center">
        <Text className="text-s1 font-semibold font-sans text-grey-900">
          {t('donorProfile.headerTitle')}
        </Text>
      </View>

      {/* Loading */}
      {status === 'loading' && (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
          <Text className="text-b2 font-sans text-grey-500">{t('donorProfile.loading')}</Text>
        </View>
      )}

      {/* Error */}
      {status === 'error' && (
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Ionicons name="alert-circle-outline" size={48} color={primitiveColors['grey-300']} />
          <Text className="text-b2 font-sans text-grey-500 text-center">
            {t('donorProfile.errorMessage')}
          </Text>
          <Button label={t('common.retry')} variant="outline" size="medium" onPress={() => void retry()} />
        </View>
      )}

      {/* Success */}
      {status === 'success' && profile != null && (
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-10"
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar + name + email */}
          <View className="items-center pt-6 pb-5 gap-2 px-5">
            <View className="w-20 h-20 rounded-full bg-primary-100 items-center justify-center">
              <Text className="text-h5 font-semibold font-sans text-primary-600">
                {getInitials(profile.name)}
              </Text>
            </View>
            <Text className="text-h5 font-semibold font-sans text-grey-900">{profile.name}</Text>
            <Text className="text-b3 font-sans text-grey-500">{profile.email}</Text>
          </View>

          {/* Stats row */}
          <View className="flex-row mx-5 border border-grey-200 rounded-2xl overflow-hidden">
            <View className="flex-1 items-center py-4 gap-1">
              <Text className="text-b4 font-sans text-grey-500">
                {t('donorProfile.totalDonationLabel')}
              </Text>
              <Text className="text-s1 font-semibold font-sans text-primary-500">
                {`$${profile.totalDonated.toLocaleString()}`}
              </Text>
            </View>
            <View className="w-[1px] bg-grey-200" />
            <View className="flex-1 items-center py-4 gap-1">
              <Text className="text-b4 font-sans text-grey-500">
                {t('donorProfile.patientsHelpedLabel')}
              </Text>
              <Text className="text-s1 font-semibold font-sans text-primary-500">
                {profile.patientsHelped}
              </Text>
            </View>
          </View>

          <View className="px-5 pt-5 gap-4">
            {/* Payment Methods card */}
            <View className="border border-grey-200 rounded-2xl p-4 gap-3">
              <Text className="text-s2 font-semibold font-sans text-grey-900">
                {t('donorProfile.paymentMethodsTitle')}
              </Text>

              {/* Saved payment cards */}
              {profile.savedCards.map((card) => (
                <DonorProfilePaymentRow
                  key={card.id}
                  icon={BRAND_ICON[card.brand]}
                  title={`${card.brand === 'visa' ? 'Visa' : 'Mastercard'} ****${card.last4}`}
                  subtitle={card.isDefault ? t('donorProfile.defaultCardLabel') : card.expiry}
                  onEdit={() => onEditCard(card.id)}
                />
              ))}

              {/* Donation frequency row */}
              <DonorProfilePaymentRow
                icon={<Ionicons name="repeat-outline" size={20} color={primitiveColors['primary-500']} />}
                title={`${profile.frequency === 'monthly' ? t('donorProfile.frequencyMonthly') : t('donorProfile.frequencyOneTime')}-$${profile.donationAmount}`}
                subtitle={t('donorProfile.recurringLabel')}
                onEdit={onEditFrequency}
              />

              {/* Add payment method */}
              <Button
                label={t('donorProfile.addPaymentMethod')}
                variant="outline"
                size="large"
                fullWidth
                onPress={onAddMethod}
                iconLeft={<Ionicons name="add" size={18} color={primitiveColors['primary-500']} />}
              />
            </View>

            {/* Settings card */}
            <View className="border border-grey-200 rounded-2xl p-4 gap-4">
              <Text className="text-s2 font-semibold font-sans text-grey-900">
                {t('donorProfile.settingsTitle')}
              </Text>

                <DonorProfileSettingToggleRow
                  icon={<Ionicons name="notifications-outline" size={16} color={primitiveColors['primary-500']} />}
                  label={t('donorProfile.settingNotifications')}
                  value={profile.notificationsEnabled}
                  onValueChange={handleToggleNotifications}
                />

                <DonorProfileSettingNavRow
                  icon={<MaterialCommunityIcons name="translate" size={16} color={primitiveColors['primary-500']} />}
                  label={t('donorProfile.settingLanguage')}
                  onPress={onLanguage}
                />

                <DonorProfileSettingNavRow
                  icon={<MaterialCommunityIcons name="file-document-outline" size={16} color={primitiveColors['primary-500']} />}
                  label={t('donorProfile.settingPrivacyPolicy')}
                  onPress={onPrivacyPolicy}
                />
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
