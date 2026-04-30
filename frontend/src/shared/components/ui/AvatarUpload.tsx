import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';

export interface AvatarUploadProps {
  uri: string | null;
  onSelect: (uri: string) => void;
  initials?: string;
  disabled?: boolean;
  testID?: string;
}

export function AvatarUpload({ uri, onSelect, initials, disabled = false, testID }: AvatarUploadProps) {
  const [loading, setLoading] = useState(false);

  async function handlePress() {
    if (disabled || loading) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photo library.');
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onSelect(result.assets[0].uri);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      className="items-center gap-2"
      disabled={disabled || loading}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel="Upload profile picture"
    >
      <View className="relative">
        {/* Avatar circle */}
        <View className="w-24 h-24 rounded-full bg-primary-100 items-center justify-center overflow-hidden">
          {uri ? (
            <Image
              source={{ uri }}
              style={{ width: 96, height: 96 }}
              contentFit="cover"
            />
          ) : (
            <Text className="text-h4 font-semibold font-sans text-primary-600">
              {initials ?? '?'}
            </Text>
          )}
        </View>

        {/* Camera badge */}
        <View className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary-500 items-center justify-center border-2 border-white">
          <Ionicons name="camera" size={14} color="#ffffff" />
        </View>
      </View>

      {!uri && (
        <Text className="text-b3 font-sans text-grey-500">
          Tap to upload
        </Text>
      )}
    </Pressable>
  );
}
