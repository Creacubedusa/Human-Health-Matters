import type { Meta, StoryObj } from '@storybook/react-native';
import { ScrollView, Text, View } from 'react-native';
import { fn } from 'storybook/test';
import { Button } from './Button';

const StarIcon = () => <Text style={{ color: 'inherit', fontSize: 14 }}>★</Text>;
const ArrowIcon = () => <Text style={{ color: 'inherit', fontSize: 12 }}>→</Text>;

const meta: Meta<typeof Button> = {
  title: 'Shared/UI/Button',
  component: Button,
  args: { onPress: fn(), label: 'Button' },
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

// ── Sizes ──────────────────────────────────────────────────────────────────

export const SizeGiant: Story = {
  name: 'Size / Giant',
  args: { size: 'giant', variant: 'filled' },
};

export const SizeLarge: Story = {
  name: 'Size / Large',
  args: { size: 'large', variant: 'filled' },
};

export const SizeMedium: Story = {
  name: 'Size / Medium',
  args: { size: 'medium', variant: 'filled' },
};

export const SizeSmall: Story = {
  name: 'Size / Small',
  args: { size: 'small', variant: 'filled' },
};

export const SizeTiny: Story = {
  name: 'Size / Tiny',
  args: { size: 'tiny', variant: 'filled' },
};

// ── Variants ───────────────────────────────────────────────────────────────

export const VariantFilled: Story = {
  name: 'Variant / Filled',
  args: { variant: 'filled', size: 'large' },
};

export const VariantOutline: Story = {
  name: 'Variant / Outline',
  args: { variant: 'outline', size: 'large' },
};

export const VariantClear: Story = {
  name: 'Variant / Clear',
  args: { variant: 'clear', size: 'large' },
};

// ── States ─────────────────────────────────────────────────────────────────

export const StateDisabledFilled: Story = {
  name: 'State / Disabled (Filled)',
  args: { variant: 'filled', size: 'large', disabled: true },
};

export const StateDisabledOutline: Story = {
  name: 'State / Disabled (Outline)',
  args: { variant: 'outline', size: 'large', disabled: true },
};

export const StateDisabledClear: Story = {
  name: 'State / Disabled (Clear)',
  args: { variant: 'clear', size: 'large', disabled: true },
};

// ── Icons ──────────────────────────────────────────────────────────────────

export const IconsBoth: Story = {
  name: 'Icons / Both',
  args: { variant: 'filled', size: 'large' },
  render: (args) => <Button {...args} iconLeft={<StarIcon />} iconRight={<ArrowIcon />} />,
};

export const IconLeft: Story = {
  name: 'Icons / Left Only',
  args: { variant: 'filled', size: 'large' },
  render: (args) => <Button {...args} iconLeft={<StarIcon />} />,
};

export const IconRight: Story = {
  name: 'Icons / Right Only',
  args: { variant: 'filled', size: 'large' },
  render: (args) => <Button {...args} iconRight={<ArrowIcon />} />,
};

export const IconsOutline: Story = {
  name: 'Icons / Outline with Icons',
  args: { variant: 'outline', size: 'large' },
  render: (args) => <Button {...args} iconLeft={<StarIcon />} iconRight={<ArrowIcon />} />,
};

// ── Layout ─────────────────────────────────────────────────────────────────

export const FullWidth: Story = {
  name: 'Layout / Full Width',
  args: { variant: 'filled', size: 'large', fullWidth: true },
};

// ── Edge Cases ─────────────────────────────────────────────────────────────

export const LongLabel: Story = {
  name: 'Edge Cases / Long Label (truncates at 1 line)',
  args: {
    variant: 'filled',
    size: 'large',
    label: 'This is a very long button label that should be truncated',
  },
};

export const LongLabelFullWidth: Story = {
  name: 'Edge Cases / Long Label Full Width',
  args: {
    variant: 'filled',
    size: 'large',
    fullWidth: true,
    label: 'This is a very long button label on a full-width button that should be truncated',
  },
};

// ── Overview ───────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  name: 'Overview / All Variants & Sizes',
  render: (args) => (
    <View className="gap-8">
      {(['filled', 'outline', 'clear'] as const).map((variant) => (
        <View key={variant} className="gap-3">
          <Text className="text-b3 text-text-secondary font-semibold capitalize">{variant}</Text>
          <View className="flex-row flex-wrap gap-3 items-center">
            {(['giant', 'large', 'medium', 'small', 'tiny'] as const).map((size) => (
              <Button key={size} {...args} variant={variant} size={size} label={size} />
            ))}
          </View>
        </View>
      ))}
    </View>
  ),
};

export const AllVariantsWithIcons: Story = {
  name: 'Overview / All Variants & Sizes (with icons)',
  render: (args) => (
    <View className="gap-8">
      {(['filled', 'outline', 'clear'] as const).map((variant) => (
        <View key={variant} className="gap-3">
          <Text className="text-b3 text-text-secondary font-semibold capitalize">{variant}</Text>
          <View className="flex-row flex-wrap gap-3 items-center">
            {(['giant', 'large', 'medium', 'small', 'tiny'] as const).map((size) => (
              <Button
                key={size}
                {...args}
                variant={variant}
                size={size}
                label={size}
                iconLeft={<StarIcon />}
                iconRight={<ArrowIcon />}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  ),
};

export const AllDisabled: Story = {
  name: 'Overview / All Disabled',
  render: (args) => (
    <View className="gap-8">
      {(['filled', 'outline', 'clear'] as const).map((variant) => (
        <View key={variant} className="gap-3">
          <Text className="text-b3 text-text-secondary font-semibold capitalize">{variant} disabled</Text>
          <View className="flex-row flex-wrap gap-3 items-center">
            {(['giant', 'large', 'medium', 'small', 'tiny'] as const).map((size) => (
              <Button key={size} {...args} variant={variant} size={size} label={size} disabled />
            ))}
          </View>
        </View>
      ))}
    </View>
  ),
};
