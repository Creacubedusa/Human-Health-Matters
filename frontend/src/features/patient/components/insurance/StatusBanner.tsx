import { Alert } from '@shared/components/ui/Alert';

export type StatusBannerTone = 'info' | 'warning' | 'error' | 'success';

interface StatusBannerProps {
  title: string;
  description: string;
  tone?: StatusBannerTone;
}

export function StatusBanner({
  title,
  description,
  tone = 'info',
}: StatusBannerProps) {
  return (
    <Alert
      status={tone}
      variant="outline"
      title={title}
      description={description}
    />
  );
}
