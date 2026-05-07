import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import type { KeyboardTypeOptions } from 'react-native';

export interface ProfileDetailEditModalProps {
  visible: boolean;
  title: string;
  value: string;
  saveLabel: string;
  closeLabel: string;
  editLabel: string;
  keyboardType?: KeyboardTypeOptions;
  isEditing: boolean;
  isSaving: boolean;
  error?: string;
  inputRef: React.RefObject<TextInput | null>;
  onChangeValue: (value: string) => void;
  onEnableEditing: () => void;
  onClose: () => void;
  onSave: () => void;
}

export function ProfileDetailEditModal({
  visible,
  title,
  value,
  saveLabel,
  closeLabel,
  editLabel,
  keyboardType,
  isEditing,
  isSaving,
  error,
  inputRef,
  onChangeValue,
  onEnableEditing,
  onClose,
  onSave,
}: ProfileDetailEditModalProps) {
  const pencilIcon = (
    <Ionicons
      name="create-outline"
      size={18}
      color={primitiveColors['grey-400']}
      accessibilityLabel={editLabel}
    />
  );

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View className="flex-1 bg-black/10 items-center justify-center px-4">
        <View className="w-full max-w-[369px] rounded-2xl bg-white px-8 pt-5 pb-8">
          <View className="items-end mb-6">
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel={closeLabel}>
              <Ionicons name="close" size={20} color={primitiveColors['grey-400']} />
            </Pressable>
          </View>

          <View className="gap-4">
            <Text className="text-h5 font-semibold font-sans text-grey-900">{title}</Text>

            <Input
              value={value}
              onChangeText={onChangeValue}
              editable={isEditing && !isSaving}
              inputRef={inputRef}
              iconRight={pencilIcon}
              onIconRightPress={onEnableEditing}
              keyboardType={keyboardType}
              status={error ? 'error' : 'default'}
              helperText={error}
              autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
            />
          </View>

          <View className="mt-14">
            <Button
              label={saveLabel}
              onPress={onSave}
              disabled={isSaving}
              size="large"
              fullWidth
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
