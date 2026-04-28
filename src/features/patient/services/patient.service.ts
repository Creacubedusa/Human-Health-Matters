import type { PatientHomeDashboard } from '../types/patient.types';

// Stub — replace with real API call via shared/api
export async function fetchPatientDashboard(): Promise<PatientHomeDashboard> {
  await new Promise((r) => setTimeout(r, 800));

  // Toggle isNewUser here for testing both screens
  const isNewUser = false;

  if (isNewUser) {
    return {
      patientName: 'Angela',
      isNewUser: true,
      careInProgress: null,
      recentActivities: [],
      careFunding: null,
    };
  }

  return {
    patientName: 'Angela',
    isNewUser: false,
    careInProgress: {
      title: 'Difficulty in Breathing Assessment',
      doctorName: 'Doctor Paul Grant',
      specialty: 'Cardiologist',
      date: 'March 23, 2026',
      isActive: true,
    },
    recentActivities: [
      {
        type: 'consultation',
        id: 'c1',
        title: 'Consultation with Dr. John',
        subtitle: 'Follow-up on Hypertension',
        date: 'Dec 12, 2024',
        status: 'join',
        canJoin: true,
      },
      {
        type: 'consultation',
        id: 'c2',
        title: 'Consultation with Dr. John',
        subtitle: 'Follow-up on Hypertension',
        date: 'Dec 12, 2024',
        status: 'upcoming',
        canJoin: false,
      },
      {
        type: 'consultation',
        id: 'c3',
        title: 'Consultation with Dr. John',
        subtitle: 'Hypertension review',
        date: 'Dec 12, 2024',
        status: 'completed',
        canJoin: false,
      },
      {
        type: 'symptomCheck',
        id: 's1',
        symptoms: 'Chest tightness & fatigue',
        date: 'Dec 12, 2024',
        severity: 'emergency',
      },
      {
        type: 'symptomCheck',
        id: 's2',
        symptoms: 'Cough and catarrh',
        date: 'Dec 12, 2024',
        severity: 'low',
      },
      {
        type: 'symptomCheck',
        id: 's3',
        symptoms: 'Headache',
        date: 'Dec 12, 2024',
        severity: 'moderate',
      },
      {
        type: 'communityFund',
        id: 'f1',
        description: '$33 in coverage for your Hypertension Consultation',
        date: 'Dec 12, 2024',
      },
    ],
    careFunding: {
      totalCost: 1000,
      insurancePercent: 60,
      donorPercent: 40,
    },
  };
}
