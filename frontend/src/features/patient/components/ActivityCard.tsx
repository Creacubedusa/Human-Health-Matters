import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import type { Activity } from '../types/patient.types';

interface Props {
  activity: Activity;
  onJoin?: (id: string) => void;
}

type BadgeVariant = 'join' | 'upcoming' | 'completed' | 'emergency' | 'low' | 'moderate' | 'applied';

const BADGE_BG: Record<BadgeVariant, string> = {
  join:      'bg-primary-500',
  upcoming:  'bg-blue-50',
  completed: 'bg-green-50',
  emergency: 'bg-red-50',
  low:       'bg-primary-50',
  moderate:  'bg-yellow-50',
  applied:   'bg-green-50',
};

const BADGE_TEXT: Record<BadgeVariant, string> = {
  join:      'text-white',
  upcoming:  'text-blue-500',
  completed: 'text-green-500',
  emergency: 'text-red-500',
  low:       'text-primary-500',
  moderate:  'text-yellow-500',
  applied:   'text-green-500',
};

// Figma: bg-white, border-grey-300, rounded-lg, h-[90px]
// Left: title (s2) + subtitle (b3 grey-600), max 218px
// Right: date (c3 grey-600) + status badge or Join button
export function ActivityCard({ activity, onJoin }: Props) {
  const { t } = useTranslation();

  let title = '';
  let subtitle = '';
  let badgeVariant: BadgeVariant = 'applied';
  let badgeLabel = '';
  let isJoinButton = false;
  let canJoin = false;
  let activityId = activity.id;

  if (activity.type === 'consultation') {
    title        = activity.title;
    subtitle     = activity.subtitle;
    badgeVariant = activity.status === 'join' ? 'join' : activity.status;
    badgeLabel   = t(`patientHome.${activity.status}`);
    isJoinButton = activity.status === 'join';
    canJoin      = activity.canJoin;
  } else if (activity.type === 'symptomCheck') {
    title        = t('patientHome.symptomCheck');
    subtitle     = activity.symptoms;
    badgeVariant = activity.severity;
    badgeLabel   = t(`patientHome.${activity.severity}`);
  } else {
    title        = t('patientHome.communityFund');
    subtitle     = activity.description;
    badgeVariant = 'applied';
    badgeLabel   = t('patientHome.applied');
  }

  return (
    <View className="bg-white border border-grey-300 rounded-lg overflow-hidden w-full min-h-[90px]">
      <View className="flex-row items-center justify-between px-3 py-4">
        {/* Left */}
        <View className="flex-1 gap-2 pr-3">
          <Text className="text-s2 font-semibold font-sans text-grey-900" numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-b3 font-sans text-grey-600" numberOfLines={2}>
            {subtitle}
          </Text>
        </View>

        {/* Right */}
        <View className="items-end gap-3 w-[86px] shrink-0">
          <Text className="text-c3 font-sans text-grey-600 text-right">{activity.date}</Text>

          {isJoinButton ? (
            <Pressable
              onPress={() => canJoin && onJoin?.(activityId)}
              disabled={!canJoin}
              className={[
                'h-6 w-[78px] items-center justify-center rounded-lg',
                canJoin ? 'bg-primary-500' : 'bg-grey-200',
              ].join(' ')}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canJoin }}
            >
              <Text className={['text-btn-tiny font-sans', canJoin ? 'text-white' : 'text-grey-400'].join(' ')}>
                {badgeLabel}
              </Text>
            </Pressable>
          ) : (
            <View className={['h-6 w-full items-center justify-center rounded-lg px-2', BADGE_BG[badgeVariant]].join(' ')}>
              <Text className={['text-btn-tiny font-sans', BADGE_TEXT[badgeVariant]].join(' ')}>
                {badgeLabel}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
