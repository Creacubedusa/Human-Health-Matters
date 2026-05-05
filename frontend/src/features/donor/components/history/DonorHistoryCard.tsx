import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Badge } from '@shared/components/ui/Badge';
import type { DonorHistoryItem, DonorHistoryBrand, DonorHistoryStatus } from '../../types/donorHistory.types';

export interface DonorHistoryCardProps {
  item: DonorHistoryItem;
}

const BRAND_ICON: Record<DonorHistoryBrand, keyof typeof MaterialCommunityIcons.glyphMap> = {
  mastercard: 'credit-card',
  visa:       'credit-card-outline',
};

const STATUS_BADGE: Record<DonorHistoryStatus, { labelKey: string; status: 'success' | 'warning' | 'error' }> = {
  allocated: { labelKey: 'donorHistory.statusAllocated', status: 'success' },
  pending:   { labelKey: 'donorHistory.statusPending',   status: 'warning' },
  failed:    { labelKey: 'donorHistory.statusFailed',    status: 'error'   },
};

export function DonorHistoryCard({ item }: DonorHistoryCardProps) {
  const { t } = useTranslation();
  const badge = STATUS_BADGE[item.status];

  return (
    <View className="bg-white border border-grey-200 rounded-2xl overflow-hidden">
      {/* Top section — amount + date + badge */}
      <View className="flex-row items-start justify-between px-4 pt-4 pb-4">
        <View className="gap-2">
          <Text className="text-h5 font-semibold font-sans text-grey-900">
            {`$${item.amount}`}
          </Text>
          <Text className="text-b4 font-sans text-grey-500">{item.dateTime}</Text>
        </View>
        <Badge
          label={t(badge.labelKey)}
          status={badge.status}
          variant="outline"
          size="tiny"
        />
      </View>

      {/* Divider */}
      <View className="border-t border-grey-300" />

      {/* Bottom section — payment method + transaction ID */}
      <View className="flex-row items-center px-4 py-4 gap-3">
        <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center shrink-0">
          <MaterialCommunityIcons
            name={BRAND_ICON[item.paymentBrand]}
            size={20}
            color={primitiveColors['primary-500']}
          />
        </View>

        <Text className="text-b4 font-sans text-grey-500 flex-1">
          {item.maskedCard}
        </Text>

        <Text className="text-b3 font-medium font-sans text-grey-900 shrink-0">
          {item.transactionId}
        </Text>
      </View>
    </View>
  );
}
