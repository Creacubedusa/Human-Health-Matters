import { useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { primitiveColors } from '@design/tokens';

export type CodeInputStatus = 'default' | 'error';

export interface CodeInputProps {
  length?: number;
  value: string;
  onChangeText: (value: string) => void;
  status?: CodeInputStatus;
  disabled?: boolean;
  testID?: string;
}

// ── State lookup tables (static strings so NativeWind detects them at build time)

const CELL_BG: Record<'empty' | 'filled' | 'focused' | 'error', string> = {
  empty:   'bg-grey-50',
  filled:  'bg-grey-100',
  focused: 'bg-grey-50',
  error:   'bg-red-50',
};

const CELL_BORDER: Record<'empty' | 'filled' | 'focused' | 'error', string> = {
  empty:   'border-grey-300',
  filled:  'border-grey-300',
  focused: 'border-primary-500',
  error:   'border-red-500',
};

const PLACEHOLDER_COLOR = primitiveColors['grey-400'];

export function CodeInput({
  length = 6,
  value,
  onChangeText,
  status = 'default',
  disabled = false,
  testID,
}: CodeInputProps) {
  const inputRefs = useRef<Array<TextInput | null>>(Array(length).fill(null));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Build exactly `length` single-char elements (padEnd with '' is a JS no-op)
  const chars = Array.from({ length }, (_, i) => value[i] ?? '');

  function cellState(index: number): 'empty' | 'filled' | 'focused' | 'error' {
    if (status === 'error') return 'error';
    if (focusedIndex === index) return 'focused';
    if (chars[index] !== '') return 'filled';
    return 'empty';
  }

  function handleChange(index: number, text: string) {
    const digits = text.replace(/\D/g, '');

    // Paste scenario: distribute digits starting from current index
    if (digits.length > 1) {
      const newChars = [...chars];
      digits.slice(0, length - index).split('').forEach((d, i) => {
        newChars[index + i] = d;
      });
      onChangeText(newChars.join(''));
      const nextFocus = Math.min(index + digits.length, length - 1);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const digit = digits.slice(0, 1);
    const newChars = [...chars];
    newChars[index] = digit;
    onChangeText(newChars.join(''));
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(index: number, key: string) {
    if (key !== 'Backspace') return;
    if (chars[index] !== '') {
      const newChars = [...chars];
      newChars[index] = '';
      onChangeText(newChars.join(''));
    } else if (index > 0) {
      const newChars = [...chars];
      newChars[index - 1] = '';
      onChangeText(newChars.join(''));
      inputRefs.current[index - 1]?.focus();
    }
  }

  return (
    <View className="flex-row gap-4" testID={testID}>
      {chars.map((char, index) => {
        const state = cellState(index);
        const containerClass = [
          'w-10 h-10 rounded-full border items-center justify-center',
          CELL_BG[state],
          CELL_BORDER[state],
        ].join(' ');

        return (
          <View key={index} className={containerClass}>
            <TextInput
              ref={(el) => { inputRefs.current[index] = el; }}
              value={char}
              onChangeText={(text) => handleChange(index, text)}
              onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(index, key)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              maxLength={6}
              keyboardType="number-pad"
              textAlign="center"
              selectTextOnFocus
              caretHidden={char !== ''}
              editable={!disabled}
              className="text-b1 text-grey-900 font-sans w-full h-full p-0"
              placeholderTextColor={PLACEHOLDER_COLOR}
              accessibilityLabel={`Digit ${index + 1} of ${length}`}
            />
          </View>
        );
      })}
    </View>
  );
}
