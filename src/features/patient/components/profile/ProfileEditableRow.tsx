import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { TextInput } from 'react-native';
import { primitiveColors } from '@design/tokens';
import { Input } from '@shared/components/ui/Input';

export interface ProfileEditableRowProps {
  value: string;
  isEditing: boolean;
  editLabel: string;
  deleteLabel: string;
  onChangeValue: (value: string) => void;
  onEnableEditing: () => void;
  onDelete: () => void;
}

export function ProfileEditableRow({
  value,
  isEditing,
  editLabel,
  deleteLabel,
  onChangeValue,
  onEnableEditing,
  onDelete,
}: ProfileEditableRowProps) {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!isEditing) return;

    const timeoutId = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timeoutId);
  }, [isEditing]);

  const icon = isEditing ? (
    <Ionicons
      name="trash-outline"
      size={20}
      color={primitiveColors['red-500']}
      accessibilityLabel={deleteLabel}
    />
  ) : (
    <Ionicons
      name="create-outline"
      size={18}
      color={primitiveColors['grey-400']}
      accessibilityLabel={editLabel}
    />
  );

  return (
    <Input
      value={value}
      onChangeText={onChangeValue}
      editable={isEditing}
      inputRef={inputRef}
      iconRight={icon}
      onIconRightPress={isEditing ? onDelete : onEnableEditing}
      autoCapitalize="sentences"
    />
  );
}
