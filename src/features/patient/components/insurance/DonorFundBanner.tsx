import { StatusBanner } from './StatusBanner';

interface DonorFundBannerProps {
  title: string;
  description: string;
}

export function DonorFundBanner({ title, description }: DonorFundBannerProps) {
  return (
    <StatusBanner
      tone="warning"
      title={title}
      description={description}
    />
  );
}
