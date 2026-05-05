import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { DoctorAIPatient, DoctorPatientUrgency } from '../../types/doctorNuraAI.types';

export interface DoctorPatientAICardProps {
  patient: DoctorAIPatient;
  onChat: (patient: DoctorAIPatient) => void;
  onViewPatient: (patient: DoctorAIPatient) => void;
  testID?: string;
}

const URGENCY_BADGE: Record<DoctorPatientUrgency, { bg: string; text: string; labelKey: string }> =
  {
    emergency: {
      bg: 'bg-red-50',
      text: 'text-red-500',
      labelKey: 'doctorNuraAI.urgencyEmergency',
    },
    moderate: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-500',
      labelKey: 'doctorNuraAI.urgencyModerate',
    },
    low: {
      bg: 'bg-green-50',
      text: 'text-green-500',
      labelKey: 'doctorNuraAI.urgencyLow',
    },
  };

export function DoctorPatientAICard({
  patient,
  onChat,
  onViewPatient,
  testID,
}: DoctorPatientAICardProps) {
  const { t } = useTranslation();
  const badge = URGENCY_BADGE[patient.urgency];

  return (
    <View
      className="bg-white border border-grey-200 rounded-2xl p-4 gap-8"
      testID={testID}
      accessible
      accessibilityRole="summary"
    >
      {/* Patient info */}
      <View className="gap-5">
        <View className="flex-row items-start justify-between">
          <View className="gap-2 flex-1 mr-3">
            <Text className="text-s2 font-semibold font-sans text-grey-900">
              {patient.condition}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-c1 font-sans text-grey-500">
                {t('doctorNuraAI.patientLabel')}
              </Text>
              <Text className="text-c1 font-sans text-grey-500"> {patient.patientName}</Text>
            </View>
          </View>

          <View className="items-end gap-2">
            <View className={['rounded-lg px-2 py-1', badge.bg].join(' ')}>
              <Text className={['text-c3 font-semibold font-sans', badge.text].join(' ')}>
                {t(badge.labelKey)}
              </Text>
            </View>
            <Text className="text-c1 font-sans text-grey-500 text-right">
              {patient.timeSlot}
            </Text>
          </View>
        </View>

        <Text className="text-b4 font-medium font-sans text-grey-900">{patient.aiSummary}</Text>
      </View>

      {/* Action buttons */}
      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={() => onChat(patient)}
          className="bg-primary-500 rounded-lg px-3 py-2 w-[127px] items-center"
          accessibilityRole="button"
          accessibilityLabel={t('doctorNuraAI.chatButton')}
        >
          <Text className="text-btn-small font-semibold font-sans text-white">
            {t('doctorNuraAI.chatButton')}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onViewPatient(patient)}
          className="border border-primary-500 rounded-lg px-3 py-2 w-[127px] items-center"
          accessibilityRole="button"
          accessibilityLabel={t('doctorNuraAI.viewPatientButton')}
        >
          <Text className="text-btn-small font-semibold font-sans text-primary-500">
            {t('doctorNuraAI.viewPatientButton')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
