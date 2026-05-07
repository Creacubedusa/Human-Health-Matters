import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { RadioGroup } from '@shared/components/ui/RadioGroup';

export interface DoctorProfileGenderModalProps {
  visible: boolean;
  value: string;
  onClose: () => void;
  onSave: (value: string) => void;
}

export function DoctorProfileGenderModal({
  visible,
  value,
  onClose,
  onSave,
}: DoctorProfileGenderModalProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(value);

  const options = [
    { value: 'male', label: t('doctorProfile.editGenderMale') },
    { value: 'female', label: t('doctorProfile.editGenderFemale') },
    { value: 'other', label: t('doctorProfile.editGenderOther') },
  ];

  function handleOpen() {
    setDraft(value);
  }

  function handleSave() {
    onSave(draft);
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
            <View className="gap-2">
              <Text className="text-[16px] font-medium font-sans text-grey-900">
                {t('doctorProfile.editGenderLabel')}
              </Text>
              <RadioGroup
                options={options}
                value={draft}
                onChange={setDraft}
              />
            </View>
            <Button
              label={t('doctorProfile.editSaveBtn')}
              variant="filled"
              size="large"
              fullWidth
              disabled={!draft}
              onPress={handleSave}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
