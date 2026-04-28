import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { fn } from 'storybook/test';
import { Alert, type AlertStatus, type AlertVariant } from './Alert';

const IconPlaceholder = ({ color }: { color?: string }) => (
  <Text style={{ color: color ?? '#fff', fontSize: 16, lineHeight: 24 }}>★</Text>
);

const ACCENT_HEX: Record<AlertStatus, string> = {
  default: '#4E61F6',
  success: '#43B75D',
  info:    '#0095FF',
  warning: '#FFAA00',
  error:   '#EE443F',
};

const meta: Meta<typeof Alert> = {
  title: 'Shared/UI/Alert',
  component: Alert,
  args: {
    title: 'Alert Title',
    description: 'This is the alert description providing more context.',
    leftButtonLabel: 'Action',
    rightButtonLabel: 'Dismiss',
    onLeftButtonPress: fn(),
    onRightButtonPress: fn(),
    status: 'default',
    variant: 'filled',
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

// ── Variants ───────────────────────────────────────────────────────────────

export const VariantFilled: Story = {
  name: 'Variant / Filled',
  args: { variant: 'filled' },
  render: (args) => (
    <Alert {...args} icon={<IconPlaceholder color="#fff" />} />
  ),
};

export const VariantOutline: Story = {
  name: 'Variant / Outline',
  args: { variant: 'outline' },
  render: (args) => (
    <Alert {...args} icon={<IconPlaceholder color={ACCENT_HEX[args.status ?? 'default']} />} />
  ),
};

// ── Status states ──────────────────────────────────────────────────────────

export const StatusDefault: Story = {
  name: 'Status / Default',
  args: { status: 'default' },
  render: (args) => (
    <View className="gap-4">
      <Alert {...args} variant="filled" icon={<IconPlaceholder color="#fff" />} />
      <Alert {...args} variant="outline" icon={<IconPlaceholder color={ACCENT_HEX.default} />} />
    </View>
  ),
};

export const StatusSuccess: Story = {
  name: 'Status / Success',
  args: { status: 'success' },
  render: (args) => (
    <View className="gap-4">
      <Alert {...args} variant="filled" icon={<IconPlaceholder color="#fff" />} />
      <Alert {...args} variant="outline" icon={<IconPlaceholder color={ACCENT_HEX.success} />} />
    </View>
  ),
};

export const StatusInfo: Story = {
  name: 'Status / Info',
  args: { status: 'info' },
  render: (args) => (
    <View className="gap-4">
      <Alert {...args} variant="filled" icon={<IconPlaceholder color="#fff" />} />
      <Alert {...args} variant="outline" icon={<IconPlaceholder color={ACCENT_HEX.info} />} />
    </View>
  ),
};

export const StatusWarning: Story = {
  name: 'Status / Warning',
  args: { status: 'warning' },
  render: (args) => (
    <View className="gap-4">
      <Alert {...args} variant="filled" icon={<IconPlaceholder color="#fff" />} />
      <Alert {...args} variant="outline" icon={<IconPlaceholder color={ACCENT_HEX.warning} />} />
    </View>
  ),
};

export const StatusError: Story = {
  name: 'Status / Error',
  args: { status: 'error' },
  render: (args) => (
    <View className="gap-4">
      <Alert {...args} variant="filled" icon={<IconPlaceholder color="#fff" />} />
      <Alert {...args} variant="outline" icon={<IconPlaceholder color={ACCENT_HEX.error} />} />
    </View>
  ),
};

// ── Slot combinations ──────────────────────────────────────────────────────

export const TitleOnly: Story = {
  name: 'Slots / Title Only',
  render: (args) => (
    <View className="gap-4">
      <Alert {...args} variant="filled" description={undefined} leftButtonLabel={undefined} rightButtonLabel={undefined} />
      <Alert {...args} variant="outline" description={undefined} leftButtonLabel={undefined} rightButtonLabel={undefined} />
    </View>
  ),
};

export const NoIcon: Story = {
  name: 'Slots / No Icon',
  render: (args) => (
    <View className="gap-4">
      <Alert {...args} variant="filled" icon={undefined} />
      <Alert {...args} variant="outline" icon={undefined} />
    </View>
  ),
};

export const NoButtons: Story = {
  name: 'Slots / No Buttons',
  render: (args) => (
    <View className="gap-4">
      <Alert {...args} variant="filled" icon={<IconPlaceholder color="#fff" />} leftButtonLabel={undefined} rightButtonLabel={undefined} />
      <Alert {...args} variant="outline" icon={<IconPlaceholder color={ACCENT_HEX[args.status ?? 'default']} />} leftButtonLabel={undefined} rightButtonLabel={undefined} />
    </View>
  ),
};

export const LeftButtonOnly: Story = {
  name: 'Slots / Left Button Only',
  render: (args) => (
    <View className="gap-4">
      <Alert {...args} variant="filled" icon={<IconPlaceholder color="#fff" />} rightButtonLabel={undefined} />
      <Alert {...args} variant="outline" icon={<IconPlaceholder color={ACCENT_HEX[args.status ?? 'default']} />} rightButtonLabel={undefined} />
    </View>
  ),
};

export const Minimal: Story = {
  name: 'Slots / Minimal (title only, no icon, no buttons)',
  render: (args) => (
    <View className="gap-4">
      <Alert {...args} variant="filled" description={undefined} leftButtonLabel={undefined} rightButtonLabel={undefined} icon={undefined} />
      <Alert {...args} variant="outline" description={undefined} leftButtonLabel={undefined} rightButtonLabel={undefined} icon={undefined} />
    </View>
  ),
};

// ── Edge Cases ─────────────────────────────────────────────────────────────

export const LongContent: Story = {
  name: 'Edge Cases / Long Title + Description',
  render: (args) => (
    <View className="gap-4">
      <Alert
        {...args}
        variant="filled"
        icon={<IconPlaceholder color="#fff" />}
        title="This is a very long alert title that might wrap onto a second line"
        description="This description is intentionally long to confirm that text wraps gracefully without breaking the layout or overflowing the container in unexpected ways on any device width."
      />
      <Alert
        {...args}
        variant="outline"
        icon={<IconPlaceholder color={ACCENT_HEX[args.status ?? 'default']} />}
        title="This is a very long alert title that might wrap onto a second line"
        description="This description is intentionally long to confirm that text wraps gracefully without breaking the layout or overflowing the container in unexpected ways on any device width."
      />
    </View>
  ),
};

export const TitleClipped: Story = {
  name: 'Edge Cases / Title Clipped at 2 Lines',
  render: (args) => (
    <View className="gap-4">
      <Alert
        {...args}
        variant="filled"
        icon={<IconPlaceholder color="#fff" />}
        title="This title is extremely long and will be clipped at exactly two lines by the numberOfLines constraint that is set on the title Text component"
        description={undefined}
        leftButtonLabel={undefined}
        rightButtonLabel={undefined}
      />
    </View>
  ),
};

// ── Overview ───────────────────────────────────────────────────────────────

export const Overview: Story = {
  name: 'Overview / All Statuses × Variants',
  render: () => {
    const statuses: AlertStatus[] = ['default', 'success', 'info', 'warning', 'error'];
    const variants: AlertVariant[] = ['filled', 'outline'];

    return (
      <View className="gap-8">
        {variants.map((variant) => (
          <View key={variant} className="gap-4">
            <Text className="text-b2 text-text-primary font-semibold capitalize">{variant}</Text>
            {statuses.map((status) => (
              <Alert
                key={status}
                status={status}
                variant={variant}
                title="Alert Title"
                description="This is the alert description providing more context."
                icon={<IconPlaceholder color={variant === 'filled' ? '#fff' : ACCENT_HEX[status]} />}
                leftButtonLabel="Action"
                rightButtonLabel="Dismiss"
              />
            ))}
          </View>
        ))}
      </View>
    );
  },
};
