import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { capitalizeFirst } from '@shared/utils/text';
import type { PatientInQueue, PatientUrgency } from '../../types/doctor.types';

export interface PatientQueueCardProps {
  patient: PatientInQueue;
  onJoinCall: (patientId: string) => void;
  onViewAiSummary: (patientId: string) => void;
  testID?: string;
}

const URGENCY_BADGE: Record<PatientUrgency, { bg: string; text: string; labelKey: string }> = {
  emergency: {
    bg: 'bg-red-50',
    text: 'text-red-500',
    labelKey: 'doctorHome.urgencyEmergency',
  },
  moderate: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-500',
    labelKey: 'doctorHome.urgencyModerate',
  },
  low: {
    bg: 'bg-green-50',
    text: 'text-green-500',
    labelKey: 'doctorHome.urgencyLow',
  },
};

export function PatientQueueCard({
  patient,
  onJoinCall,
  onViewAiSummary,
  testID,
}: PatientQueueCardProps) {
  const { t } = useTranslation();
  const badge = URGENCY_BADGE[patient.urgency];
  const avatarUri = patient.avatarUri ?? `https://i.pravatar.cc/200?u=doctor-home-queue-${patient.id}`;
  const genderLabel = capitalizeFirst(patient.gender);

  return (
    <View
      className="bg-white border border-grey-200 rounded-2xl p-4 gap-8"
      testID={testID}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${patient.name}, ${genderLabel}, ${patient.age} ${t('doctorHome.yearsOld')}`}
    >
      {/* Patient info row */}
      <View className="gap-5">
        <View className="flex-row items-start justify-between">
          <View className="flex-row items-center gap-4 flex-1 pr-3">
            {/* Avatar */}
            <View className="w-12 h-12 rounded-full overflow-hidden bg-primary-100">
              <Image source={{ uri: avatarUri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
            </View>

            <View className="gap-2 flex-1">
              <Text className="text-s2 font-semibold font-sans text-grey-900">{patient.name}</Text>
              <Text className="text-c1 font-sans text-grey-500">
                {genderLabel}
                {'  ·  '}
                {patient.age} {t('doctorHome.yearsOld')}
              </Text>
            </View>
          </View>

          <View className="items-end gap-2">
            <View className={['h-6 rounded-lg px-2 justify-center', badge.bg].join(' ')}>
              <Text className={['text-[10px] leading-3 font-semibold font-sans', badge.text].join(' ')}>
                {t(badge.labelKey)}
              </Text>
            </View>
            <Text className="text-c1 font-sans text-grey-500 text-right">{patient.timeSlot}</Text>
          </View>
        </View>

        {/* AI Pre-visit Summary box */}
        <View className="bg-blue-50 rounded-md p-4 flex-row gap-4">
          <Ionicons name="sparkles" size={20} color={primitiveColors['primary-500']} />
          <View className="flex-1 gap-1">
            <Text className="text-s2 font-semibold font-sans text-grey-900">
              {t('doctorHome.aiSummaryTitle')}
            </Text>
            <Text className="text-c1 font-sans text-grey-500">{patient.aiSummary}</Text>
          </View>
        </View>

        <View className="flex-row items-end justify-between">
          <Pressable
            onPress={() => onJoinCall(patient.appointmentId ?? patient.id)}
            className="h-8 w-[127px] items-center justify-center rounded-lg bg-primary-500"
            accessibilityRole="button"
            accessibilityLabel={t('doctorHome.joinCall')}
          >
            <Text className="text-c1 font-semibold font-sans text-white">
              {t('doctorHome.joinCall')}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onViewAiSummary(patient.id)}
            className="h-8 w-[127px] items-center justify-center rounded-lg border-[1.5px] border-primary-500 bg-white"
            accessibilityRole="button"
            accessibilityLabel={t('doctorHome.viewAiSummary')}
          >
            <Text className="text-c1 font-semibold font-sans text-primary-500">
              {t('doctorHome.viewAiSummary')}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
