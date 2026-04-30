import type { Meta, StoryObj } from '@storybook/react-native';
import { PrescriptionPreviewView } from './PrescriptionPreviewView';

const meta: Meta<typeof PrescriptionPreviewView> = {
  title: 'Patient/PrescriptionPreviewView',
  component: PrescriptionPreviewView,
  args: {
    prescriptionId: 'rx-001',
    onBack: () => {},
  },
};
export default meta;

type Story = StoryObj<typeof PrescriptionPreviewView>;

export const Default: Story = {};
