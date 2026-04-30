import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDonorHome } from '../hooks/useDonorHome';
import type { DonationActivity } from '../types/donor.types';

export function DonorHomeView() {
  const { t } = useTranslation();
  const { status, dashboard, retry } = useDonorHome();

  if (status === 'loading') {
    return (
      <SafeAreaView className="flex-1 bg-bg-default items-center justify-center">
        <ActivityIndicator size="large" color="#4E61F6" />
        <Text className="text-b3 text-text-secondary mt-3">{t('common.loading')}</Text>
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView className="flex-1 bg-bg-default items-center justify-center px-6">
        <Text className="text-s2 text-text-primary text-center">{t('donorHome.errorMessage')}</Text>
        <TouchableOpacity
          className="mt-4 bg-action-primary rounded-lg px-6 py-3"
          onPress={retry}
          accessibilityRole="button"
        >
          <Text className="text-btn-medium text-white">{t('common.retry')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!dashboard) return null;

  const hasActivity = dashboard.recentActivity.length > 0;
  const greeting = dashboard.donorName
    ? t('donorHome.greeting', { name: dashboard.donorName })
    : t('donorHome.greetingFallback');

  return (
    <SafeAreaView className="flex-1 bg-bg-default">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="pt-6 pb-4">
          <Text className="text-h5 text-text-primary">{greeting}</Text>
        </View>

        {/* Impact card */}
        <View className="bg-green-500 rounded-xl p-5 mb-4 flex-row">
          <View className="flex-1 items-center">
            <Text className="text-h4 text-white">${dashboard.totalDonated}</Text>
            <Text className="text-c2 text-white opacity-80 mt-1">{t('donorHome.impactCard.totalDonated')}</Text>
          </View>
          <View className="w-px bg-white opacity-30 mx-4" />
          <View className="flex-1 items-center">
            <Text className="text-h4 text-white">{dashboard.patientsHelped}</Text>
            <Text className="text-c2 text-white opacity-80 mt-1">{t('donorHome.impactCard.patientsHelped')}</Text>
          </View>
        </View>

        {/* Pool balance card */}
        <View className="bg-bg-surface border border-border-default rounded-xl p-5 mb-6">
          <Text className="text-b4 text-text-secondary mb-1">{t('donorHome.poolCard.balance')}</Text>
          <Text className="text-h4 text-text-primary mb-4">${dashboard.poolBalance}</Text>
          <TouchableOpacity
            className="bg-action-primary rounded-lg py-3 items-center"
            accessibilityRole="button"
          >
            <Text className="text-btn-medium text-white">{t('donorHome.poolCard.donateNow')}</Text>
          </TouchableOpacity>
        </View>

        {/* Recent activity */}
        <Text className="text-s2 text-text-primary mb-3">{t('donorHome.recentActivity')}</Text>

        {!hasActivity ? (
          <View className="items-center py-10">
            <Text className="text-b1 text-text-secondary">{t('donorHome.noActivity')}</Text>
            <Text className="text-b3 text-text-tertiary mt-1">{t('donorHome.noActivityHint')}</Text>
          </View>
        ) : (
          dashboard.recentActivity.map((a: DonationActivity) => (
            <View
              key={a.id}
              className="bg-bg-surface border border-border-default rounded-xl p-4 mb-3 flex-row items-center justify-between"
            >
              <View>
                {a.patientInitials && (
                  <Text className="text-b2 text-text-primary">{a.patientInitials}</Text>
                )}
                <Text className="text-c1 text-text-tertiary">{a.date}</Text>
              </View>
              <Text className="text-s2 text-green-500">${a.amount}</Text>
            </View>
          ))
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
