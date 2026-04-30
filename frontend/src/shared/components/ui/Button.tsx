import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export type ButtonVariant = 'filled' | 'outline' | 'clear';
export type ButtonSize = 'giant' | 'large' | 'medium' | 'small' | 'tiny';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  testID?: string;
}

type InteractiveState = 'default' | 'hover' | 'focus' | 'press' | 'disabled';

// ── Size maps ─────────────────────────────────────────────────────────────

const SIZE_CONTAINER: Record<ButtonSize, string> = {
  giant:  'px-6 py-4 gap-2',
  large:  'px-5 gap-2',
  medium: 'px-4 py-3 gap-1.5',
  small:  'px-3 py-2 gap-1',
  tiny:   'px-2 gap-1',
};

// Vertical padding handled separately for large/tiny to match Figma heights exactly
// giant=56px (py-4=16px + lh24), large=48px (py-3.5=14px + lh20), medium=40px (py-3=12px + lh16)
// small=32px (py-2=8px + lh16), tiny=24px (py-1.5=6px + lh12)
const SIZE_PADDING_Y: Record<ButtonSize, string> = {
  giant:  '',
  large:  'py-3.5',
  medium: '',
  small:  '',
  tiny:   'py-1.5',
};

const SIZE_TEXT: Record<ButtonSize, string> = {
  giant:  'text-btn-giant',
  large:  'text-btn-large',
  medium: 'text-btn-medium',
  small:  'text-btn-small',
  tiny:   'text-btn-tiny',
};

// ── State → className maps (module-level: zero allocation at render time) ─

const CONTAINER_CLASS: Record<ButtonVariant, Record<InteractiveState, string>> = {
  filled: {
    default:  'bg-primary-500',
    hover:    'bg-primary-400',
    focus:    'bg-primary-500',
    press:    'bg-primary-800',
    disabled: 'bg-grey-200',
  },
  outline: {
    default:  'border-2 border-primary-500 bg-transparent',
    hover:    'border-2 border-primary-500 bg-primary-50',
    focus:    'border-2 border-primary-500 bg-transparent',
    press:    'border-2 border-primary-400 bg-primary-50',
    disabled: 'border-2 border-grey-300 bg-transparent',
  },
  clear: {
    default:  'bg-transparent',
    hover:    'bg-primary-50',
    focus:    'bg-primary-50',
    press:    'bg-primary-100',
    disabled: 'bg-transparent',
  },
};

const TEXT_CLASS: Record<ButtonVariant, Record<InteractiveState, string>> = {
  filled: {
    default:  'text-white',
    hover:    'text-white',
    focus:    'text-white',
    press:    'text-white',
    disabled: 'text-grey-400',
  },
  outline: {
    default:  'text-primary-500',
    hover:    'text-primary-500',
    focus:    'text-primary-500',
    press:    'text-primary-400',
    disabled: 'text-grey-400',
  },
  clear: {
    default:  'text-primary-500',
    hover:    'text-primary-500',
    focus:    'text-primary-500',
    press:    'text-primary-400',
    disabled: 'text-grey-400',
  },
};

// ── Component ─────────────────────────────────────────────────────────────

export function Button({
  label,
  onPress,
  variant = 'filled',
  size = 'medium',
  disabled = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  testID,
}: ButtonProps) {
  const [isHovered, setHovered] = useState(false);
  const [isFocused, setFocused] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      testID={testID}
      className={fullWidth ? 'w-full' : 'self-start'}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      {({ pressed }) => {
        const state: InteractiveState = disabled
          ? 'disabled'
          : pressed
          ? 'press'
          : isFocused
          ? 'focus'
          : isHovered
          ? 'hover'
          : 'default';

        const containerClass = [
          'flex-row items-center justify-center rounded-md overflow-hidden',
          SIZE_CONTAINER[size],
          SIZE_PADDING_Y[size],
          CONTAINER_CLASS[variant][state],
        ]
          .filter(Boolean)
          .join(' ');

        const textClass = [
          'font-semibold font-sans',
          SIZE_TEXT[size],
          TEXT_CLASS[variant][state],
        ].join(' ');

        return (
          <View className={containerClass}>
            {iconLeft != null && (
              <View className="items-center justify-center" importantForAccessibility="no-hide-descendants">
                {iconLeft}
              </View>
            )}
            <Text className={textClass} numberOfLines={1}>
              {label}
            </Text>
            {iconRight != null && (
              <View className="items-center justify-center" importantForAccessibility="no-hide-descendants">
                {iconRight}
              </View>
            )}
          </View>
        );
      }}
    </Pressable>
  );
}
