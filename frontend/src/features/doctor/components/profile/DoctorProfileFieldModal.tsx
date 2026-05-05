import { useState } from 'react';
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';

export interface DoctorProfileFieldModalProps {
  visible: boolean;
  label: string;
  value: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  onClose: () => void;
  onSave: (value: string) => void;
}

export function DoctorProfileFieldModal({
  visible,
  label,
  value,
  keyboardType,
  maxLength,
  multiline = false,
  numberOfLines,
  onClose,
  onSave,
}: DoctorProfileFieldModalProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(value);

  function handleOpen() {
    setDraft(value);
  }

  function handleSave() {
    onSave(draft.trim());
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onShow={handleOpen}
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 items-center justify-center px-6"
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel={t('common.dismiss')}
      >
        <Pressable
          className="bg-white border border-grey-200 rounded-lg w-full overflow-hidden"
          onPress={() => {}}
        >
          {/* Header */}
          <View className="flex-row items-center justify-end pt-4 px-4">
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel={t('common.dismiss')}>
              <Ionicons name="close" size={20} color={primitiveColors['grey-400']} />
            </Pressable>
          </View>

          {/* Body */}
          <View className="pt-5 pb-8 px-8 gap-8">
            {multiline ? (
              <View className="gap-2 w-full">
                <Text className="text-b4 text-grey-900 font-sans">{label}</Text>
                <View className="gap-2">
                  <View className="bg-grey-50 border-2 border-grey-200 rounded-md min-h-[143px] px-3 py-3 flex-row items-start gap-3">
                    <TextInput
                      value={draft}
                      onChangeText={setDraft}
                      placeholder={t('doctorProfile.biographyLabel')}
                      placeholderTextColor={primitiveColors['grey-400']}
                      multiline
                      numberOfLines={numberOfLines ?? 5}
                      maxLength={maxLength}
                      textAlignVertical="top"
                      className="flex-1 p-0 text-b3 font-sans text-grey-600"
                      style={{ lineHeight: 20 }}
                      accessibilityLabel={label}
                    />
                    <View className="items-center justify-center w-6 h-6 pt-0.5">
                      <Feather name="edit-2" size={18} color={primitiveColors['grey-400']} />
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <Input
                label={label}
                value={draft}
                onChangeText={setDraft}
                keyboardType={keyboardType}
                maxLength={maxLength}
                iconRight={
                  <Feather name="edit-2" size={18} color={primitiveColors['grey-400']} />
                }
              />
            )}
            <Button
              label={t('doctorProfile.editSaveBtn')}
              variant="filled"
              size="large"
              fullWidth
              onPress={handleSave}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
