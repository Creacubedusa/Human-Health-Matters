import type { Meta, StoryObj } from '@storybook/react-native';
import { PrescriptionDetailView } from './PrescriptionDetailView';

const meta: Meta<typeof PrescriptionDetailView> = {
  title: 'Patient/PrescriptionDetailView',
  component: PrescriptionDetailView,
  args: {
    prescriptionId: 'rx-001',
    onBack: () => {},
    onPreview: () => {},
  },
};
export default meta;

type Story = StoryObj<typeof PrescriptionDetailView>;

export const Default: Story = {};
