import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert } from '@shared/components/ui/Alert';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { primitiveColors } from '@design/tokens';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';
import { useDoctorPatientProfile } from '../hooks/useDoctorPatientProfile';
import type { DoctorPatientProfile } from '../types/doctor.types';
import type { DoctorRecordDetailId } from './DoctorPatientRecordDetailView';

export interface DoctorPatientProfileViewProps {
  patientId: string;
}

function getAvatarUri(patient: DoctorPatientProfile) {
  return patient.avatarUri ?? `https://i.pravatar.cc/200?u=doctor-patient-${patient.id}`;
}

function StatColumn({ label, value, bordered = true }: { label: string; value: string; bordered?: boolean }) {
  return (
    <View className={['w-[76px] items-center px-2', bordered ? 'border-r border-[#D2D5DB]' : ''].join(' ')}>
      <Text className="text-c1 font-sans text-grey-500">{label}</Text>
      <Text className="mt-1 text-s2 font-semibold font-sans text-[#814EFF]">{value}</Text>
    </View>
  );
}

function PersonalDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="px-2 py-[9px] gap-1">
      <Text className="text-[14px] leading-5 font-medium font-sans text-grey-900">{label}</Text>
      <Text className="text-c1 font-sans text-grey-500">{value}</Text>
    </View>
  );
}

function MedicalRecordLinkRow({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between py-[7px]"
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text className="text-[14px] leading-5 font-sans text-grey-900">{label}</Text>
      <Feather name="chevron-right" size={18} color={primitiveColors['grey-900']} />
    </Pressable>
  );
}

export function DoctorPatientProfileView({ patientId }: DoctorPatientProfileViewProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { patient, successKey, clearSuccess } = useDoctorPatientProfile(patientId);

  const medicalRecordRows: Array<{ id: DoctorRecordDetailId; label: string }> = [
    { id: 'patient-history', label: t('doctorPatients.patientHistoryTitle') },
    { id: 'medication',      label: t('doctorPatients.medicationTitle') },
    { id: 'order',           label: t('doctorPatients.orderTitle') },
    { id: 'tests',           label: t('doctorPatients.testsTitle') },
    { id: 'prescription',    label: t('doctorPatients.prescriptionTitle') },
    { id: 'medical-reports', label: t('doctorPatients.reportsTitle') },
  ];

  if (!patient) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="bg-primary-50 px-4 pb-4 pt-2">
          <View className="flex-row items-center justify-between h-[29px]">
            <HeaderBackButton
              onPress={() => goBackOrReplace(router, '/(doctor)/patients')}
              accessibilityLabel={t('common.back')}
            />
            <Text className="text-s2 font-semibold font-sans text-grey-900 absolute left-0 right-0 text-center pointer-events-none">
              Profile
            </Text>
            <View className="w-[29px]" />
          </View>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-s2 font-semibold font-sans text-grey-900 text-center">
            {t('doctorPatients.patientNotFound')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const profileSubtitle = patient.gender;
  const ageLabel = `${patient.age} ${t('doctorPatients.years')}`;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-primary-50 px-4 pb-4 pt-2">
        <View className="flex-row items-center justify-between h-[29px]">
          <HeaderBackButton
            onPress={() => goBackOrReplace(router, '/(doctor)/patients')}
            accessibilityLabel={t('common.back')}
          />
          <Text className="text-s2 font-semibold font-sans text-grey-900 absolute left-0 right-0 text-center pointer-events-none">
            Profile
          </Text>
          <View className="w-[29px]" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-[42px] pb-24 gap-5"
        showsVerticalScrollIndicator={false}
      >
        {successKey ? (
          <Alert
            status="success"
            variant="outline"
            description={t(successKey)}
            leftButtonLabel={t('common.dismiss')}
            onLeftButtonPress={clearSuccess}
          />
        ) : null}

        <View className="items-center gap-6">
          <View className="h-[100px] w-[100px] rounded-full border border-[#814EFF] bg-[#F3E8FF] p-[1px] overflow-hidden">
            <Image
              source={{ uri: getAvatarUri(patient) }}
              style={{ width: '100%', height: '100%', borderRadius: 999 }}
              contentFit="cover"
            />
          </View>

          <View className="items-center gap-1">
            <Text className="text-s2 font-semibold font-sans text-grey-900">{patient.name}</Text>
            <Text className="text-c1 font-sans text-grey-500">{profileSubtitle}</Text>
          </View>

          <View className="flex-row items-center justify-center">
            <StatColumn label="Height" value={patient.height} />
            <StatColumn label="Weight" value={patient.weight} />
            <StatColumn label="Age" value={ageLabel} bordered={false} />
          </View>
        </View>

        <View className="rounded-2xl border border-[#EEEEEE] bg-white p-4 gap-2">
          <Text className="text-s2 font-semibold font-sans text-grey-900">Personal details</Text>

          <View>
            <PersonalDetailRow label="Phone number" value={patient.phone} />
            <PersonalDetailRow label="Email address" value={patient.email} />
            <PersonalDetailRow label="Address" value={patient.address} />
            <PersonalDetailRow label="Nationality" value={patient.nationality} />
          </View>
        </View>

        <View className="rounded-2xl border border-[#EEEEEE] bg-white p-4 gap-4">
          <Text className="text-s2 font-semibold font-sans text-grey-900">
            Medical Records and History
          </Text>

          <View className="gap-4">
            {medicalRecordRows.map((row) => (
              <MedicalRecordLinkRow
                key={row.id}
                label={row.label}
                onPress={() =>
                  router.push(`/(doctor)/patients/${patient.id}/records/${row.id}` as never)
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
