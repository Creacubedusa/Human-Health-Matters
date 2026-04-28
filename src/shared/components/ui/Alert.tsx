import React from 'react';
import { Pressable, Text, View } from 'react-native';

export type AlertStatus = 'default' | 'success' | 'info' | 'warning' | 'error';
export type AlertVariant = 'filled' | 'outline';

export interface AlertProps {
  status?: AlertStatus;
  variant?: AlertVariant;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  leftButtonLabel?: string;
  rightButtonLabel?: string;
  onLeftButtonPress?: () => void;
  onRightButtonPress?: () => void;
}

// ── Container maps ────────────────────────────────────────────────────────

const CONTAINER_CLASS: Record<AlertVariant, Record<AlertStatus, string>> = {
  filled: {
    default: 'bg-primary-500',
    success: 'bg-green-500',
    info:    'bg-blue-500',
    warning: 'bg-yellow-500',
    error:   'bg-red-500',
  },
  outline: {
    default: 'bg-primary-50 border-2 border-primary-500',
    success: 'bg-green-50 border-2 border-green-500',
    info:    'bg-blue-50 border-2 border-blue-500',
    warning: 'bg-yellow-50 border-2 border-yellow-500',
    error:   'bg-red-50 border-2 border-red-500',
  },
};

// ── Text maps ─────────────────────────────────────────────────────────────

const TITLE_CLASS: Record<AlertVariant, string> = {
  filled:  'font-semibold font-sans text-s2 text-white',
  outline: 'font-semibold font-sans text-s2 text-grey-900',
};

const DESCRIPTION_CLASS: Record<AlertVariant, string> = {
  filled:  'font-sans text-b3 text-white',
  outline: 'font-sans text-b3 text-grey-500',
};

// ── Button text maps ──────────────────────────────────────────────────────
// Filled secondary button uses opacity-60/50/70 for semi-transparent white
// (no design token exists for translucent white text; opacity is the accepted exception)

const LEFT_BTN_CLASS: Record<AlertVariant, string> = {
  filled:  'font-semibold font-sans text-btn-large text-white',
  outline: 'font-semibold font-sans text-btn-large text-primary-500',
};

const LEFT_BTN_PRESSED_CLASS: Record<AlertVariant, string> = {
  filled:  'font-semibold font-sans text-btn-large text-white opacity-70',
  outline: 'font-semibold font-sans text-btn-large text-primary-700',
};

const RIGHT_BTN_CLASS: Record<AlertVariant, string> = {
  filled:  'font-sans text-btn-large text-white opacity-60',
  outline: 'font-sans text-btn-large text-grey-400',
};

const RIGHT_BTN_PRESSED_CLASS: Record<AlertVariant, string> = {
  filled:  'font-sans text-btn-large text-white opacity-50',
  outline: 'font-sans text-btn-large text-grey-500',
};

// ── Component ─────────────────────────────────────────────────────────────

export function Alert({
  status = 'default',
  variant = 'filled',
  title,
  description,
  icon,
  leftButtonLabel,
  rightButtonLabel,
  onLeftButtonPress,
  onRightButtonPress,
}: AlertProps) {
  const hasContent = title != null || description != null;
  const hasButtons = leftButtonLabel != null || rightButtonLabel != null;

  const containerClass = [
    'p-4 gap-4 rounded-md w-full',
    CONTAINER_CLASS[variant][status],
  ].join(' ');

  return (
    <View className={containerClass}>
      <View className="flex-row gap-3">
        {icon != null && (
          <View
            className="items-center justify-center w-6 h-6 shrink-0"
            importantForAccessibility="no-hide-descendants"
          >
            {icon}
          </View>
        )}

        {hasContent && (
          <View className="flex-1 gap-1">
            {title != null && (
              <Text className={TITLE_CLASS[variant]} numberOfLines={2}>
                {title}
              </Text>
            )}
            {description != null && (
              <Text className={DESCRIPTION_CLASS[variant]}>
                {description}
              </Text>
            )}
          </View>
        )}
      </View>

      {hasButtons && (
        <View className="flex-row gap-4">
          {leftButtonLabel != null && (
            <Pressable
              onPress={onLeftButtonPress}
              accessibilityRole="button"
              accessibilityLabel={leftButtonLabel}
            >
              {({ pressed }) => (
                <Text className={pressed ? LEFT_BTN_PRESSED_CLASS[variant] : LEFT_BTN_CLASS[variant]}>
                  {leftButtonLabel}
                </Text>
              )}
            </Pressable>
          )}
          {rightButtonLabel != null && (
            <Pressable
              onPress={onRightButtonPress}
              accessibilityRole="button"
              accessibilityLabel={rightButtonLabel}
            >
              {({ pressed }) => (
                <Text className={pressed ? RIGHT_BTN_PRESSED_CLASS[variant] : RIGHT_BTN_CLASS[variant]}>
                  {rightButtonLabel}
                </Text>
              )}
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}
