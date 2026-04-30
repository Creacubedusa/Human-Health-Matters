import type { Meta, StoryObj } from '@storybook/react-native';
import { OrderOverviewCard } from './OrderOverviewCard';

const meta: Meta<typeof OrderOverviewCard> = {
  title: 'Patient/Order/OrderOverviewCard',
  component: OrderOverviewCard,
  args: {
    ongoingCount: 4,
    completedCount: 16,
    completionPercent: 80,
    labels: { title: 'Overview', ongoing: 'Ongoing', completed: 'completed' },
  },
};
export default meta;
type Story = StoryObj<typeof OrderOverviewCard>;

export const Default: Story = {};
export const AllComplete: Story = { args: { ongoingCount: 0, completedCount: 20, completionPercent: 100 } };
export const AllOngoing: Story = { args: { ongoingCount: 5, completedCount: 0, completionPercent: 0 } };
