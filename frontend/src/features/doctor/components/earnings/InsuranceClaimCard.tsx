import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import { Badge } from '@shared/components/ui/Badge';
import type { DoctorInsuranceClaimRecord } from '../../types/doctor.types';

export interface InsuranceClaimCardProps {
  claim: DoctorInsuranceClaimRecord;
  onPress?: () => void;
  statusLabel: string;
}

function getBadgeStatus(status: DoctorInsuranceClaimRecord['insuranceStatus']) {
  if (status === 'active') return 'success';
  if (status === 'inactive') return 'warning';
  return 'info';
}

function getIconColor(status: DoctorInsuranceClaimRecord['insuranceStatus']) {
  if (status === 'active') return primitiveColors['green-500'];
  if (status === 'inactive') return primitiveColors['yellow-500'];
  return primitiveColors['primary-500'];
}

export function InsuranceClaimCard({
  claim,
  onPress,
  statusLabel,
}: InsuranceClaimCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-lg border border-grey-300 bg-white p-4"
      accessibilityRole="button"
    >
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1 flex-row items-center gap-3">
          <View className="size-10 items-center justify-center rounded-lg bg-grey-50">
            <Ionicons
              name="shield-checkmark"
              size={20}
              color={getIconColor(claim.insuranceStatus)}
            />
          </View>

          <View className="flex-1 gap-1">
            <Text className="text-b4 font-medium font-sans text-grey-900">
              {claim.patientName}
            </Text>
            <Text className="text-c1 font-sans text-grey-500">
              {claim.carrierLabel} • {claim.planType}
            </Text>
            <Text className="text-c1 font-sans text-grey-500">
              {claim.consultationDate} • {claim.consultationTime}
            </Text>
          </View>
        </View>

        <View className="items-end gap-3">
          <Badge
            label={statusLabel}
            status={getBadgeStatus(claim.insuranceStatus)}
            variant="outline"
            size="tiny"
          />
          <Text className="text-c1 font-medium font-sans text-primary-500">
            {claim.consultationDuration}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
