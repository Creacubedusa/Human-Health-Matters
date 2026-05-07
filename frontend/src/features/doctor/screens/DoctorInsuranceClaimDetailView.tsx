import { ScrollView, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge } from '@shared/components/ui/Badge';
import { ProfileHeader } from '@features/patient/components/profile/ProfileHeader';
import { ReviewCard } from '@shared/components/ui/ReviewCard';
import type { DoctorInsuranceClaimRecord } from '../types/doctor.types';

export interface DoctorInsuranceClaimDetailViewProps {
  claim: DoctorInsuranceClaimRecord | null;
  title: string;
  subtitle: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

const DASH = '—';

function getBadgeStatus(status: DoctorInsuranceClaimRecord['insuranceStatus']) {
  if (status === 'active') return 'success';
  if (status === 'inactive') return 'warning';
  return 'info';
}

function getInsuranceStatusLabel(
  status: DoctorInsuranceClaimRecord['insuranceStatus'] | undefined,
  t: (key: string) => string,
) {
  if (status === 'active') return t('doctorClaims.status.active');
  if (status === 'inactive') return t('doctorClaims.status.inactive');
  return t('doctorClaims.status.inconclusive');
}

export function DoctorInsuranceClaimDetailView({
  claim,
  title,
  subtitle,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
}: DoctorInsuranceClaimDetailViewProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const rows = [
    { label: t('doctorClaims.patientName'), value: claim?.patientName ?? DASH },
    { label: t('doctorClaims.provider'), value: claim?.carrierLabel ?? DASH },
    { label: t('doctorClaims.memberId'), value: claim?.memberId ?? DASH },
    { label: t('doctorClaims.groupNumber'), value: claim?.groupNumber ?? DASH },
    { label: t('doctorClaims.planType'), value: claim?.planType ?? DASH },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ProfileHeader
        title={title}
        backLabel={t('common.back')}
        onBack={() => router.back()}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-10 pb-10 gap-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center gap-3">
          <Badge
            label={getInsuranceStatusLabel(claim?.insuranceStatus, t)}
            status={getBadgeStatus(claim?.insuranceStatus ?? 'inconclusive')}
            variant="outline"
            size="small"
          />

          <Text className="text-h4 font-semibold font-sans text-grey-900 text-center">
            {claim?.patientName ?? t('doctorClaims.unknownPatient')}
          </Text>

          <Text className="text-b3 font-sans text-grey-500 text-center">
            {subtitle}
          </Text>
        </View>

        <ReviewCard title={t('doctorClaims.claimEssentialsTitle')} rows={rows} />

        {(primaryActionLabel || secondaryActionLabel) ? (
          <View className="gap-3">
            {primaryActionLabel && onPrimaryAction ? (
              <Pressable
                onPress={onPrimaryAction}
                className="h-12 items-center justify-center rounded-[12px] bg-primary-500 px-4"
              >
                <Text className="text-[14px] font-semibold font-sans text-white">
                  {primaryActionLabel}
                </Text>
              </Pressable>
            ) : null}

            {secondaryActionLabel && onSecondaryAction ? (
              <Pressable
                onPress={onSecondaryAction}
                className="h-12 items-center justify-center rounded-[12px] border border-grey-300 px-4"
              >
                <Text className="text-[14px] font-semibold font-sans text-grey-900">
                  {secondaryActionLabel}
                </Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
