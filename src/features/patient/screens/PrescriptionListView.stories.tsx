import type { Meta, StoryObj } from '@storybook/react-native';
import { PrescriptionListView } from './PrescriptionListView';

const meta: Meta<typeof PrescriptionListView> = {
  title: 'Patient/PrescriptionListView',
  component: PrescriptionListView,
  args: {
    onBack: () => {},
    onSelectPrescription: () => {},
  },
};
export default meta;

type Story = StoryObj<typeof PrescriptionListView>;

export const Default: Story = {};
