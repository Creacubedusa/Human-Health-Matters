import { Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import { Badge } from '@shared/components/ui/Badge';
import type { DoctorEarningTransaction } from '../../types/doctorEarnings.types';

export interface EarningPayoutCardProps {
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

export function EarningPayoutCard({
  transaction,
  onPress,
}: EarningPayoutCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl border border-grey-200 bg-white px-4 py-4"
      accessibilityRole="button"
    >
      <View className="gap-5">
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1 gap-2">
            <Text className="text-h5 font-semibold font-sans text-grey-900">
              {`$${transaction.amount}`}
            </Text>
            <Text className="text-c1 font-sans text-grey-500">
              {transaction.payoutTimestamp}
            </Text>
          </View>

          <Badge
            label={getStatusLabel(transaction.status)}
            status={getStatusBadgeStatus(transaction.status)}
            variant="outline"
            size="tiny"
          />
        </View>

        <View className="border-t border-grey-300 pt-4">
          <View className="flex-row items-center justify-between gap-4">
            <View className="flex-1 flex-row items-center gap-3">
              <View className="size-10 items-center justify-center rounded-[4px] bg-primary-50">
                <MaterialCommunityIcons name="bank-outline" size={20} color={primitiveColors['primary-500']} />
              </View>
              <Text className="flex-1 text-c1 font-sans text-grey-500">
                {transaction.payoutBankMasked}
              </Text>
            </View>

            <Text className="text-btn-medium font-semibold font-sans text-primary-500">
              Receipt
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
