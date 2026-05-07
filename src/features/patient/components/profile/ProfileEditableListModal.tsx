import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { ProfileEditableRow } from './ProfileEditableRow';

export interface ProfileEditableListModalProps {
  visible: boolean;
  title: string;
  closeLabel: string;
  saveLabel: string;
  addMoreLabel: string;
  editLabel: string;
  deleteLabel: string;
  rows: string[];
  editingRowIndex: number | null;
  validationError?: string;
  isSaving: boolean;
  onClose: () => void;
  onEnableRowEditing: (index: number) => void;
  onChangeRowValue: (index: number, value: string) => void;
  onDeleteRow: (index: number) => void;
  onAddMore: () => void;
  onSave: () => void;
}

export function ProfileEditableListModal({
  visible,
  title,
  closeLabel,
  saveLabel,
  addMoreLabel,
  editLabel,
  deleteLabel,
  rows,
  editingRowIndex,
  validationError,
  isSaving,
  onClose,
  onEnableRowEditing,
  onChangeRowValue,
  onDeleteRow,
  onAddMore,
  onSave,
}: ProfileEditableListModalProps) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/10 px-3">
        <View className="w-full max-w-[369px] rounded-lg border border-grey-200 bg-white">
          <View className="w-full items-end px-4 pt-4">
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel={closeLabel}>
              <Ionicons name="close" size={20} color={primitiveColors['grey-400']} />
            </Pressable>
          </View>

          <View className="w-full gap-4 px-8 pb-8 pt-5">
            <Text className="text-s1 font-semibold font-sans text-grey-900">{title}</Text>

            <View className="gap-7">
              {rows.map((row, index) => (
                <ProfileEditableRow
                  key={`${title}-row-${index}`}
                  value={row}
                  isEditing={editingRowIndex === index}
                  editLabel={editLabel}
                  deleteLabel={deleteLabel}
                  onChangeValue={(value) => onChangeRowValue(index, value)}
                  onEnableEditing={() => onEnableRowEditing(index)}
                  onDelete={() => onDeleteRow(index)}
                />
              ))}
            </View>

            {validationError != null && (
              <Text className="text-b3 font-sans text-red-500">{validationError}</Text>
            )}

            <Pressable
              onPress={onAddMore}
              className="w-full rounded-md border-2 border-grey-200 bg-grey-200 px-3 py-3"
              accessibilityRole="button"
            >
              <Text className="text-b1 font-sans text-grey-900">{addMoreLabel}</Text>
            </Pressable>

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
