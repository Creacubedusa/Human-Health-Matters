import { useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { UploadInput } from '@shared/components/ui/UploadInput';
import { SwipeableFileField } from '@shared/components/ui/SwipeableFileField';

export interface DoctorProfileDocumentModalProps {
  visible: boolean;
  title: string;
  value: string | null;
  emptyLabel: string;
  uploadPlaceholder: string;
  onClose: () => void;
  onSave: (value: string | null) => Promise<void>;
}

function getDraftLabel(value: string | null, fallback: string) {
  if (!value) return fallback;
  if (value.startsWith('file://')) {
    const parts = value.split('/');
    return decodeURIComponent(parts[parts.length - 1] ?? fallback);
  }
  return fallback;
}

export function DoctorProfileDocumentModal({
  visible,
  title,
  value,
  emptyLabel,
  uploadPlaceholder,
  onClose,
  onSave,
}: DoctorProfileDocumentModalProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<string | null>(value);
  const [saving, setSaving] = useState(false);

  const fileLabel = useMemo(() => getDraftLabel(draft, emptyLabel), [draft, emptyLabel]);

  function handleOpen() {
    setDraft(value);
    setSaving(false);
  }

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    try {
      await onSave(draft);
      onClose();
    } finally {
      setSaving(false);
    }
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
        onPress={saving ? undefined : onClose}
        accessibilityRole="button"
        accessibilityLabel={t('common.dismiss')}
      >
        <Pressable
          className="bg-white border border-grey-200 rounded-lg w-full overflow-hidden"
          onPress={() => {}}
        >
          <View className="flex-row items-center justify-end pt-4 px-4">
            <Pressable
              onPress={saving ? undefined : onClose}
              accessibilityRole="button"
              accessibilityLabel={t('common.dismiss')}
              disabled={saving}
            >
              <Ionicons name="close" size={20} color={primitiveColors['grey-400']} />
            </Pressable>
          </View>

          <View className="pt-5 pb-8 px-8 gap-4">
            <Text className="text-s1 font-semibold font-sans text-grey-900">
              {title}
            </Text>

            {draft ? (
              <SwipeableFileField
                label={fileLabel}
                onDelete={() => setDraft(null)}
              />
            ) : null}

            <UploadInput
              value={null}
              onChange={setDraft}
              placeholder={uploadPlaceholder}
              loadingLabel={t('doctorPatients.form.uploading')}
              disabled={saving}
            />

            <Button
              label={saving ? '' : t('doctorProfile.editSaveBtn')}
              variant="filled"
              size="large"
              fullWidth
              disabled={saving}
              onPress={() => {
                void handleSave();
              }}
              iconLeft={saving ? <ActivityIndicator size="small" color="#ffffff" /> : undefined}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
