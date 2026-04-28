import React from 'react';
import { View } from 'react-native';

export interface PaginationDotsProps {
  count: number;
  activeIndex: number;
  variant?: 'pill' | 'dot';
}

const DOT_CLASS: Record<'pill' | 'dot', Record<'active' | 'inactive', string>> = {
  pill: {
    active: 'h-2 w-6 rounded-full bg-primary-500',
    inactive: 'h-2 w-2 rounded-full bg-primary-50',
  },
  dot: {
    active: 'h-2 w-2 rounded-full bg-primary-500',
    inactive: 'h-2 w-2 rounded-full bg-primary-100',
  },
};

export function PaginationDots({ count, activeIndex, variant = 'pill' }: PaginationDotsProps) {
  return (
    <View className="flex-row gap-2 items-center justify-center">
      {Array.from({ length: count }, (_, i) => (
        <View
          key={`pagination-dot-${i}`}
          className={DOT_CLASS[variant][i === activeIndex ? 'active' : 'inactive']}
        />
      ))}
    </View>
  );
}
