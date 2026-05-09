import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import { usePatientHome } from '../hooks/usePatientHome';
import { CareInProgressCard } from '../components/CareInProgressCard';
import { QuickActionsRow } from '../components/QuickActionsRow';
import { CheckSymptomsCard } from '../components/CheckSymptomsCard';
import { ActivityCard } from '../components/ActivityCard';
import { CareFundingCard } from '../components/CareFundingCard';
import { EmptyActivityState } from '../components/EmptyActivityState';
import { NuraMark } from '../components/NuraMark';

// Figma MCP assets — replace with local assets in production
const AVATAR_URI = 'https://www.figma.com/api/mcp/asset/a0119cc5-c8fb-45dc-8a36-d9e3a03be586';

export interface PatientHomeViewProps {
  onCalendar: () => void;
  onNotification: () => void;
  onProfile: () => void;
  onLanguage: () => void;
  onViewCarePlan: (id: string) => void;
  onCheckSymptoms: () => void;
  onBook: () => void;
  onDiagnosis: () => void;
  onPrescription: () => void;
  onTest: () => void;
  onJoinConsultation: (id: string) => void;
}

export function PatientHomeView({
  onCalendar,
  onNotification,
  onProfile,
  onLanguage,
  onViewCarePlan,
  onCheckSymptoms,
  onBook,
  onDiagnosis,
  onPrescription,
  onTest,
  onJoinConsultation,
}: PatientHomeViewProps) {
  const { t } = useTranslation();
  const { status, refreshing, dashboard, retry, refresh } = usePatientHome();

  // ── Loading ───────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
      </SafeAreaView>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-s2 font-semibold font-sans text-grey-900 text-center mb-4">
          {t('patientHome.errorMessage')}
        </Text>
        <TouchableOpacity
          onPress={retry}
          className="bg-primary-500 rounded-xl px-6 py-3"
          accessibilityRole="button"
        >
          <Text className="text-btn-medium font-sans text-white">{t('common.retry')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── Empty guard ───────────────────────────────────────────────────────────
  if (!dashboard) return null;

  const isNewUser     = dashboard.isNewUser;
  const name          = dashboard.patientName;
  const hasActivities = dashboard.recentActivities.length > 0;
  const avatarUri = dashboard.avatarUri ?? AVATAR_URI;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* ── Header ─────────────────────────────────────── */}
      <View className="bg-primary-50 h-[66px] w-full justify-end">
        <View className="flex-row items-center justify-between px-4 pb-3 h-[48px]">
          {/* Avatar circle */}
          <Pressable
            onPress={onProfile}
            className="w-6 h-6 rounded-full overflow-hidden bg-grey-200"
            accessibilityRole="button"
            accessibilityLabel={t('tabs.profile')}
          >
            <Image source={{ uri: avatarUri }} style={{ width: 24, height: 24 }} />
          </Pressable>

          {/* "Home" title */}
          <Text className="text-s2 font-semibold font-sans text-grey-900">
            {t('patientHome.headerTitle')}
          </Text>

          {/* Right: language badge + calendar + bell */}
          <View className="flex-row items-center gap-4">
            <Pressable
              onPress={onLanguage}
              className="flex-row items-center gap-1 bg-grey-50 border border-grey-300 rounded-md h-6 px-2.5"
              accessibilityRole="button"
              accessibilityLabel="Change language"
            >
              <Text className="text-[14px]">🇺🇸</Text>
              <Ionicons name="chevron-down" size={12} color={primitiveColors['grey-600']} />
            </Pressable>

            <Pressable onPress={onCalendar} accessibilityRole="button" accessibilityLabel="Calendar">
              <Ionicons name="calendar-outline" size={24} color={primitiveColors['grey-900']} />
            </Pressable>

            <Pressable onPress={onNotification} accessibilityRole="button" accessibilityLabel="Notifications">
              <Ionicons name="notifications" size={24} color={primitiveColors['grey-900']} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* ── Scrollable content ── */}
      <ScrollView
        className="flex-1"
        contentContainerClassName={['px-4 pt-4 gap-6 pb-28'].join(' ')}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void refresh()}
            tintColor={primitiveColors['primary-500']}
            colors={[primitiveColors['primary-500']]}
          />
        }
      >
        {/* Greeting */}
        <View className="gap-1">
          <Text className="text-c2 font-semibold font-sans text-grey-600">
            {t('patientHome.welcome')}
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-s2 font-semibold font-sans text-grey-900">
              {t('patientHome.greeting', { name })}
            </Text>
            <Text className="text-[16px]">👋</Text>
          </View>
        </View>

        {/* [Screen 1] Care In Progress card */}
        {!isNewUser && dashboard.careInProgress != null && (
          <CareInProgressCard care={dashboard.careInProgress} onViewCarePlan={onViewCarePlan} />
        )}

        {/* [Screen 2] Check Symptoms with Start button — appears before Quick Actions */}
        {isNewUser && (
          <CheckSymptomsCard variant="start" onPress={onCheckSymptoms} />
        )}

        {/* Quick Actions — both screens */}
        <QuickActionsRow
          onBook={onBook}
          onDiagnosis={onDiagnosis}
          onPrescription={onPrescription}
          onTest={onTest}
        />

        {/* [Screen 1] Check Symptoms with arrow — appears after Quick Actions */}
        {!isNewUser && (
          <CheckSymptomsCard variant="arrow" onPress={onCheckSymptoms} />
        )}

        {/* Recent Activity section */}
        <View className="gap-2">
          <Text className="text-s2 font-semibold font-sans text-grey-900">
            {t('patientHome.recentActivity')}
          </Text>

          {isNewUser || !hasActivities ? (
            <EmptyActivityState onCheckSymptoms={onCheckSymptoms} />
          ) : (
            <View className="gap-2">
              {dashboard.recentActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onJoin={onJoinConsultation}
                />
              ))}
            </View>
          )}
        </View>

        {/* [Screen 1] Care Funding */}
        {!isNewUser && dashboard.careFunding != null && (
          <CareFundingCard funding={dashboard.careFunding} />
        )}
      </ScrollView>

      {/* ── Sticky FAB: Screen 1 only, above bottom nav ── */}
      {!isNewUser && (
        <View className="absolute bottom-20 right-4 items-end">
          <Pressable
            onPress={onCheckSymptoms}
            className="bg-primary-500 border-4 border-primary-100 rounded-[32px] px-4 py-3 w-[185px]"
            style={{
              shadowColor: '#131927',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.14,
              shadowRadius: 28,
              elevation: 8,
            }}
            accessibilityRole="button"
          >
            <View className="flex-row items-center gap-2 justify-center">
              <NuraMark size={20} />
              <Text className="text-btn-medium font-sans text-white">
                {t('patientHome.checkSymptoms')}
              </Text>
            </View>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
