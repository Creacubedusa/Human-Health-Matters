import type { PatientProfileOverview } from '../types/profileOverview.types';

const PROFILE_AVATAR_URI = 'https://www.figma.com/api/mcp/asset/358adde8-f227-41f9-bef3-5355c4d8580d';

export async function fetchPatientProfileOverview(): Promise<PatientProfileOverview> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    isProfileComplete: false,
    avatarUri: PROFILE_AVATAR_URI,
    name: 'Angela Dairo',
    gender: 'Female',
    dateOfBirth: '',
    height: '170 cm',
    weight: '65 kg',
    age: '22 years',
    phone: '+9327821093124',
    email: 'Dairo@gmail.com',
    address: '123 King Abdulaziz Road',
    nationality: 'Saudi',
    healthcareSupport: {
      applied: true,
      title: 'Healthcare Support applied',
      subtitle: 'View the impact of Donor Support',
      report: [
        'Donor support has been applied to eligible consultation costs.',
        'Your care access is currently supported by the HHM community health fund.',
      ],
    },
    medicalRecords: [
      {
        id: 'patient-history',
        title: 'Patient history',
        summary: 'Respiratory symptoms and chronic care notes',
        details: ['Difficulty breathing assessment', 'No prior surgery reported', 'Family history reviewed'],
      },
      {
        id: 'medication',
        title: 'Medication',
        summary: 'Current medications and usage notes',
        details: ['Amlodipine 10mg once daily', 'Prednisolone 20mg once daily for 3-5 days'],
      },
      {
        id: 'appointment',
        title: 'Appointment',
        summary: 'Recent and upcoming consultation activity',
        details: ['Video consultation with Doctor Paul Grant', 'Follow-up recommended in 5-7 days'],
      },
      {
        id: 'order',
        title: 'Order',
        summary: 'Clinical orders from consultation',
        details: ['Chest X-Ray ordered', 'Complete Blood Count ordered'],
      },
      {
        id: 'tests',
        title: 'Tests',
        summary: 'Recommended and completed tests',
        details: ['Chest X-Ray (PA & Lateral)', 'Complete Blood Count', 'Spirometry for further evaluation'],
      },
      {
        id: 'prescription',
        title: 'Prescription',
        summary: 'Prescription records and instructions',
        details: ['Albuterol inhaler as needed', 'Fluticasone 110 mcg twice daily for 2 weeks'],
      },
      {
        id: 'medical-docs',
        title: 'Medical reports and docs',
        summary: 'Uploaded and generated medical documents',
        details: ['Consultation summary', 'Prescription document', 'Care plan report'],
      },
    ],
    notificationEnabled: true,
    selectedLanguage: 'en',
  };
}
