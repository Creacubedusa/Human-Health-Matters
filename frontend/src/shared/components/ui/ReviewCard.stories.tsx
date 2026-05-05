import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { ReviewCard } from './ReviewCard';

const meta: Meta<typeof ReviewCard> = {
  title: 'UI/ReviewCard',
  component: ReviewCard,
  decorators: [(Story) => <View className="p-4"><Story /></View>],
};

export default meta;
type Story = StoryObj<typeof ReviewCard>;

export const Credentials: Story = {
  args: {
    title: 'Credentials',
    rows: [
      { label: 'NPI', value: '123456789' },
      { label: 'Name', value: 'Grant Paul' },
      { label: 'Medical Speciality', value: 'Cardiology' },
      { label: 'State Medical License', value: 'MD-123445556' },
    ],
  },
};

export const TaxAndPractice: Story = {
  args: {
    title: 'Tax and Practice',
    rows: [
      { label: 'Practice', value: 'Cardiology Group' },
      { label: 'Tax ID', value: '122344455' },
      { label: 'Billing Address', value: 'New York City' },
    ],
  },
};

export const Bank: Story = {
  args: {
    title: 'Bank',
    rows: [
      { label: 'Bank Name', value: 'Wellness Cargo' },
      { label: 'Account Name', value: 'Grant Paul' },
      { label: 'Account Number', value: '123449900' },
    ],
  },
};
