import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';

export interface TagInputProps {
  label?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  testID?: string;
}

// Figma Screen 12: label above, bordered container, tags as grey pills with × remove
export function TagInput({ label, values, onChange, placeholder, disabled = false, testID }: TagInputProps) {
  const [draft, setDraft] = useState('');

  function handleSubmit() {
    const trimmed = draft.trim();
    if (!trimmed || values.includes(trimmed)) return;
    onChange([...values, trimmed]);
    setDraft('');
  }

  function handleRemove(tag: string) {
    onChange(values.filter((v) => v !== tag));
  }

  return (
    <View className="gap-3 w-full" testID={testID}>
      {label != null && (
        <Text className="text-b2 font-semibold font-sans text-grey-900">{label}</Text>
      )}

      <View className="bg-white border border-grey-300 rounded-lg min-h-[43px] p-3 flex-row flex-wrap gap-2 items-center">
        {values.map((tag) => (
          <View
            key={tag}
            className="flex-row items-center gap-1 bg-grey-100 rounded px-1.5 py-0.5"
          >
            <Text className="text-s2 font-sans text-grey-600">{tag}</Text>
            {!disabled && (
              <Pressable
                onPress={() => handleRemove(tag)}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${tag}`}
              >
                <Ionicons name="close" size={12} color={primitiveColors['grey-500']} />
              </Pressable>
            )}
          </View>
        ))}

        {!disabled && (
          <TextInput
            className="text-b2 font-sans text-grey-900 p-0 min-w-[80px] flex-1"
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={handleSubmit}
            onBlur={handleSubmit}
            placeholder={values.length === 0 ? placeholder : ''}
            placeholderTextColor={primitiveColors['grey-400']}
            returnKeyType="done"
            blurOnSubmit={false}
          />
        )}
      </View>
    </View>
  );
}
