import type { Meta, StoryObj } from '@storybook/react-native';
import { OrderFileCard } from './OrderFileCard';

const meta: Meta<typeof OrderFileCard> = {
  title: 'Patient/Order/OrderFileCard',
  component: OrderFileCard,
  args: {
    file: { name: 'Bloodtest.pdf', sizeMb: 10, progress: 100 },
    onRemove: () => {},
  },
};
export default meta;
type Story = StoryObj<typeof OrderFileCard>;

export const Complete: Story = {};
export const InProgress: Story = { args: { file: { name: 'Bloodtest.pdf', sizeMb: 10, progress: 60 } } };
export const Starting: Story = { args: { file: { name: 'Bloodtest.pdf', sizeMb: 10, progress: 0 } } };
