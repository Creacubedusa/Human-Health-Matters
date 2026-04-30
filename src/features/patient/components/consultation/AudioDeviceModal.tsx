import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import type { AudioRoute } from '../../types/consultation.types';

export interface AudioDeviceModalProps {
  visible: boolean;
  muted: boolean;
  selectedRoute: AudioRoute;
  onSelectRoute: (route: AudioRoute) => void;
  onToggleMute: () => void;
  onClose: () => void;
}

interface RouteOption {
  key: AudioRoute;
  labelKey: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const ROUTE_OPTIONS: RouteOption[] = [
  { key: 'speaker', labelKey: 'consultation.audioSpeaker', icon: 'volume-high-outline' },
  { key: 'audio', labelKey: 'consultation.audioAudio', icon: 'headset-outline' },
  { key: 'earpiece', labelKey: 'consultation.audioEarpiece', icon: 'phone-portrait-outline' },
  { key: 'bluetooth', labelKey: 'consultation.audioBluetooth', icon: 'bluetooth-outline' },
];

const ROW_BG: Record<'selected' | 'default', string> = {
  selected: 'bg-primary-50 border border-primary-500',
  default: 'bg-white border border-grey-200',
};

export function AudioDeviceModal({
  visible,
  muted,
  selectedRoute,
  onSelectRoute,
  onToggleMute,
  onClose,
}: AudioDeviceModalProps) {
  const { t } = useTranslation();

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable
        className="flex-1 bg-black/50 justify-end"
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close audio settings"
      >
        <Pressable onPress={() => {}} accessibilityRole="none">
          <View className="bg-white rounded-t-2xl px-4 pt-4 pb-8">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-s2 text-text-primary font-sans">
                {t('consultation.audioModalTitle')}
              </Text>
              <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close">
                <Ionicons name="close" size={24} color={primitiveColors['grey-600']} />
              </Pressable>
            </View>

            {/* Route options */}
            {ROUTE_OPTIONS.map((option) => {
              const isSelected = selectedRoute === option.key;
              return (
                <Pressable
                  key={option.key}
                  className={`flex-row items-center gap-3 rounded-lg px-4 py-3 mb-2 ${ROW_BG[isSelected ? 'selected' : 'default']}`}
                  onPress={() => onSelectRoute(option.key)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                >
                  <Ionicons
                    name={option.icon}
                    size={20}
                    color={isSelected ? primitiveColors['primary-500'] : primitiveColors['grey-600']}
                  />
                  <Text
                    className={`text-b2 font-sans ${isSelected ? 'text-primary-600' : 'text-text-primary'}`}
                  >
                    {t(option.labelKey)}
                  </Text>
                  {isSelected && (
                    <View className="ml-auto">
                      <Ionicons name="checkmark" size={20} color={primitiveColors['primary-500']} />
                    </View>
                  )}
                </Pressable>
              );
            })}

            {/* Mute toggle */}
            <Pressable
              className="flex-row items-center gap-3 rounded-lg px-4 py-3 bg-grey-50 border border-grey-200 mt-2"
              onPress={onToggleMute}
              accessibilityRole="button"
            >
              <Ionicons
                name={muted ? 'mic-off-outline' : 'mic-outline'}
                size={20}
                color={muted ? primitiveColors['red-500'] : primitiveColors['grey-600']}
              />
              <Text className={`text-b2 font-sans ${muted ? 'text-red-500' : 'text-text-primary'}`}>
                {muted ? t('consultation.unmute') : t('consultation.mute')}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
