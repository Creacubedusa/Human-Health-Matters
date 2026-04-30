import { useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import type { InputStatus } from './Input';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectInputProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  status?: InputStatus;
  helperText?: string;
  disabled?: boolean;
  testID?: string;
}

const CONTAINER_CLASS: Record<'default' | 'focus' | 'error' | 'disabled', string> = {
  default:  'bg-grey-50 border-grey-200',
  focus:    'bg-primary-50 border-primary-500',
  error:    'bg-red-50 border-red-500',
  disabled: 'bg-grey-50 border-grey-200 opacity-60',
};

const HELPER_CLASS: Record<'default' | 'error', string> = {
  default: 'text-grey-400',
  error:   'text-red-500',
};

export function SelectInput({
  label,
  placeholder = 'Select an option',
  options,
  value,
  onChange,
  status = 'default',
  helperText,
  disabled = false,
  testID,
}: SelectInputProps) {
  const [visible, setVisible] = useState(false);

  const selectedOption = options.find((o) => o.value === value) ?? null;

  const containerState: 'default' | 'focus' | 'error' | 'disabled' =
    disabled          ? 'disabled'
    : status === 'error' ? 'error'
    : visible         ? 'focus'
    : 'default';

  return (
    <View className="w-full gap-2" testID={testID}>
      {label != null && (
        <Text className="text-b2 font-semibold font-sans text-grey-700">{label}</Text>
      )}

      <Pressable
        className={[
          'flex-row items-center justify-between border-2 rounded-md h-12 px-3',
          CONTAINER_CLASS[containerState],
        ].join(' ')}
        onPress={() => !disabled && setVisible(true)}
        accessibilityRole="button"
        disabled={disabled}
      >
        <Text
          className={[
            'flex-1 text-b2 font-sans',
            selectedOption ? 'text-grey-900' : 'text-grey-400',
          ].join(' ')}
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons
          name={visible ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={primitiveColors['grey-600']}
        />
      </Pressable>

      {helperText != null && (
        <Text className={['text-b3 font-sans', HELPER_CLASS[status === 'error' ? 'error' : 'default']].join(' ')}>
          {helperText}
        </Text>
      )}

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setVisible(false)}
          accessible={false}
        >
          <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl pb-8">
            <View className="items-center pt-3 pb-4 border-b border-grey-200">
              <View className="w-10 h-1 rounded-full bg-grey-300 mb-4" />
              {label != null && (
                <Text className="text-s1 font-semibold font-sans text-grey-900">{label}</Text>
              )}
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              style={{ maxHeight: 400 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable
                  className="flex-row items-center gap-3 px-5 py-4 border-b border-grey-100"
                  onPress={() => { onChange(item.value); setVisible(false); }}
                >
                  <Text className="flex-1 text-b1 font-sans text-grey-900">{item.label}</Text>
                  {item.value === value && (
                    <Ionicons name="checkmark" size={18} color={primitiveColors['primary-500']} />
                  )}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
