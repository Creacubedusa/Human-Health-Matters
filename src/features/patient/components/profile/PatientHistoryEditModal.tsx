import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, Text, View } from 'react-native';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { RadioGroup } from '@shared/components/ui/RadioGroup';
import type { ProfileForm } from '../../types/profile.types';
import { ProfileEditableListModal } from './ProfileEditableListModal';

export interface PatientHistoryEditModalProps {
  visible: boolean;
  title: string;
  closeLabel: string;
  saveLabel: string;
  addMoreLabel: string;
  editLabel: string;
  deleteLabel: string;
  yesLabel: string;
  noLabel: string;
  isRadioCategory: boolean;
  isCategoryEditing: boolean;
  editingRowIndex: number | null;
  rows: string[];
  familyHistoryValue: ProfileForm['familyHistoryDiabetes'];
  validationError?: string;
  isSaving: boolean;
  onClose: () => void;
  onEnableCategoryEditing: () => void;
  onEnableRowEditing: (index: number) => void;
  onChangeRowValue: (index: number, value: string) => void;
  onDeleteRow: (index: number) => void;
  onAddMore: () => void;
  onChangeFamilyHistory: (value: ProfileForm['familyHistoryDiabetes']) => void;
  onSave: () => void;
}

export function PatientHistoryEditModal({
  visible,
  title,
  closeLabel,
  saveLabel,
  addMoreLabel,
  editLabel,
  deleteLabel,
  yesLabel,
  noLabel,
  isRadioCategory,
  isCategoryEditing,
  editingRowIndex,
  rows,
  familyHistoryValue,
  validationError,
  isSaving,
  onClose,
  onEnableCategoryEditing,
  onEnableRowEditing,
  onChangeRowValue,
  onDeleteRow,
  onAddMore,
  onChangeFamilyHistory,
  onSave,
}: PatientHistoryEditModalProps) {
  if (!isRadioCategory) {
    return (
      <ProfileEditableListModal
        visible={visible}
        title={title}
        closeLabel={closeLabel}
        saveLabel={saveLabel}
        addMoreLabel={addMoreLabel}
        editLabel={editLabel}
        deleteLabel={deleteLabel}
        rows={rows}
        editingRowIndex={editingRowIndex}
        validationError={validationError}
        isSaving={isSaving}
        onClose={onClose}
        onEnableRowEditing={onEnableRowEditing}
        onChangeRowValue={onChangeRowValue}
        onDeleteRow={onDeleteRow}
        onAddMore={onAddMore}
        onSave={onSave}
      />
    );
  }

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View className="flex-1 bg-black/10 items-center justify-center px-3">
        <View className="w-full max-w-[369px] rounded-lg border border-grey-200 bg-white">
          <View className="w-full items-end px-4 pt-4">
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel={closeLabel}>
              <Ionicons name="close" size={20} color={primitiveColors['grey-400']} />
            </Pressable>
          </View>

          <View className="w-full px-8 pt-5 pb-8 gap-4">
            <View className="w-full flex-row items-center justify-between">
              <Text className="flex-1 text-s1 font-semibold font-sans text-grey-900">{title}</Text>
              <Pressable
                onPress={onEnableCategoryEditing}
                accessibilityRole="button"
                accessibilityLabel={editLabel}
              >
                <Ionicons name="create-outline" size={18} color={primitiveColors['grey-400']} />
              </Pressable>
            </View>

            <RadioGroup
              options={[
                { label: yesLabel, value: 'yes' },
                { label: noLabel, value: 'no' },
              ]}
              value={familyHistoryValue === 'unknown' ? null : familyHistoryValue}
              onChange={(value) => onChangeFamilyHistory(value as ProfileForm['familyHistoryDiabetes'])}
              disabled={!isCategoryEditing}
            />

            {validationError != null && (
              <Text className="text-b3 font-sans text-red-500">{validationError}</Text>
            )}

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
