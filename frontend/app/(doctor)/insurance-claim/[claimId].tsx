import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { DoctorInsuranceClaimDetailView } from '@features/doctor/screens/DoctorInsuranceClaimDetailView';
import { useDoctorPatientsStore } from '@features/doctor/store/doctorPatients.store';

export default function DoctorInsuranceClaimDetailScreen() {
  const { t } = useTranslation();
  const { claimId } = useLocalSearchParams<{ claimId: string }>();
  const insuranceClaims = useDoctorPatientsStore((state) => state.insuranceClaims);
  const selectedInsuranceClaimId = useDoctorPatientsStore(
    (state) => state.selectedInsuranceClaimId,
  );

  const claim =
    selectedInsuranceClaimId === claimId
      ? insuranceClaims.find((item) => item.id === selectedInsuranceClaimId) ?? null
      : insuranceClaims.find((item) => item.id === claimId) ?? null;

  return (
    <DoctorInsuranceClaimDetailView
      claim={claim}
      title={t('doctorClaims.title')}
      subtitle={t('doctorClaims.detailSubtitle')}
    />
  );
}
