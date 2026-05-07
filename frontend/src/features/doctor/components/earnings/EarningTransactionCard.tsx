import { Pressable, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import { Badge } from '@shared/components/ui/Badge';
import type { DoctorEarningTransaction } from '../../types/doctorEarnings.types';

export interface EarningTransactionCardProps {
  transaction: DoctorEarningTransaction;
  onPress?: () => void;
}

function getStatusBadgeStatus(status: DoctorEarningTransaction['status']) {
  if (status === 'paid') return 'success';
  if (status === 'pending') return 'warning';
  return 'info';
}

function getStatusLabel(status: DoctorEarningTransaction['status']) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getSourceIcon(source: DoctorEarningTransaction['source']) {
  if (source === 'insurance') {
    return <Ionicons name="shield-checkmark" size={20} color={primitiveColors['yellow-500']} />;
  }

  return <MaterialCommunityIcons name="hand-heart" size={20} color={primitiveColors['primary-500']} />;
}

export function EarningTransactionCard({
  transaction,
  onPress,
}: EarningTransactionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white border border-grey-300 rounded-lg p-4"
      accessibilityRole="button"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1">
          <View className="size-10 rounded-lg bg-grey-50 items-center justify-center">
            {getSourceIcon(transaction.source)}
          </View>
          <View className="flex-1 gap-1">
            <Text className="text-b4 font-medium font-sans text-grey-900">
              {transaction.patientName}
            </Text>
            <Text className="text-c1 font-sans text-grey-500">
              {transaction.description}
            </Text>
          </View>
        </View>
        <View className="items-end gap-3">
          <Text className="text-b4 font-medium font-sans text-grey-900">
            ${transaction.amount}
          </Text>
          <Badge
            label={getStatusLabel(transaction.status)}
            status={getStatusBadgeStatus(transaction.status)}
            variant="outline"
            size="tiny"
          />
        </View>
      </View>
    </Pressable>
  );
}
