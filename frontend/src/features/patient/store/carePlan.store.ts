import { create } from 'zustand';
import type { CarePlan } from '../types/carePlan.types';

const DOCTOR_AVATAR_URI = 'https://www.figma.com/api/mcp/asset/b9fcf34a-bdca-4922-b299-610ecc309bbf';

const breathingCarePlan: Omit<CarePlan, 'id' | 'status' | 'consultationDate'> = {
  consultationTitle: 'Difficulty in Breathing Assessment',
  doctorName: 'Doctor Paul Grant',
  doctorDisplayName: 'Paul Grant',
  specialty: 'Cardiologist',
  detailDate: '2/11/2025',
  duration: '15:00',
  sessionType: 'Video',
  consultationType: 'Virtual',
  avatarUri: DOCTOR_AVATAR_URI,
  soapNotes: {
    subjective:
      '22-year-old female presents with a chief complaint of difficulty breathing for the past 2 days. Patient reports a sensation of "tightness" in the chest and increased effort when breathing, especially during physical activity. Describes mild intermittent wheezing and non-productive cough.',
    objective:
      'Patient appears mildly anxious, sitting upright, using accessory muscles minimally. Lungs: bilateral wheezing on expiration, decreased air entry at bases, no crackles. Heart: RRR, no murmurs. No lower-extremity edema.\nPeak flow measurement: 280 L/min (expected ~450 L/min for age/height).\nChest auscultation suggests bronchospasm.',
    assessment: [
      'Acute Dyspnea - moderate, likely secondary to reactive airway response',
      'Possible Acute Asthma Exacerbation - new onset, triggered by environmental irritants',
      'Wheezing and reduced peak flow consistent with bronchoconstriction',
    ],
    plan: [
      'Administer albuterol nebulizer treatment (2.5 mg) in clinic; reassess breathing and peak flow post-treatment',
      'Prescribe albuterol inhaler: 2 puffs every 4-6 hours as needed for shortness of breath/wheezing',
      'Start inhaled corticosteroid (Fluticasone 110 mcg): 1 puff twice daily for 2 weeks; review at follow-up',
      'Environmental modification: avoid dust exposure; consider wearing a mask at work',
      'Order diagnostic tests: chest X-ray, CBC, and spirometry for further evaluation',
      'Patient education: inhaler technique training and recognition of red-flag symptoms',
      'Follow-up appointment in 5-7 days or sooner if symptoms worsen (e.g., SpO2 < 92%, persistent wheezing, inability to speak full sentences)',
    ],
  },
  diagnoses: [
    {
      id: 'diagnosis-bronchopneumonia',
      name: 'Bronchopneumonia',
      icd10Code: 'J18.0',
      priority: 'primary',
    },
    {
      id: 'diagnosis-dyspnea',
      name: 'Shortness of breath (Dyspnea)',
      icd10Code: 'R06.02',
      priority: 'secondary',
    },
    {
      id: 'diagnosis-uri',
      name: 'Acute upper respiratory infection',
      icd10Code: 'J06.9',
      priority: 'secondary',
    },
  ],
  recommendedTests: [
    { id: 'test-chest-xray', name: 'Chest X-Ray (PA & Lateral)' },
    { id: 'test-cbc', name: 'Complete Blood Count' },
  ],
  prescriptions: [
    {
      id: 'rx-amlodipine',
      medication: 'Amlodipine 10mg',
      details: [
        'Form: tablet',
        'Route: Oral',
        'Frequency: Once daily',
        'Notes: May be taken with or without food. Complete full course.',
      ],
    },
    {
      id: 'rx-prednisolone',
      medication: 'Prednisolone 20mg',
      details: [
        'Dosage: 20mg',
        'Frequency: Once daily',
        'Duration: 3-5 days',
        'Notes: Do not stop abruptly. Take in the morning.',
      ],
    },
  ],
};

const INITIAL_CARE_PLANS: CarePlan[] = [
  {
    ...breathingCarePlan,
    id: 'care-active-1',
    status: 'active',
    consultationDate: 'March 23, 2026',
  },
  {
    ...breathingCarePlan,
    id: 'care-active-2',
    status: 'active',
    consultationDate: 'March 23, 2026',
  },
  {
    ...breathingCarePlan,
    id: 'care-active-3',
    status: 'active',
    consultationDate: 'March 23, 2026',
  },
  {
    ...breathingCarePlan,
    id: 'care-active-4',
    status: 'active',
    consultationDate: 'March 23, 2026',
  },
  {
    ...breathingCarePlan,
    id: 'care-inactive-1',
    status: 'inactive',
    consultationDate: 'February 16, 2026',
    detailDate: '2/16/2026',
  },
  {
    ...breathingCarePlan,
    id: 'care-inactive-2',
    status: 'inactive',
    consultationDate: 'January 28, 2026',
    detailDate: '1/28/2026',
  },
];

interface CarePlanStoreState {
  carePlans: CarePlan[];
  addCarePlan: (carePlan: CarePlan) => void;
  setCarePlans: (carePlans: CarePlan[]) => void;
}

void INITIAL_CARE_PLANS;

export const useCarePlanStore = create<CarePlanStoreState>((set) => ({
  carePlans: [],
  addCarePlan: (carePlan) =>
    set((state) => ({
      carePlans: [carePlan, ...state.carePlans],
    })),
  setCarePlans: (carePlans) => set({ carePlans }),
}));
