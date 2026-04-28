import { useRef } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { primitiveColors } from '@design/tokens';
import type { InputStatus } from './Input';

export interface NumericInputProps {
  value: string;
  onChangeText: (v: string) => void;
  unit: string;
  min?: number;
  max?: number;
  status?: InputStatus;
  helperText?: string;
  disabled?: boolean;
  testID?: string;
}

const CONTAINER_CLASS: Record<'default' | 'focus' | 'error' | 'disabled', string> = {
  default:  'border-grey-200',
  focus:    'border-primary-500',
  error:    'border-red-500',
  disabled: 'border-grey-200 opacity-60',
};

const HELPER_CLASS: Record<'default' | 'error', string> = {
  default: 'text-grey-400',
  error:   'text-red-500',
};

export function NumericInput({
  value,
  onChangeText,
  unit,
  min,
  max,
  status = 'default',
  helperText,
  disabled = false,
  testID,
}: NumericInputProps) {
  const inputRef = useRef<TextInput>(null);

  function handleChange(text: string) {
    const cleaned = text.replace(/[^0-9.]/g, '');
    onChangeText(cleaned);
  }

  const containerState: 'default' | 'focus' | 'error' | 'disabled' =
    disabled          ? 'disabled'
    : status === 'error' ? 'error'
    : 'default';

  return (
    <View className="items-center gap-3" testID={testID}>
      <Pressable
        className={[
          'flex-row items-end justify-center gap-2 border-b-2 pb-2 px-6',
          CONTAINER_CLASS[containerState],
        ].join(' ')}
        onPress={() => inputRef.current?.focus()}
        accessible={false}
      >
        <TextInput
          ref={inputRef}
          className="text-h1 font-semibold font-sans text-grey-900 p-0 min-w-[80px] text-center"
          value={value}
          onChangeText={handleChange}
          keyboardType="decimal-pad"
          editable={!disabled}
          placeholder="0"
          placeholderTextColor={primitiveColors['grey-300']}
          testID={testID ? `${testID}-input` : undefined}
        />
        <Text className="text-h4 font-sans text-grey-500 pb-1">{unit}</Text>
      </Pressable>

      {helperText != null && (
        <Text className={['text-b3 font-sans', HELPER_CLASS[status === 'error' ? 'error' : 'default']].join(' ')}>
          {helperText}
        </Text>
      )}
    </View>
  );
}
