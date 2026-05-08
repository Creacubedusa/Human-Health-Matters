import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { capitalizeFirst } from '@shared/utils/text';
import type { DoctorPatientListItem } from '../../types/doctor.types';

export interface DoctorPatientCardProps {
  patient: DoctorPatientListItem;
  onViewPatient: (patientId: string) => void;
  showSummary?: boolean;
}

function getAvatarUri(patient: DoctorPatientListItem) {
  return patient.avatarUri ?? `https://i.pravatar.cc/200?u=doctor-patient-list-${patient.id}`;
}

export function DoctorPatientCard({
  patient,
  onViewPatient,
  showSummary = true,
}: DoctorPatientCardProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      className="rounded-2xl border border-grey-200 bg-white p-4"
      onPress={() => onViewPatient(patient.id)}
      accessibilityRole="button"
      accessibilityLabel={patient.name}
    >
      <View className="gap-5">
        <View className="flex-row items-center gap-4">
          <View className="h-12 w-12 overflow-hidden rounded-full bg-primary-100">
            <Image
              source={{ uri: getAvatarUri(patient) }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          </View>

          <View className="flex-1 gap-2">
            <Text className="text-s2 font-semibold font-sans text-grey-900">{patient.name}</Text>
            <Text className="text-c1 font-sans text-grey-500">
              {capitalizeFirst(patient.gender)}
              {'   ·   '}
              {patient.age} {t('doctorPatients.years')}
            </Text>
          </View>
        </View>

        {showSummary ? (
          <View className="flex-row gap-4 rounded-xl bg-blue-50 p-4">
            <Ionicons name="sparkles" size={20} color={primitiveColors['primary-500']} />
            <Text className="flex-1 text-c1 font-sans text-grey-500">{patient.aiSummary.summary}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
