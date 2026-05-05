import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import type { DoctorNotification } from '../../types/doctorNotification.types';

export interface DoctorNotificationItemProps {
  notification: DoctorNotification;
  onPress: (id: string) => void;
  onAction: (id: string) => void;
}

const ICON_NAME: Record<DoctorNotification['type'], keyof typeof Ionicons.glyphMap> = {
  consultation: 'videocam-outline',
  patient_assigned: 'person-add-outline',
  ai_summary: 'hardware-chip-outline',
  test_result: 'flask-outline',
};

const ICON_BG: Record<DoctorNotification['type'], string> = {
  consultation: 'bg-primary-100',
  patient_assigned: 'bg-primary-100',
  ai_summary: 'bg-primary-100',
  test_result: 'bg-grey-100',
};

const ICON_COLOR: Record<DoctorNotification['type'], string> = {
  consultation: primitiveColors['primary-500'],
  patient_assigned: primitiveColors['primary-500'],
  ai_summary: primitiveColors['primary-500'],
  test_result: primitiveColors['grey-600'],
};

const CTA_LABEL_KEY: Record<DoctorNotification['type'], string> = {
  consultation: 'doctorNotifications.ctaJoin',
  patient_assigned: 'doctorNotifications.ctaViewPatient',
  ai_summary: 'doctorNotifications.ctaReviewSummary',
  test_result: 'doctorNotifications.ctaCheckRecord',
};

const CTA_VARIANT: Record<DoctorNotification['type'], 'filled' | 'outline'> = {
  consultation: 'filled',
  patient_assigned: 'outline',
  ai_summary: 'outline',
  test_result: 'outline',
};

export function DoctorNotificationItem({
  notification,
  onPress,
  onAction,
}: DoctorNotificationItemProps) {
  const { t } = useTranslation();
  const { id, type, message, timestamp, isRead } = notification;

  return (
    <Pressable
      onPress={() => onPress(id)}
      accessibilityRole="button"
      accessibilityLabel={message}
      className="w-full"
    >
      {!isRead && (
        <View className="absolute left-0 top-[12px] z-10 h-[8px] w-[8px] rounded-full bg-primary-500" />
      )}

      <View className="h-px w-full bg-grey-200" />

      <View className="gap-2 py-4">
        <View className="flex-row items-start gap-4 px-4">
          <View
            className={[
              'h-8 w-8 shrink-0 items-center justify-center rounded-full',
              ICON_BG[type],
            ].join(' ')}
          >
            <Ionicons name={ICON_NAME[type]} size={18} color={ICON_COLOR[type]} />
          </View>

          <Text className="flex-1 text-[14px] leading-5 font-sans text-grey-900">{message}</Text>
        </View>

        <View className="pl-16">
          <Button
            label={t(CTA_LABEL_KEY[type])}
            variant={CTA_VARIANT[type]}
            size="small"
            onPress={() => onAction(id)}
          />
        </View>

        <View className="pl-16">
          <Text className="text-[12px] leading-4 font-sans text-grey-500">{timestamp}</Text>
        </View>
      </View>
    </Pressable>
  );
}
