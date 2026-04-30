export type DoctorFilterTab = 'aiRecommended' | 'availableNow' | 'topRated';

export type DoctorRecommendation = {
  id: string;
  name: string;
  specialty: string;
  avatarUri: string;
  matchScore: number;
  rating: number;
  reviewCount: number;
  donorFunded: boolean;
  aiReason: string;
  isAvailableNow: boolean;
  patientsLabel: string;
  experienceLabel: string;
  about: string;
  availabilityRange: string;
};
