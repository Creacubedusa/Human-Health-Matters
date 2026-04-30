import type { Meta, StoryObj } from '@storybook/react-native';
import { TestResultCard } from './TestResultCard';

const meta: Meta<typeof TestResultCard> = {
  title: 'Patient/Tests/TestResultCard',
  component: TestResultCard,
  args: {
    orderedBy: 'Paul Grant',
    date: 'May 12, 2023',
    orderedByLabel: 'Ordered by',
    dateLabel: 'Date',
    onPress: () => {},
  },
};
export default meta;
type Story = StoryObj<typeof TestResultCard>;

export const UploadMode: Story = {
  args: { mode: 'upload', uploadLabel: 'Upload attachment' },
};
export const LabResult: Story = {
  args: { mode: 'result', fileName: 'Blood test.pdf', fileType: 'lab' },
};
export const ImageResult: Story = {
  args: { mode: 'result', fileName: 'Ultrasound.jpg', fileType: 'image' },
};
