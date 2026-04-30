import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NotificationFilter } from '../types/notification.types';

export interface NotificationTabsProps {
  activeFilter: NotificationFilter;
  onFilterChange: (filter: NotificationFilter) => void;
}

const TABS: { filter: NotificationFilter; labelKey: string }[] = [
  { filter: 'all',    labelKey: 'notifications.filterAll' },
  { filter: 'read',   labelKey: 'notifications.filterRead' },
  { filter: 'unread', labelKey: 'notifications.filterUnread' },
];

export function NotificationTabs({ activeFilter, onFilterChange }: NotificationTabsProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-row items-center justify-between w-full px-4 h-[40px]">
      {TABS.map(({ filter, labelKey }) => {
        const isActive = activeFilter === filter;
        return (
          <Pressable
            key={filter}
            onPress={() => onFilterChange(filter)}
            className={[
              'h-[40px] px-5 rounded-full items-center justify-center',
              isActive ? 'bg-primary-500' : 'bg-primary-50',
            ].join(' ')}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text
              className={[
                'text-[14px] font-semibold font-sans',
                isActive ? 'text-white' : 'text-primary-500',
              ].join(' ')}
            >
              {t(labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
