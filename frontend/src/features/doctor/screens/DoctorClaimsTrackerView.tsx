import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileHeader } from '@features/patient/components/profile/ProfileHeader';
import { useDoctorPatientsStore } from '../store/doctorPatients.store';
import { InsuranceClaimCard } from '../components/earnings/InsuranceClaimCard';

function getInsuranceStatusLabel(
  status: 'active' | 'inactive' | 'inconclusive',
  t: (key: string) => string,
) {
  if (status === 'active') return t('doctorClaims.status.active');
  if (status === 'inactive') return t('doctorClaims.status.inactive');
  return t('doctorClaims.status.inconclusive');
}

export function DoctorClaimsTrackerView() {
  const { t } = useTranslation();
  const router = useRouter();
  const insuranceClaims = useDoctorPatientsStore((state) => state.insuranceClaims);
  const setSelectedInsuranceClaimId = useDoctorPatientsStore(
    (state) => state.setSelectedInsuranceClaimId,
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ProfileHeader
        title={t('doctorClaims.title')}
        backLabel={t('common.back')}
        onBack={() => router.back()}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-6 pb-10 gap-4"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-b3 font-sans text-grey-500">
          {t('doctorClaims.subtitle')}
        </Text>

        <View className="gap-4">
          {insuranceClaims.length ? (
            insuranceClaims.map((claim) => (
              <InsuranceClaimCard
                key={claim.id}
                claim={claim}
                statusLabel={getInsuranceStatusLabel(claim.insuranceStatus, t)}
                onPress={() => {
                  setSelectedInsuranceClaimId(claim.id);
                  router.push(`/(doctor)/insurance-claim/${claim.id}`);
                }}
              />
            ))
          ) : (
            <View className="rounded-2xl bg-grey-50 px-5 py-6">
              <Text className="text-s2 font-semibold font-sans text-grey-900">
                {t('doctorClaims.emptyTitle')}
              </Text>
              <Text className="mt-2 text-b3 font-sans text-grey-500">
                {t('doctorClaims.emptySubtitle')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
