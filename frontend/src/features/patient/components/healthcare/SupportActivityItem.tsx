import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Badge } from '@shared/components/ui/Badge';
import type { SupportActivity, SupportActivityStatus } from '../../types/profileOverview.types';

export interface SupportActivityItemProps {
  activity: SupportActivity;
}

const STATUS_BADGE_LABEL: Record<SupportActivityStatus, string> = {
  applied: 'healthcareSupport.statusApplied',
  pending: 'healthcareSupport.statusPending',
};

export function SupportActivityItem({ activity }: SupportActivityItemProps) {
  const { t } = useTranslation();

  return (
    <View className="bg-white border border-grey-300 rounded-lg p-4 w-full">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1 pr-2">
          <View className="bg-primary-50 rounded-xl items-center justify-center w-10 h-10">
            <MaterialCommunityIcons
              name="hand-heart-outline"
              size={22}
              color={primitiveColors['primary-500']}
            />
          </View>
          <View className="flex-1 gap-2">
            <Text className="text-b4 font-medium font-sans text-grey-900" numberOfLines={1}>
              {activity.consultationTitle}
            </Text>
            <Text className="text-c1 font-sans text-grey-600">
              {activity.amount}
            </Text>
          </View>
        </View>

        <View className="items-end gap-3">
          <Text className="text-[10px] font-medium font-sans text-grey-600 text-right">
            {activity.date}
          </Text>
          <Badge
            label={t(STATUS_BADGE_LABEL[activity.status])}
            status="info"
            variant="outline"
            size="tiny"
          />
        </View>
      </View>
    </View>
  );
}
