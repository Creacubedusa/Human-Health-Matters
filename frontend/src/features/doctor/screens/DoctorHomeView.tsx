import { ActivityIndicator, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import { toast } from '@shared/components/ui/toast';
import { useDoctorHome } from '../hooks/useDoctorHome';
import { useDoctorNuraAI } from '../hooks/useDoctorNuraAI';
import { useDoctorPatientsStore } from '../store/doctorPatients.store';
import { PatientQueueCard } from '../components/home/PatientQueueCard';
import type { PatientInQueue } from '../types/doctor.types';

const FIGMA_NURA_AI_ICON =
  'https://www.figma.com/api/mcp/asset/c98342b1-bf53-41ec-9011-a7992bba5a4a';

const QUICK_ACTIONS = [
  {
    key: 'patient',
    labelKey: 'doctorHome.actionPatient',
    iconBg: 'bg-[#3095E2]',
    route: '/(doctor)/patients',
  },
  {
    key: 'create-order',
    label: 'Create Order',
    iconBg: 'bg-[#EE443F]',
    route: '/(doctor)/create-order-wizard',
  },
  {
    key: 'prescription',
    labelKey: 'doctorHome.actionPrescription',
    iconBg: 'bg-[#43B75D]',
    route: null,
  },
  {
    key: 'test',
    labelKey: 'doctorHome.actionTest',
    iconBg: 'bg-[#4E61F6]',
    route: null,
  },
] as const;

export function DoctorHomeView() {
  const { t } = useTranslation();
  const router = useRouter();
  const { status, homeDashboard, retry } = useDoctorHome();
  const { viewPatientSummary } = useDoctorNuraAI();
  const patients = useDoctorPatientsStore((state) => state.patients);

  if (status === 'loading') {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
        <Text className="text-b3 font-sans text-grey-500 mt-3">{t('common.loading')}</Text>
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-s2 font-semibold font-sans text-grey-900 text-center">
          {t('doctorHome.errorMessage')}
        </Text>
        <TouchableOpacity
          className="mt-4 bg-primary-500 rounded-lg px-6 py-3"
          onPress={retry}
          accessibilityRole="button"
        >
          <Text className="text-btn-medium font-semibold font-sans text-white">
            {t('common.retry')}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!homeDashboard) return null;

  const { doctorName, stats, patientsQueue } = homeDashboard;
  const hasQueue = patientsQueue.length > 0;
  const avatarUri = `https://i.pravatar.cc/100?u=doctor-home-${doctorName}`;

  function handleJoinCall(patientId: string) {
    router.push({
      pathname: '/(doctor)/consultation',
      params: { appointmentId: patientId },
    });
  }

  function handleViewAiSummary(patientId: string) {
    const item = viewPatientSummary(patientId);
    if (!item) return;
    router.push('/(doctor)/nura-ai-summary');
  }

  function handleQuickActionPress(
    action: (typeof QUICK_ACTIONS)[number],
  ) {
    if (action.key === 'prescription' || action.key === 'test') {
      const targetPatientId = patientsQueue[0]?.id ?? patients[0]?.id;

      if (!targetPatientId) {
        toast.info('No patient record is available yet for this action.');
        return;
      }

      router.push({
        pathname: '/(doctor)/patients/[patientId]/records/[recordId]',
        params: {
          patientId: targetPatientId,
          recordId: action.key === 'prescription' ? 'prescription' : 'tests',
        },
      });
      return;
    }

    if (action.route) {
      router.push(action.route as never);
    }
  }

  function renderQuickActionIcon(key: (typeof QUICK_ACTIONS)[number]['key']) {
    if (key === 'patient') {
      return (
        <MaterialCommunityIcons name="account-injury-outline" size={18} color="#ffffff" />
      );
    }

    if (key === 'create-order') {
      return <Ionicons name="add" size={18} color="#ffffff" />;
    }

    if (key === 'prescription') {
      return <MaterialCommunityIcons name="script-text-outline" size={16} color="#ffffff" />;
    }

    return <MaterialCommunityIcons name="file-chart-outline" size={16} color="#ffffff" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* ── Header ── */}
      <View className="bg-primary-50 px-4 pb-4 pt-2">
        <View className="flex-row items-center h-[42px]">
          {/* Doctor avatar — taps to profile */}
          <Pressable
            onPress={() => router.push('/(doctor)/profile')}
            accessibilityRole="button"
            accessibilityLabel="View profile"
            hitSlop={8}
            className="w-8 h-8 rounded-full bg-primary-100 items-center justify-center overflow-hidden z-10"
          >
            <Image source={{ uri: avatarUri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          </Pressable>

          {/* Title */}
          <View className="flex-1 items-center px-4" pointerEvents="none">
            <Text className="text-s2 font-semibold font-sans text-grey-900 text-center">
              {t('tabs.home')}
            </Text>
          </View>

          {/* Right icons */}
          <View className="flex-row items-center justify-end gap-4 min-w-[116px]">
            <Pressable
              onPress={() => router.push('/(doctor)/language')}
              accessibilityRole="button"
              accessibilityLabel={t('selectLanguage.headerTitle')}
              className="h-6 flex-row items-center gap-1 rounded-md border border-grey-300 bg-grey-50 px-[10px]"
            >
              <Text className="text-[12px]">🇺🇸</Text>
              <MaterialCommunityIcons
                name="chevron-down"
                size={14}
                color={primitiveColors['grey-700']}
              />
            </Pressable>
            <Pressable
              onPress={() => router.push('/(doctor)/calendar')}
              accessibilityRole="button"
              accessibilityLabel="Calendar"
            >
              <MaterialIcons name="date-range" size={22} color={primitiveColors['grey-900']} />
            </Pressable>
            <Pressable
              onPress={() => router.push('/(doctor)/notifications')}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              className="relative"
            >
              <Ionicons name="notifications" size={20} color={primitiveColors['grey-900']} />
              <View className="absolute right-0 top-0 h-[6px] w-[6px] rounded-full bg-red-500" />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-4 pb-24 gap-6"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Greeting ── */}
        <View className="gap-1">
          <Text className="text-c2 font-semibold font-sans text-grey-500">
            {t('doctorHome.welcome')}
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-s2 font-semibold font-sans text-grey-900">
              {t('doctorHome.helloDoctor', { name: doctorName })}
            </Text>
            <Text>👋</Text>
          </View>
        </View>

        {/* ── Stats row ── */}
        <View className="flex-row gap-4">
          <View className="h-[112px] w-[110px] bg-white border border-grey-200 rounded-2xl p-4 items-center justify-center gap-4">
            <Text className="text-[40px] leading-[48px] font-semibold font-sans text-primary-500">
              {stats.totalPatients}
            </Text>
            <Text className="text-c1 font-sans text-grey-500 text-center">
              {t('doctorHome.todaysPatient')}
            </Text>
          </View>
          <View className="h-[112px] w-[110px] bg-white border border-grey-200 rounded-2xl p-4 items-center justify-center gap-4">
            <Text className="text-[40px] leading-[48px] font-semibold font-sans text-red-500">
              {stats.emergencyCount}
            </Text>
            <Text className="text-c1 font-sans text-grey-500 text-center">
              {t('doctorHome.emergencyLabel')}
            </Text>
          </View>
          <View className="h-[112px] w-[110px] bg-white border border-grey-200 rounded-2xl p-4 items-center justify-center gap-4">
            <Text className="text-[40px] leading-[48px] font-semibold font-sans text-green-500">
              {stats.seenCount}
            </Text>
            <Text className="text-c1 font-sans text-grey-500 text-center">
              {t('doctorHome.seenLabel')}
            </Text>
          </View>
        </View>

        {/* ── Quick Action ── */}
        <View className="bg-white px-4 py-3 gap-4">
          <Text className="text-s2 font-semibold font-sans text-grey-900">
            {t('doctorHome.quickAction')}
          </Text>
          <View className="flex-row items-center justify-between">
            {QUICK_ACTIONS.map((action) => (
              <Pressable
                key={action.key}
                className="items-center gap-2 w-[74px]"
                onPress={() => handleQuickActionPress(action)}
                accessibilityRole="button"
                accessibilityLabel={'labelKey' in action ? t(action.labelKey) : action.label}
              >
                <View className={['w-8 h-8 rounded-2xl items-center justify-center', action.iconBg].join(' ')}>
                  {renderQuickActionIcon(action.key)}
                </View>
                <Text className="text-c2 font-semibold font-sans text-grey-900 text-center">
                  {'labelKey' in action ? t(action.labelKey) : action.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Patients in Queue ── */}
        <View className="gap-4">
          <Text className="text-s2 font-semibold font-sans text-grey-900">
            {t('doctorHome.patientsInQueue')}
          </Text>

          {hasQueue ? (
            patientsQueue.map((patient: PatientInQueue) => (
              <PatientQueueCard
                key={patient.id}
                patient={patient}
                onJoinCall={handleJoinCall}
                onViewAiSummary={handleViewAiSummary}
                testID={`queue-card-${patient.id}`}
              />
            ))
          ) : (
            <View className="items-center py-14 px-6 gap-2">
              <Text className="text-h4 font-semibold font-sans text-grey-900 text-center">
                {t('doctorHome.emptyQueueTitle')}
              </Text>
              <Text className="text-b1 font-sans text-grey-500 text-center">
                {t('doctorHome.emptyQueueSubtitle')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Nura AI FAB ── */}
      <View className="absolute bottom-20 right-4">
        <Pressable
          className="bg-primary-500 border-4 border-primary-100 rounded-full flex-row items-center gap-2 px-4 py-3 shadow-800 min-w-[185px]"
          onPress={() => router.push('/(doctor)/nura-ai')}
          accessibilityRole="button"
          accessibilityLabel={t('doctorHome.nuraAI')}
        >
          <Image
            source={{ uri: FIGMA_NURA_AI_ICON }}
            style={{ width: 24, height: 24, transform: [{ scaleX: -1 }] }}
            contentFit="contain"
          />
          <Text className="text-btn-medium font-semibold font-sans text-white">
            {t('doctorHome.nuraAI')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
