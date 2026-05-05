import { create } from 'zustand';
import type {
  DoctorOrderDraft,
  DoctorPatientProfile,
  DoctorPrescriptionDraft,
  DoctorReportDraft,
} from '../types/doctor.types';

interface DoctorPatientsState {
  patients: DoctorPatientProfile[];
  successByPatientId: Record<string, string | null>;
  addPrescription: (patientId: string, draft: DoctorPrescriptionDraft) => void;
  addOrder: (patientId: string, draft: DoctorOrderDraft) => void;
  addCarePlanSummary: (patientId: string, plan: { id: string; status: 'active' | 'inactive'; title: string; doctorName: string; specialty: string; date: string }) => void;
  addReport: (patientId: string, draft: DoctorReportDraft) => void;
  clearSuccess: (patientId: string) => void;
}

function formatDate() {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());
}

function fileNameFromUri(uri: string | null) {
  if (!uri) return 'Medical-report.jpg';
  const parts = uri.split('/');
  return parts[parts.length - 1] ?? 'Medical-report.jpg';
}

const INITIAL_PATIENTS: DoctorPatientProfile[] = [
  {
    id: '1',
    name: 'Angela Dairo',
    age: 30,
    gender: 'Female',
    appointmentTime: '8 am - 10 am',
    severity: 'emergency',
    aiSummary: {
      label: 'AI Pre-visit Summary',
      summary: 'Patient is experiencing chest pressure, pain spreading to arm, dizziness and sweating',
    },
    symptoms: ['chest pressure', 'arm pain', 'dizziness', 'sweating', 'cardiac', 'triage'],
    height: '170 cm',
    weight: '65 kg',
    phone: '+234 809 111 2233',
    email: 'angela.dairo@example.com',
    address: '12 Admiralty Way, Lekki, Lagos',
    nationality: 'Nigerian',
    medicalRecords: {
      patientHistory: [
        'History of hypertension and intermittent chest discomfort.',
        'Recent triage conversation flagged possible cardiovascular symptoms.',
      ],
      medication: ['Amlodipine 5mg once daily', 'Aspirin 75mg once daily'],
      patientHistoryCategories: {
        chronicDiseases: ['Hypertension', 'Coronary artery disease'],
        familyDiabetesHistory: 'yes',
        generalFamilyHistory: ['Father: Hypertension', 'Mother: Type 2 Diabetes'],
        surgeries: ['Appendectomy (2018)'],
        allergies: ['Penicillin', 'Sulfa drugs'],
      },
      medicationCategories: {
        medicationTypes: ['Antihypertensive', 'Antiplatelet'],
        currentMedications: ['Amlodipine 5mg once daily', 'Aspirin 75mg once daily'],
      },
      orders: [
        {
          id: 'order-1',
          testName: 'Blood Count',
          orderedBy: 'Dr. Grant',
          date: 'Dec 12, 2024',
          status: 'ongoing',
          priority: 'urgent',
        },
      ],
      tests: [
        {
          id: 'test-1',
          fileName: 'Ultrasound.jpg',
          fileType: 'image',
          orderedBy: 'Dr. Grant',
          date: 'May 12, 2023',
        },
      ],
      prescriptions: [
        {
          id: 'rx-1',
          doctorName: 'Dr. Grant',
          specialty: 'Cardiology',
          licenseNo: 'MD-88219',
          date: 'Dec 12, 2026',
          status: 'active',
          refillsLeft: 1,
          totalRefills: 2,
          medication: 'Atorvastatin',
          rxNumber: 'RX-0001',
          details: ['Dose: 20mg', 'Frequency: Once daily', 'Duration: 3-5 days', 'Route: Oral'],
        },
      ],
      reports: [
        {
          id: 'report-1',
          title: 'Blood Test',
          fileName: 'Bloodtest.pdf',
          fileType: 'pdf',
          uploadedBy: 'Dr. Grant',
          date: 'May 12, 2023',
        },
      ],
      carePlans: [
        {
          id: 'cp-1',
          status: 'active',
          title: 'Cardiac Monitoring Assessment',
          doctorName: 'Dr. Grant',
          specialty: 'Cardiologist',
          date: 'March 23, 2026',
        },
        {
          id: 'cp-2',
          status: 'inactive',
          title: 'Hypertension Management Plan',
          doctorName: 'Dr. Okafor',
          specialty: 'Internist',
          date: 'Jan 10, 2025',
        },
      ],
    },
  },
  {
    id: '2',
    name: 'David Hassan',
    age: 42,
    gender: 'Male',
    appointmentTime: '10 am - 11 am',
    severity: 'moderate',
    aiSummary: {
      label: 'AI Pre-visit Summary',
      summary: 'Patient reports fatigue, blurry vision, high thirst and frequent urination over the last week',
    },
    symptoms: ['fatigue', 'blurry vision', 'high thirst', 'frequent urination', 'diabetes'],
    height: '176 cm',
    weight: '81 kg',
    phone: '+234 802 333 4455',
    email: 'david.hassan@example.com',
    address: '7 GRA Phase 2, Port Harcourt',
    nationality: 'Nigerian',
    medicalRecords: {
      patientHistory: ['Known Type 2 diabetic.', 'Complains of unstable sugar control over the last month.'],
      medication: ['Metformin 500mg twice daily'],
      patientHistoryCategories: {
        chronicDiseases: ['Type 2 Diabetes Mellitus'],
        familyDiabetesHistory: 'yes',
        generalFamilyHistory: ['Father: Type 2 Diabetes', 'Paternal uncle: Cardiovascular disease'],
        surgeries: [],
        allergies: [],
      },
      medicationCategories: {
        medicationTypes: ['Biguanide (Antidiabetic)'],
        currentMedications: ['Metformin 500mg twice daily'],
      },
      orders: [],
      tests: [],
      prescriptions: [],
      reports: [],
      carePlans: [],
    },
  },
  {
    id: '3',
    name: 'Halima Yusuf',
    age: 27,
    gender: 'Female',
    appointmentTime: '11 am - 1 pm',
    severity: 'low',
    aiSummary: {
      label: 'AI Pre-visit Summary',
      summary: 'Patient discussed mild headaches, poor sleep quality and work-related stress during triage',
    },
    symptoms: ['headaches', 'poor sleep', 'stress', 'triage conversation'],
    height: '165 cm',
    weight: '58 kg',
    phone: '+234 813 550 7712',
    email: 'halima.yusuf@example.com',
    address: '19 Aminu Kano Crescent, Abuja',
    nationality: 'Nigerian',
    medicalRecords: {
      patientHistory: ['No significant chronic disease history.', 'Symptoms appear stress-related.'],
      medication: ['Paracetamol as needed'],
      patientHistoryCategories: {
        chronicDiseases: [],
        familyDiabetesHistory: 'no',
        generalFamilyHistory: [],
        surgeries: [],
        allergies: [],
      },
      medicationCategories: {
        medicationTypes: ['Analgesic'],
        currentMedications: ['Paracetamol 500mg as needed'],
      },
      orders: [],
      tests: [],
      prescriptions: [],
      reports: [],
      carePlans: [],
    },
  },
  {
    id: '4',
    name: 'Moses Etim',
    age: 36,
    gender: 'Male',
    appointmentTime: '1 pm - 2 pm',
    severity: 'moderate',
    aiSummary: {
      label: 'AI Pre-visit Summary',
      summary: 'Patient reports abdominal pain, nausea and reduced appetite after a recent trip',
    },
    symptoms: ['abdominal pain', 'nausea', 'reduced appetite', 'travel'],
    height: '180 cm',
    weight: '73 kg',
    phone: '+234 810 657 1290',
    email: 'moses.etim@example.com',
    address: '44 Ewet Housing, Uyo',
    nationality: 'Nigerian',
    medicalRecords: {
      patientHistory: ['Recent travel history noted.', 'No surgery history reported.'],
      medication: ['Omeprazole 20mg once daily'],
      patientHistoryCategories: {
        chronicDiseases: ['Gastro-oesophageal reflux disease (GERD)'],
        familyDiabetesHistory: 'unknown',
        generalFamilyHistory: [],
        surgeries: [],
        allergies: ['Ibuprofen (GI sensitivity)'],
      },
      medicationCategories: {
        medicationTypes: ['Proton pump inhibitor'],
        currentMedications: ['Omeprazole 20mg once daily'],
      },
      orders: [],
      tests: [],
      prescriptions: [],
      reports: [],
      carePlans: [],
    },
  },
  {
    id: '5',
    name: 'Tosin Adeyemi',
    age: 33,
    gender: 'Female',
    appointmentTime: '2 pm - 4 pm',
    severity: 'low',
    aiSummary: {
      label: 'AI Pre-visit Summary',
      summary: 'Patient notes recurring back pain after long periods of sitting and reduced mobility in the mornings',
    },
    symptoms: ['back pain', 'reduced mobility', 'morning stiffness'],
    height: '168 cm',
    weight: '62 kg',
    phone: '+234 803 888 0022',
    email: 'tosin.adeyemi@example.com',
    address: '21 Bodija Estate, Ibadan',
    nationality: 'Nigerian',
    medicalRecords: {
      patientHistory: ['Recurring lower back pain over the last 6 months.'],
      medication: ['Ibuprofen as needed'],
      patientHistoryCategories: {
        chronicDiseases: ['Chronic lower back pain', 'Lumbar muscle strain'],
        familyDiabetesHistory: '',
        generalFamilyHistory: ['Mother: Osteoporosis'],
        surgeries: [],
        allergies: [],
      },
      medicationCategories: {
        medicationTypes: ['NSAID (Anti-inflammatory)'],
        currentMedications: ['Ibuprofen 400mg as needed (max 3×/day)'],
      },
      orders: [],
      tests: [],
      prescriptions: [],
      reports: [],
      carePlans: [],
    },
  },
];

