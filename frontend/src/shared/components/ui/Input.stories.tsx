import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { fn } from 'storybook/test';
import { Input, type InputStatus } from './Input';

const LeftIcon = () => <Text className="text-grey-400 text-base leading-6">★</Text>;
const RightIcon = () => <Text className="text-grey-400 text-base leading-6">▼</Text>;

const meta: Meta<typeof Input> = {
  title: 'Shared/UI/Input',
  component: Input,
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    helperText: 'Helper Text',
    onChangeText: fn(),
  },
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

// ── Controlled wrapper for interactive stories ─────────────────────────────
function ControlledInput(props: React.ComponentProps<typeof Input>) {
  const [value, setValue] = useState(props.value ?? '');
  return <Input {...props} value={value} onChangeText={setValue} />;
}

// ── Sizes ──────────────────────────────────────────────────────────────────

export const SizeLarge: Story = {
  name: 'Size / Large',
  render: (args) => <ControlledInput {...args} size="large" />,
};

export const SizeMedium: Story = {
  name: 'Size / Medium',
  render: (args) => <ControlledInput {...args} size="medium" />,
};

// ── Variants ───────────────────────────────────────────────────────────────

export const VariantFilled: Story = {
  name: 'Variant / Filled',
  render: (args) => <ControlledInput {...args} variant="filled" />,
};

export const VariantOutline: Story = {
  name: 'Variant / Outline',
  render: (args) => <ControlledInput {...args} variant="outline" />,
};

// ── Status states ──────────────────────────────────────────────────────────

export const StatusDefault: Story = {
  name: 'Status / Default',
  render: (args) => <ControlledInput {...args} status="default" />,
};

export const StatusSuccess: Story = {
  name: 'Status / Success',
  args: { helperText: 'Success Text' },
  render: (args) => <ControlledInput {...args} status="success" />,
};

export const StatusInfo: Story = {
  name: 'Status / Info',
  args: { helperText: 'Info Text' },
  render: (args) => <ControlledInput {...args} status="info" />,
};

export const StatusWarning: Story = {
  name: 'Status / Warning',
  args: { helperText: 'Warning Text' },
  render: (args) => <ControlledInput {...args} status="warning" />,
};

export const StatusError: Story = {
  name: 'Status / Error',
  args: { helperText: 'Error Text' },
  render: (args) => <ControlledInput {...args} status="error" />,
};

// ── Disabled ───────────────────────────────────────────────────────────────

export const Disabled: Story = {
  name: 'State / Disabled',
  args: { disabled: true },
  render: (args) => <ControlledInput {...args} />,
};

// ── With icons ─────────────────────────────────────────────────────────────

export const WithBothIcons: Story = {
  name: 'Icons / Both',
  render: (args) => (
    <ControlledInput {...args} iconLeft={<LeftIcon />} iconRight={<RightIcon />} />
  ),
};

export const WithLeftIcon: Story = {
  name: 'Icons / Left Only',
  render: (args) => <ControlledInput {...args} iconLeft={<LeftIcon />} />,
};

export const WithRightIcon: Story = {
  name: 'Icons / Right Only',
  render: (args) => <ControlledInput {...args} iconRight={<RightIcon />} />,
};

// ── No label / no helper ───────────────────────────────────────────────────

export const NoLabel: Story = {
  name: 'Slots / No Label',
  render: (args) => <ControlledInput {...args} label={undefined} />,
};

export const NoHelperText: Story = {
  name: 'Slots / No Helper Text',
  render: (args) => <ControlledInput {...args} helperText={undefined} />,
};

export const Minimal: Story = {
  name: 'Slots / Minimal (no label, no helper)',
  render: (args) => (
    <ControlledInput {...args} label={undefined} helperText={undefined} />
  ),
};

// ── Overview: all statuses × both sizes ───────────────────────────────────

export const AllStatuses: Story = {
  name: 'Overview / All Statuses',
  render: (args) => {
    const statuses: { status: InputStatus; helper: string }[] = [
      { status: 'default',  helper: 'Helper Text' },
      { status: 'success',  helper: 'Success Text' },
      { status: 'info',     helper: 'Info Text' },
      { status: 'warning',  helper: 'Warning Text' },
      { status: 'error',    helper: 'Error Text' },
    ];
    return (
      <View className="gap-8">
        {(['large', 'medium'] as const).map((size) => (
          <View key={size} className="gap-4">
            <Text className="text-b2 text-text-primary font-semibold capitalize">{size}</Text>
            {statuses.map(({ status, helper }) => (
              <ControlledInput
                key={status}
                {...args}
                size={size}
                status={status}
                helperText={helper}
                iconLeft={<LeftIcon />}
                iconRight={<RightIcon />}
              />
            ))}
            <ControlledInput
              {...args}
              size={size}
              disabled
              helperText="Helper Text"
              label="Disabled"
              iconLeft={<LeftIcon />}
              iconRight={<RightIcon />}
            />
          </View>
        ))}
      </View>
    );
  },
};

export const AllVariants: Story = {
  name: 'Overview / Filled vs Outline',
  render: (args) => (
    <View className="gap-6">
      {(['filled', 'outline'] as const).map((variant) => (
        <View key={variant} className="gap-3">
          <Text className="text-b2 text-text-primary font-semibold capitalize">{variant}</Text>
          <ControlledInput
            {...args}
            variant={variant}
            iconLeft={<LeftIcon />}
            iconRight={<RightIcon />}
          />
          <ControlledInput
            {...args}
            variant={variant}
            status="error"
            helperText="Error Text"
            iconLeft={<LeftIcon />}
            iconRight={<RightIcon />}
          />
        </View>
      ))}
    </View>
  ),
};
