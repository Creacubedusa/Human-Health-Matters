import type { Meta, StoryObj } from '@storybook/react-native';
import { OrderCard } from './OrderCard';

const meta: Meta<typeof OrderCard> = {
  title: 'Patient/Order/OrderCard',
  component: OrderCard,
  args: {
    item: {
      id: 'ord-001',
      testName: 'Blood Count',
      orderedBy: 'Dr. Grant Paul',
      date: 'Dec 12, 2024',
      status: 'ongoing',
      priority: 'urgent',
    },
    labels: { urgent: 'Urgent', notUrgent: 'Not Urgent', orderedBy: 'Ordered by' },
    onPress: () => {},
  },
};
export default meta;
type Story = StoryObj<typeof OrderCard>;

export const Urgent: Story = {};
export const NotUrgent: Story = {
  args: { item: { id: 'ord-002', testName: 'Lipid Panel', orderedBy: 'Dr. Grant Paul', date: 'Nov 10, 2024', status: 'ongoing', priority: 'not-urgent' } },
};
export const Completed: Story = {
  args: { item: { id: 'ord-003', testName: 'X-Ray', orderedBy: 'Dr. Grant Paul', date: 'Oct 5, 2024', status: 'completed', priority: 'not-urgent' } },
};
