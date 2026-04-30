import React, { useRef, useState } from 'react';
import { Pressable, Text, TextInput, type TextInputProps, View } from 'react-native';
import { primitiveColors } from '@design/tokens';

export type InputStatus = 'default' | 'success' | 'info' | 'warning' | 'error';
export type InputVariant = 'filled' | 'outline';
export type InputSize = 'large' | 'medium';

type VisualState =
  | 'default'
  | 'filled'
  | 'hover'
  | 'focus'
  | 'disabled'
  | 'success'
  | 'info'
  | 'warning'
  | 'error';

export interface InputProps
  extends Pick<
    TextInputProps,
    | 'keyboardType'
    | 'secureTextEntry'
    | 'autoCapitalize'
    | 'autoCorrect'
    | 'maxLength'
    | 'returnKeyType'
    | 'onSubmitEditing'
    | 'onBlur'
    | 'testID'
  > {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  status?: InputStatus;
  helperText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  size?: InputSize;
  variant?: InputVariant;
  disabled?: boolean;
  editable?: boolean;
  inputRef?: React.RefObject<TextInput | null>;
  onIconRightPress?: () => void;
}

// ── State maps ────────────────────────────────────────────────────────────

const BORDER_CLASS: Record<VisualState, string> = {
  default:  'border-grey-200',
  filled:   'border-grey-200',
  hover:    'border-grey-400',
  focus:    'border-primary-500',
  disabled: 'border-grey-200',
  success:  'border-green-500',
  info:     'border-blue-500',
  warning:  'border-yellow-500',
  error:    'border-red-500',
};

const BG_CLASS: Record<VisualState, string> = {
  default:  'bg-grey-50',
  filled:   'bg-grey-50',
  hover:    'bg-grey-100',
  focus:    'bg-primary-50',
  disabled: 'bg-grey-50',
  success:  'bg-green-50',
  info:     'bg-blue-50',
  warning:  'bg-yellow-50',
  error:    'bg-red-50',
};

const HELPER_CLASS: Record<VisualState, string> = {
  default:  'text-grey-400',
  filled:   'text-grey-400',
  hover:    'text-grey-400',
  focus:    'text-primary-500',
  disabled: 'text-grey-400',
  success:  'text-green-500',
  info:     'text-blue-500',
  warning:  'text-yellow-500',
  error:    'text-red-500',
};

// ── Size maps ─────────────────────────────────────────────────────────────

const SIZE_CONTAINER: Record<InputSize, string> = {
  large:  'p-3 rounded-md',
  medium: 'px-3 py-2 rounded-sm',
};

const SIZE_TEXT_CLASS: Record<InputSize, string> = {
  large:  'text-b1',
  medium: 'text-b3',
};

// CSS variables not supported in this RN prop — raw hex from primitiveColors
const PLACEHOLDER_TEXT_COLOR = primitiveColors['grey-400'];

// ── Helpers ───────────────────────────────────────────────────────────────

function resolveVisualState(
  status: InputStatus,
  disabled: boolean,
  focused: boolean,
  hovered: boolean,
  hasValue: boolean,
): VisualState {
  if (disabled) return 'disabled';
  if (status !== 'default') return status;
  if (focused) return 'focus';
  if (hovered) return 'hover';
  if (hasValue) return 'filled';
  return 'default';
}

// ── Component ─────────────────────────────────────────────────────────────

export function Input({
  label,
  placeholder = 'Placeholder',
  value = '',
  onChangeText,
  status = 'default',
  helperText,
  iconLeft,
  iconRight,
  size = 'large',
  variant = 'filled',
  disabled = false,
  editable = true,
  inputRef: externalInputRef,
  onIconRightPress,
  onBlur: externalOnBlur,
  ...textInputProps
}: InputProps) {
  const internalInputRef = useRef<TextInput>(null);
  const inputRef = externalInputRef ?? internalInputRef;
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const visualState = resolveVisualState(status, disabled, focused, hovered, value.length > 0);

  const containerClass = [
    'flex-row items-center gap-3 border-2',
    SIZE_CONTAINER[size],
    BORDER_CLASS[visualState],
    variant === 'filled' ? BG_CLASS[visualState] : 'bg-transparent',
  ].join(' ');

  const textInputClass = [
    'flex-1 p-0 font-sans',
    SIZE_TEXT_CLASS[size],
    disabled ? 'text-grey-400' : 'text-grey-900',
  ].join(' ');

  return (
    <View className="gap-2 w-full">
      {label != null && (
        <Text className="text-b2 text-grey-900 font-sans">{label}</Text>
      )}

      <Pressable
        className={containerClass}
        onPress={() => {
          if (!disabled && editable) inputRef.current?.focus();
        }}
        onHoverIn={() => {
          if (!disabled) setHovered(true);
        }}
        onHoverOut={() => setHovered(false)}
        disabled={disabled}
        accessible={false}
      >
        {iconLeft != null && (
          <View className="items-center justify-center w-6 h-6" importantForAccessibility="no-hide-descendants">
            {iconLeft}
          </View>
        )}

        <TextInput
          ref={inputRef}
          className={textInputClass}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); externalOnBlur?.(e); }}
          editable={!disabled && editable}
          accessibilityLabel={label}
          {...textInputProps}
        />

        {iconRight != null && (
          onIconRightPress ? (
            <Pressable
              className="items-center justify-center w-6 h-6"
              onPress={onIconRightPress}
              accessibilityRole="button"
            >
              {iconRight}
            </Pressable>
          ) : (
            <View className="items-center justify-center w-6 h-6" importantForAccessibility="no-hide-descendants">
              {iconRight}
            </View>
          )
        )}
      </Pressable>

      {helperText != null && (
        <Text className={['text-b3 font-sans', HELPER_CLASS[visualState]].join(' ')}>
          {helperText}
        </Text>
      )}
    </View>
  );
}
