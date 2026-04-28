import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import type { Notification } from '../types/notification.types';

export interface NotificationItemProps {
  notification: Notification;
  onPress: (id: string) => void;
  onAction: (id: string) => void;
}

// Icon per type — module-level to avoid allocation at render time
const ICON_NAME: Record<Notification['type'], keyof typeof Ionicons.glyphMap> = {
  doctor_joined: 'person-circle',
  ai_report:     'hardware-chip-outline',
  appointment:   'calendar-outline',
  doctor_order:  'receipt-outline',
};

const ICON_BG: Record<Notification['type'], string> = {
  doctor_joined: 'bg-primary-100',
  ai_report:     'bg-primary-100',
  appointment:   'bg-grey-100',
  doctor_order:  'bg-grey-100',
};

const ICON_COLOR: Record<Notification['type'], string> = {
  doctor_joined: primitiveColors['primary-500'],
  ai_report:     primitiveColors['primary-500'],
  appointment:   primitiveColors['grey-600'],
  doctor_order:  primitiveColors['grey-600'],
};

// CTA config per type
const CTA_LABEL_KEY: Partial<Record<Notification['type'], string>> = {
  doctor_joined: 'notifications.ctaJoin',
  ai_report:     'notifications.ctaViewReport',
  doctor_order:  'notifications.ctaCheck',
};

const CTA_VARIANT: Partial<Record<Notification['type'], 'filled' | 'outline'>> = {
  doctor_joined: 'filled',
  ai_report:     'outline',
  doctor_order:  'outline',
};

export function NotificationItem({ notification, onPress, onAction }: NotificationItemProps) {
  const { t } = useTranslation();
  const { id, type, message, timestamp, isRead } = notification;

  const ctaKey = CTA_LABEL_KEY[type];
  const hasCta = ctaKey != null;

  return (
    <Pressable
      onPress={() => onPress(id)}
      accessibilityRole="button"
      accessibilityLabel={message}
      className="w-full"
    >
      {/* Unread indicator dot — absolute left edge */}
      {!isRead && (
        <View className="absolute left-0 top-[12px] w-[8px] h-[8px] rounded-full bg-primary-500 z-10" />
      )}

      {/* Top divider */}
      <View className="h-px w-full bg-grey-200" />

      {/* Cell content */}
      <View className="py-4 gap-2">
        {/* Avatar + message row */}
        <View className="flex-row items-start px-4 gap-4">
          {/* Icon circle */}
          <View
            className={[
              'w-8 h-8 rounded-full items-center justify-center shrink-0',
              ICON_BG[type],
            ].join(' ')}
          >
            <Ionicons name={ICON_NAME[type]} size={18} color={ICON_COLOR[type]} />
          </View>

          {/* Message text */}
          <Text className="flex-1 text-[14px] font-sans text-grey-900 leading-5">
            {message}
          </Text>
        </View>

        {/* CTA row — offset 64px to align with message text */}
        {hasCta && (
          <View className="pl-16">
            <Button
              label={t(ctaKey!)}
              variant={CTA_VARIANT[type]}
              size="small"
              onPress={() => onAction(id)}
            />
          </View>
        )}

        {/* Timestamp row — offset 64px to align with message text */}
        <View className="pl-16">
          <Text className="text-[12px] font-sans text-grey-500 leading-4">
            {timestamp}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
