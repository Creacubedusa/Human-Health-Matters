import type { Meta, StoryObj } from '@storybook/react-native';
import { BookAppointmentView } from './BookAppointmentView';

const meta: Meta<typeof BookAppointmentView> = {
  title: 'Patient/BookAppointmentView',
  component: BookAppointmentView,
  args: {
    onBack: () => {},
    onSymptoms: () => {},
    onFollowUp: () => {},
  },
};
export default meta;

type Story = StoryObj<typeof BookAppointmentView>;

export const Default: Story = {};