export const useDoctorPatientsStore = create<DoctorPatientsState>((set) => ({
  patients: INITIAL_PATIENTS,
  successByPatientId: {},

  addPrescription: (patientId, draft) =>
    set((state) => ({
      patients: state.patients.map((patient) =>
        patient.id !== patientId
          ? patient
          : {
              ...patient,
              medicalRecords: {
                ...patient.medicalRecords,
                prescriptions: [
                  {
                    id: `rx-${Date.now()}`,
                    doctorName: 'Dr. Grant',
                    specialty: 'General Medicine',
                    licenseNo: 'MD-88219',
                    date: formatDate(),
                    status: 'active',
                    refillsLeft: Number(draft.refillsLeft || '0'),
                    totalRefills: Number(draft.refillsLeft || '0'),
                    medication: draft.medication,
                    rxNumber: `RX-${Date.now()}`,
                    details: [
                      `Brand name: ${draft.brandName}`,
                      `Dose: ${draft.dose}`,
                      `Frequency: ${draft.frequency}`,
                      `Duration: ${draft.duration}`,
                      `Route: ${draft.route}`,
                      `Notes: ${draft.notes}`,
                    ],
                  },
                  ...patient.medicalRecords.prescriptions,
                ],
              },
            },
      ),
      successByPatientId: {
        ...state.successByPatientId,
        [patientId]: 'doctorPatients.success.prescriptionAdded',
      },
    })),

  addOrder: (patientId, draft) =>
    set((state) => ({
      patients: state.patients.map((patient) =>
        patient.id !== patientId
          ? patient
          : {
              ...patient,
              medicalRecords: {
                ...patient.medicalRecords,
                orders: [
                  {
                    id: `order-${Date.now()}`,
                    testName: draft.testName,
                    orderedBy: 'Dr. Grant',
                    date: formatDate(),
                    status: 'ongoing',
                    priority: draft.priority === 'urgent' ? 'urgent' : 'not-urgent',
                  },
                  ...patient.medicalRecords.orders,
                ],
              },
            },
      ),
      successByPatientId: {
        ...state.successByPatientId,
        [patientId]: 'doctorPatients.success.orderCreated',
      },
    })),

  addCarePlanSummary: (patientId, plan) =>
    set((state) => ({
      patients: state.patients.map((patient) =>
        patient.id !== patientId
          ? patient
          : {
              ...patient,
              medicalRecords: {
                ...patient.medicalRecords,
                carePlans: [
                  {
                    id: plan.id,
                    status: plan.status,
                    title: plan.title,
                    doctorName: plan.doctorName,
                    specialty: plan.specialty,
                    date: plan.date,
                  },
                  ...patient.medicalRecords.carePlans,
                ],
              },
            },
      ),
      successByPatientId: {
        ...state.successByPatientId,
        [patientId]: 'doctorPatients.success.carePlanCreated',
      },
    })),

  addReport: (patientId, draft) =>
    set((state) => ({
      patients: state.patients.map((patient) =>
        patient.id !== patientId
          ? patient
          : {
              ...patient,
              medicalRecords: {
                ...patient.medicalRecords,
                reports: [
                  {
                    id: `report-${Date.now()}`,
                    title: draft.title,
                    fileName: fileNameFromUri(draft.fileUri),
                    fileType: draft.fileUri?.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image',
                    uploadedBy: 'Dr. Grant',
                    date: formatDate(),
                  },
                  ...patient.medicalRecords.reports,
                ],
              },
            },
      ),
      successByPatientId: {
        ...state.successByPatientId,
        [patientId]: 'doctorPatients.success.documentAdded',
      },
    })),

  clearSuccess: (patientId) =>
    set((state) => ({
      successByPatientId: {
        ...state.successByPatientId,
        [patientId]: null,
      },
    })),
}));
