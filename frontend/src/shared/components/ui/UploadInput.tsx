import { useMemo, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { primitiveColors } from '@design/tokens';
import type { InputStatus } from './Input';

export interface UploadInputProps {
  label?: string;
  placeholder?: string;
  value: string | null;
  onChange: (uri: string) => void;
  status?: InputStatus;
  helperText?: string;
  disabled?: boolean;
  loadingLabel?: string;
  permissionTitle?: string;
  permissionDescription?: string;
  testID?: string;
}

const CONTAINER_CLASS: Record<'default' | 'error' | 'disabled', string> = {
  default: 'bg-grey-50 border-grey-200',
  error: 'bg-red-50 border-red-500',
  disabled: 'bg-grey-50 border-grey-200 opacity-60',
};

const HELPER_CLASS: Record<'default' | 'error', string> = {
  default: 'text-grey-400',
  error: 'text-red-500',
};

function getFileLabel(uri: string | null, placeholder: string) {
  if (!uri) return placeholder;
  const parts = uri.split('/');
  return parts[parts.length - 1] ?? placeholder;
}

export function UploadInput({
  label,
  placeholder = 'Upload',
  value,
  onChange,
  status = 'default',
  helperText,
  disabled = false,
  loadingLabel = 'Uploading...',
  permissionTitle = 'Permission required',
  permissionDescription = 'Please allow access to your photo library.',
  testID,
}: UploadInputProps) {
  const [loading, setLoading] = useState(false);

  const containerState: 'default' | 'error' | 'disabled' = disabled || loading
    ? 'disabled'
    : status === 'error'
      ? 'error'
      : 'default';

  const fileLabel = useMemo(() => getFileLabel(value, placeholder), [placeholder, value]);

  async function handlePress() {
    if (disabled || loading) return;

    const { status: permissionStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionStatus !== 'granted') {
      Alert.alert(permissionTitle, permissionDescription);
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onChange(result.assets[0].uri);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="w-full gap-2" testID={testID}>
      {label != null && (
        <Text className="text-b2 font-medium font-sans text-grey-900">{label}</Text>
      )}

      <Pressable
        onPress={handlePress}
        disabled={disabled || loading}
        className={[
          'flex-row items-center gap-3 rounded-md border-[1.5px] px-3 py-3',
          CONTAINER_CLASS[containerState],
        ].join(' ')}
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
      >
        <Ionicons name="attach-outline" size={24} color={primitiveColors['grey-900']} />
        <Text
          className={[
            'flex-1 text-b1 font-sans',
            value ? 'text-grey-900' : 'text-grey-400',
          ].join(' ')}
          numberOfLines={1}
        >
          {loading ? loadingLabel : fileLabel}
        </Text>
      </Pressable>

      {helperText != null && (
        <Text className={['text-b3 font-sans', HELPER_CLASS[status === 'error' ? 'error' : 'default']].join(' ')}>
          {helperText}
        </Text>
      )}
    </View>
  );
}
