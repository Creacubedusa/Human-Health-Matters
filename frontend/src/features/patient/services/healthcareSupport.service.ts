import type { HealthcareSupportData } from '../types/profileOverview.types';

export async function fetchHealthcareSupportData(): Promise<HealthcareSupportData> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  return {
    totalSupportReceived: '$155.00',
    totalCareVisits: 3,
    supportActivityList: [
      {
        id: '1',
        consultationTitle: 'Consultation with Dr. John',
        amount: '$55 support fund',
        date: 'Dec 12, 2024',
        status: 'applied',
      },
      {
        id: '2',
        consultationTitle: 'Consultation with Dr. Sarah',
        amount: '$50 support fund',
        date: 'Nov 28, 2024',
        status: 'applied',
      },
      {
        id: '3',
        consultationTitle: 'Consultation with Dr. Mike',
        amount: '$50 support fund',
        date: 'Oct 15, 2024',
        status: 'applied',
      },
    ],
  };
}
