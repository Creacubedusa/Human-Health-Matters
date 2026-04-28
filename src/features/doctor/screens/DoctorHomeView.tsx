import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDoctorHome } from '../hooks/useDoctorHome';
import type { RecentPatient } from '../types/doctor.types';

export function DoctorHomeView() {
  const { t } = useTranslation();
  const router = useRouter();
  const { status, dashboard, retry } = useDoctorHome();

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
        <Text className="text-s2 text-text-primary text-center">{t('doctorHome.errorMessage')}</Text>
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

  const isOnboardingIncomplete = dashboard.onboardingStatus === 'incomplete';
  const greeting = dashboard.doctorName
    ? t('doctorHome.greeting', { name: dashboard.doctorName })
    : t('doctorHome.greetingFallback');

  return (
    <SafeAreaView className="flex-1 bg-bg-default">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="pt-6 pb-4">
          <Text className="text-h5 text-text-primary">{greeting}</Text>
        </View>

        {/* Onboarding banner — blocks access until complete */}
        {isOnboardingIncomplete && (
          <TouchableOpacity
            className="bg-status-warning-subtle border border-status-warning rounded-lg p-4 mb-4 flex-row items-center justify-between"
            onPress={() => router.push('/(doctor)/profile')}
            accessibilityRole="button"
          >
            <Text className="text-b3 text-status-warning-strong flex-1">
              {t('doctorHome.onboardingBanner')}
            </Text>
            <Text className="text-btn-small text-status-warning-strong ml-2">
              {t('doctorHome.completeProfile')}
            </Text>
          </TouchableOpacity>
        )}

        {/* Pending consultations card */}
        <View className="bg-primary-500 rounded-xl p-5 mb-4">
          <Text className="text-b4 text-white opacity-80 mb-1">{t('doctorHome.pendingCard.title')}</Text>
          {dashboard.pendingConsultations === 0 ? (
            <Text className="text-s1 text-white">{t('doctorHome.pendingCard.none')}</Text>
          ) : (
            <Text className="text-h4 text-white">{dashboard.pendingConsultations}</Text>
          )}
        </View>

        {/* Weekly stats card */}
        <View className="bg-bg-surface border border-border-default rounded-xl p-5 mb-6 flex-row">
          <View className="flex-1 items-center">
            <Text className="text-h4 text-text-primary">{dashboard.weeklyStats.consultations}</Text>
            <Text className="text-c2 text-text-secondary mt-1">{t('doctorHome.statsCard.consultations')}</Text>
          </View>
          <View className="w-px bg-border-default mx-4" />
          <View className="flex-1 items-center">
            <Text className="text-h4 text-text-primary">{dashboard.weeklyStats.patients}</Text>
            <Text className="text-c2 text-text-secondary mt-1">{t('doctorHome.statsCard.patients')}</Text>
          </View>
        </View>

        {/* Recent patients */}
        <Text className="text-s2 text-text-primary mb-3">{t('doctorHome.recentPatients')}</Text>

        {dashboard.recentPatients.length === 0 ? (
          <View className="items-center py-10">
            <Text className="text-b1 text-text-secondary">{t('doctorHome.noPatients')}</Text>
            <Text className="text-b3 text-text-tertiary mt-1">{t('doctorHome.noPatientsHint')}</Text>
          </View>
        ) : (
          dashboard.recentPatients.map((p: RecentPatient) => (
            <View
              key={p.id}
              className="bg-bg-surface border border-border-default rounded-xl p-4 mb-3"
            >
              <Text className="text-b2 text-text-primary">{p.name}</Text>
              <Text className="text-c1 text-text-tertiary">{p.lastVisit}</Text>
            </View>
          ))
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
