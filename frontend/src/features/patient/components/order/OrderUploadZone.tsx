import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { primitiveColors } from '@design/tokens';

export interface OrderUploadZonePickedFile {
  uri: string;
  name: string;
  mimeType: string | null;
  sizeBytes: number | null;
  sizeMb: number;
}

export interface OrderUploadZoneProps {
  onSelectFile: (file: OrderUploadZonePickedFile) => void;
  labels: {
    ctaHighlight: string;
    ctaRest: string;
    maxSize: string;
    maxSizeValue: string;
  };
}

export function OrderUploadZone({ onSelectFile, labels }: OrderUploadZoneProps) {
  async function handlePress() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.85,
      allowsEditing: false,
    });
    if (result.canceled || !result.assets?.length) return;
    const asset = result.assets[0];
    const uri = asset.uri;
    const filename = asset.fileName ?? uri.split('/').pop() ?? `lab-result-${Date.now()}.jpg`;
    const sizeBytes = asset.fileSize ?? null;
    const sizeMb = sizeBytes ? Number((sizeBytes / 1024 / 1024).toFixed(2)) : 0;
    onSelectFile({
      uri,
      name: filename,
      mimeType: asset.mimeType ?? 'image/jpeg',
      sizeBytes,
      sizeMb,
    });
  }

  return (
    <Pressable
      onPress={() => void handlePress()}
      className="border border-primary-200 border-dashed rounded-2xl h-[174px] items-center justify-center gap-3"
      accessibilityRole="button"
    >
      {/* Upload icon */}
      <View className="bg-primary-50 rounded-2xl size-12 items-center justify-center">
        <Ionicons name="cloud-upload-outline" size={24} color={primitiveColors['primary-500']} />
      </View>

      {/* CTA text */}
      <Text className="text-b3 font-sans text-grey-500">
        <Text className="text-b3 font-semibold font-sans text-primary-500">{labels.ctaHighlight}</Text>
        {' '}{labels.ctaRest}
      </Text>

      {/* Size note */}
      <Text className="text-c1 font-sans text-grey-500">
        {labels.maxSize}{' '}
        <Text className="text-c1 font-medium font-sans text-grey-900">{labels.maxSizeValue}</Text>
      </Text>
    </Pressable>
  );
}
