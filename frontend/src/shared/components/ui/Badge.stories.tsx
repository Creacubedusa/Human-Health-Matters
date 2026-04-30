import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Badge, type BadgeSize, type BadgeStatus, type BadgeVariant } from './Badge';

const StarIcon = ({ color }: { color?: string }) => (
  <Text style={{ color: color ?? '#fff', fontSize: 14, lineHeight: 18 }}>★</Text>
);
const CloseIcon = ({ color }: { color?: string }) => (
  <Text style={{ color: color ?? '#fff', fontSize: 12, lineHeight: 16 }}>✕</Text>
);

const ACCENT_HEX: Record<BadgeStatus, string> = {
  default: '#4E61F6',
  success: '#43B75D',
  info:    '#0095FF',
  warning: '#FFAA00',
  error:   '#EE443F',
};

const meta: Meta<typeof Badge> = {
  title: 'Shared/UI/Badge',
  component: Badge,
  args: { label: 'Badge', status: 'default', variant: 'filled', size: 'medium' },
  decorators: [
    (Story) => (
      <ScrollView contentContainerClassName="p-6 gap-6 bg-bg-default">
        <Story />
      </ScrollView>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ── Variants ───────────────────────────────────────────────────────────────

export const VariantFilled: Story = {
  name: 'Variant / Filled',
  args: { variant: 'filled' },
  render: (args) => (
    <Badge {...args} iconLeft={<StarIcon />} iconRight={<CloseIcon />} />
  ),
};

export const VariantOutline: Story = {
  name: 'Variant / Outline',
  args: { variant: 'outline' },
  render: (args) => (
    <Badge
      {...args}
      iconLeft={<StarIcon color={ACCENT_HEX[args.status ?? 'default']} />}
      iconRight={<CloseIcon color={ACCENT_HEX[args.status ?? 'default']} />}
    />
  ),
};

// ── Sizes ──────────────────────────────────────────────────────────────────

export const SizeMedium: Story = {
  name: 'Size / Medium',
  args: { size: 'medium' },
  render: (args) => (
    <Badge {...args} iconLeft={<StarIcon />} iconRight={<CloseIcon />} />
  ),
};

export const SizeSmall: Story = {
  name: 'Size / Small',
  args: { size: 'small' },
  render: (args) => (
    <Badge {...args} iconLeft={<StarIcon />} iconRight={<CloseIcon />} />
  ),
};

export const SizeTiny: Story = {
  name: 'Size / Tiny',
  args: { size: 'tiny' },
  render: (args) => (
    <Badge {...args} iconLeft={<StarIcon />} iconRight={<CloseIcon />} />
  ),
};

// ── Status states ──────────────────────────────────────────────────────────

export const StatusDefault: Story = {
  name: 'Status / Default',
  args: { status: 'default' },
  render: (args) => (
    <View className="flex-row gap-3 flex-wrap items-center">
      <Badge {...args} variant="filled" iconLeft={<StarIcon />} iconRight={<CloseIcon />} />
      <Badge {...args} variant="outline" iconLeft={<StarIcon color={ACCENT_HEX.default} />} iconRight={<CloseIcon color={ACCENT_HEX.default} />} />
    </View>
  ),
};

export const StatusSuccess: Story = {
  name: 'Status / Success',
  args: { status: 'success' },
  render: (args) => (
    <View className="flex-row gap-3 flex-wrap items-center">
      <Badge {...args} variant="filled" iconLeft={<StarIcon />} iconRight={<CloseIcon />} />
      <Badge {...args} variant="outline" iconLeft={<StarIcon color={ACCENT_HEX.success} />} iconRight={<CloseIcon color={ACCENT_HEX.success} />} />
    </View>
  ),
};

export const StatusInfo: Story = {
  name: 'Status / Info',
  args: { status: 'info' },
  render: (args) => (
    <View className="flex-row gap-3 flex-wrap items-center">
      <Badge {...args} variant="filled" iconLeft={<StarIcon />} iconRight={<CloseIcon />} />
      <Badge {...args} variant="outline" iconLeft={<StarIcon color={ACCENT_HEX.info} />} iconRight={<CloseIcon color={ACCENT_HEX.info} />} />
    </View>
  ),
};

export const StatusWarning: Story = {
  name: 'Status / Warning',
  args: { status: 'warning' },
  render: (args) => (
    <View className="flex-row gap-3 flex-wrap items-center">
      <Badge {...args} variant="filled" iconLeft={<StarIcon />} iconRight={<CloseIcon />} />
      <Badge {...args} variant="outline" iconLeft={<StarIcon color={ACCENT_HEX.warning} />} iconRight={<CloseIcon color={ACCENT_HEX.warning} />} />
    </View>
  ),
};

export const StatusError: Story = {
  name: 'Status / Error',
  args: { status: 'error' },
  render: (args) => (
    <View className="flex-row gap-3 flex-wrap items-center">
      <Badge {...args} variant="filled" iconLeft={<StarIcon />} iconRight={<CloseIcon />} />
      <Badge {...args} variant="outline" iconLeft={<StarIcon color={ACCENT_HEX.error} />} iconRight={<CloseIcon color={ACCENT_HEX.error} />} />
    </View>
  ),
};

// ── Icon only ──────────────────────────────────────────────────────────────

export const IconOnlyFilled: Story = {
  name: 'Content / Icon Only (Filled)',
  render: (args) => (
    <View className="flex-row gap-3 flex-wrap items-center">
      {(['medium', 'small', 'tiny'] as BadgeSize[]).map((size) => (
        <Badge key={size} {...args} variant="filled" size={size} label={undefined} iconLeft={<StarIcon />} />
      ))}
    </View>
  ),
};

export const IconOnlyOutline: Story = {
  name: 'Content / Icon Only (Outline)',
  render: (args) => (
    <View className="flex-row gap-3 flex-wrap items-center">
      {(['medium', 'small', 'tiny'] as BadgeSize[]).map((size) => (
        <Badge
          key={size}
          {...args}
          variant="outline"
          size={size}
          label={undefined}
          iconLeft={<StarIcon color={ACCENT_HEX[args.status ?? 'default']} />}
        />
      ))}
    </View>
  ),
};

// ── Slot combinations ──────────────────────────────────────────────────────

export const WithLeftIconOnly: Story = {
  name: 'Slots / Left Icon Only',
  render: (args) => (
    <Badge {...args} iconLeft={<StarIcon />} iconRight={undefined} />
  ),
};

export const WithRightIconOnly: Story = {
  name: 'Slots / Right Icon Only',
  render: (args) => (
    <Badge {...args} iconLeft={undefined} iconRight={<CloseIcon />} />
  ),
};

export const LabelOnly: Story = {
  name: 'Slots / Label Only (no icons)',
  render: (args) => <Badge {...args} />,
};

// ── Edge Cases ─────────────────────────────────────────────────────────────

export const LongLabel: Story = {
  name: 'Edge Cases / Long Label (truncates at 1 line)',
  args: { label: 'This badge label is intentionally very long and should truncate' },
  render: (args) => (
    <View className="gap-3">
      {(['medium', 'small', 'tiny'] as BadgeSize[]).map((size) => (
        <Badge key={size} {...args} size={size} iconLeft={<StarIcon />} />
      ))}
    </View>
  ),
};

// ── Overview ───────────────────────────────────────────────────────────────

export const Overview: Story = {
  name: 'Overview / All Statuses × Variants',
  render: () => {
    const statuses: BadgeStatus[] = ['default', 'success', 'info', 'warning', 'error'];
    const variants: BadgeVariant[] = ['filled', 'outline'];

    return (
      <View className="gap-8">
        {variants.map((variant) => (
          <View key={variant} className="gap-4">
            <Text className="text-b2 text-text-primary font-semibold capitalize">{variant}</Text>
            {statuses.map((status) => (
              <View key={status} className="gap-2">
                <Text className="text-b3 text-text-secondary capitalize">{status}</Text>
                <View className="flex-row gap-2 flex-wrap items-center">
                  {(['medium', 'small', 'tiny'] as BadgeSize[]).map((size) => (
                    <Badge
                      key={size}
                      label="Badge"
                      status={status}
                      variant={variant}
                      size={size}
                      iconLeft={<StarIcon color={variant === 'filled' ? '#fff' : ACCENT_HEX[status]} />}
                      iconRight={<CloseIcon color={variant === 'filled' ? '#fff' : ACCENT_HEX[status]} />}
                    />
                  ))}
                  {(['medium', 'small', 'tiny'] as BadgeSize[]).map((size) => (
                    <Badge
                      key={`icon-${size}`}
                      status={status}
                      variant={variant}
                      size={size}
                      iconLeft={<StarIcon color={variant === 'filled' ? '#fff' : ACCENT_HEX[status]} />}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  },
};
