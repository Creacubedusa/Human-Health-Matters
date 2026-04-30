import type { Meta, StoryObj } from '@storybook/react-native';
import { OrderUploadZone } from './OrderUploadZone';

const meta: Meta<typeof OrderUploadZone> = {
  title: 'Patient/Order/OrderUploadZone',
  component: OrderUploadZone,
  args: {
    onSelectFile: () => {},
    labels: {
      ctaHighlight: 'Click here',
      ctaRest: 'to upload your file',
      maxSize: 'Maximum file size',
      maxSizeValue: '15MB',
    },
  },
};
export default meta;
type Story = StoryObj<typeof OrderUploadZone>;

export const Default: Story = {};
