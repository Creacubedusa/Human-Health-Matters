import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { DatePickerField } from './DatePickerField';

const meta: Meta<typeof DatePickerField> = {
  title: 'UI/DatePickerField',
  component: DatePickerField,
  decorators: [(Story) => <View className="p-4"><Story /></View>],
};

export default meta;
type Story = StoryObj<typeof DatePickerField>;

export const Default: Story = {
  args: { label: 'Date of birth *', value: '', placeholder: 'DD/MM/YYYY' },
};

export const WithValue: Story = {
  args: { label: 'Date of birth *', value: '1995-03-23T00:00:00.000Z' },
};

export const Error: Story = {
  args: { label: 'Date of birth *', value: '', status: 'error', helperText: 'Date of birth is required' },
};

export const Disabled: Story = {
  args: { label: 'Date of birth *', value: '', disabled: true },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return <DatePickerField label="Date of birth *" value={value} onChange={setValue} />;
  },
};
