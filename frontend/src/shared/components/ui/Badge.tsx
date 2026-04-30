import React from 'react';
import { Text, View } from 'react-native';

export type BadgeStatus = 'default' | 'success' | 'info' | 'warning' | 'error';
export type BadgeVariant = 'filled' | 'outline';
export type BadgeSize = 'medium' | 'small' | 'tiny';

export interface BadgeProps {
  /** Visible label. Omit to render icon-only (circle) mode. */
  label?: string;
  status?: BadgeStatus;
  variant?: BadgeVariant;
  size?: BadgeSize;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

// ── Color maps ────────────────────────────────────────────────────────────

const FILLED_BG: Record<BadgeStatus, string> = {
  default: 'bg-primary-500',
  success: 'bg-green-500',
  info:    'bg-blue-500',
  warning: 'bg-yellow-500',
  error:   'bg-red-500',
};

// bg + border pre-combined — eliminates two separate tables and template literals
const OUTLINE_CONTAINER: Record<BadgeStatus, string> = {
  default: 'bg-primary-50 border-2 border-primary-500',
  success: 'bg-green-50 border-2 border-green-500',
  info:    'bg-blue-50 border-2 border-blue-500',
  warning: 'bg-yellow-50 border-2 border-yellow-500',
  error:   'bg-red-50 border-2 border-red-500',
};

const ACCENT_TEXT: Record<BadgeStatus, string> = {
  default: 'text-primary-500',
  success: 'text-green-500',
  info:    'text-blue-500',
  warning: 'text-yellow-500',
  error:   'text-red-500',
};

// ── Size maps ─────────────────────────────────────────────────────────────

// Padding + gap pre-combined — heights: medium=40px, small=32px, tiny=24px
const PILL_LAYOUT: Record<BadgeSize, string> = {
  medium: 'px-3 py-3 gap-2',
  small:  'px-2 py-2 gap-1',
  tiny:   'px-2 py-1.5 gap-1',
};

// Fixed square container for icon-only mode (renders as circle via rounded-full)
const ICON_ONLY_SIZE: Record<BadgeSize, string> = {
  medium: 'w-10 h-10',
  small:  'w-8 h-8',
  tiny:   'w-6 h-6',
};

// Icon wrapper classes pre-combined — eliminates repeated template literals in JSX
const ICON_WRAPPER: Record<BadgeSize, string> = {
  medium: 'items-center justify-center w-6 h-6',
  small:  'items-center justify-center w-5 h-5',
  tiny:   'items-center justify-center w-4 h-4',
};

const SIZE_TEXT: Record<BadgeSize, string> = {
  medium: 'text-btn-medium',
  small:  'text-btn-small',
  tiny:   'text-btn-tiny',
};

// ── Component ─────────────────────────────────────────────────────────────

export function Badge({
  label,
  status = 'default',
  variant = 'filled',
  size = 'medium',
  iconLeft,
  iconRight,
}: BadgeProps) {
  const iconOnly = label == null;

  const colorClass  = variant === 'filled' ? FILLED_BG[status] : OUTLINE_CONTAINER[status];
  const layoutClass = iconOnly ? ICON_ONLY_SIZE[size] : PILL_LAYOUT[size];

  const containerClass = [
    'flex-row items-center justify-center overflow-hidden rounded-full',
    colorClass,
    layoutClass,
  ].join(' ');

  if (iconOnly) {
    return (
      <View className={containerClass}>
        <View className={ICON_WRAPPER[size]}>
          {iconLeft ?? iconRight}
        </View>
      </View>
    );
  }

  const textClass = [
    'font-semibold font-sans',
    SIZE_TEXT[size],
    variant === 'filled' ? 'text-white' : ACCENT_TEXT[status],
  ].join(' ');

  return (
    <View className={containerClass}>
      {iconLeft != null && (
        <View className={ICON_WRAPPER[size]}>
          {iconLeft}
        </View>
      )}
      <Text className={textClass} numberOfLines={1}>
        {label}
      </Text>
      {iconRight != null && (
        <View className={ICON_WRAPPER[size]}>
          {iconRight}
        </View>
      )}
    </View>
  );
}
