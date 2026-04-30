import { Ionicons } from '@expo/vector-icons';
import { Switch, Text, View } from 'react-native';
import { primitiveColors } from '@design/tokens';
import { ProfileActionRow } from './ProfileActionRow';

interface SettingsSectionProps {
  title: string;
  notificationLabel: string;
  languageLabel: string;
  privacyLabel: string;
  notificationEnabled: boolean;
  onNotificationChange: (enabled: boolean) => void;
  onLanguagePress: () => void;
  onPrivacyPress: () => void;
}

export function SettingsSection({
  title,
  notificationLabel,
  languageLabel,
  privacyLabel,
  notificationEnabled,
  onNotificationChange,
  onLanguagePress,
  onPrivacyPress,
}: SettingsSectionProps) {
  return (
    <View className="bg-white border border-grey-200 rounded-2xl p-4 gap-4 w-full">
      <Text className="text-s2 font-semibold font-sans text-grey-900">{title}</Text>
      <View className="gap-4">
        <ProfileActionRow
          title={notificationLabel}
          iconLeft={<Ionicons name="notifications-outline" size={16} color={primitiveColors['primary-500']} />}
          rightElement={
            <Switch
              value={notificationEnabled}
              onValueChange={onNotificationChange}
              trackColor={{ false: primitiveColors['grey-300'], true: primitiveColors['primary-500'] }}
              thumbColor={primitiveColors.white}
            />
          }
        />
        <ProfileActionRow
          title={languageLabel}
          iconLeft={<Ionicons name="language-outline" size={16} color={primitiveColors['primary-500']} />}
          onPress={onLanguagePress}
        />
        <ProfileActionRow
          title={privacyLabel}
          iconLeft={<Ionicons name="document-lock-outline" size={16} color={primitiveColors['primary-500']} />}
          onPress={onPrivacyPress}
        />
      </View>
    </View>
  );
}
