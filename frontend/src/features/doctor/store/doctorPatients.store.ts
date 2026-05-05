import { create } from 'zustand';
import { getMockCoverageResultForScenario } from '@features/patient/services/insuranceCoverage.service';
import type { CoverageScenarioId } from '@features/patient/types/insuranceCoverage.types';
import type {
  DoctorInsuranceClaimRecord,
  DoctorOrderDraft,
  DoctorPatientProfile,
  DoctorPrescriptionDraft,
  DoctorReportDraft,
} from '../types/doctor.types';

interface DoctorPatientsState {
  patients: DoctorPatientProfile[];
  insuranceClaims: DoctorInsuranceClaimRecord[];
  selectedInsuranceClaimId: string | null;
  successByPatientId: Record<string, string | null>;
  setSelectedInsuranceClaimId: (claimId: string | null) => void;
  recordInsuranceClaim: (payload: {
    patientId: string;
    appointmentId: string;
    consultationDate: string;
    consultationTime?: string;
    consultationDuration: string;
  }) => DoctorInsuranceClaimRecord | null;
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

function buildClaimId(appointmentId: string, consultationDate: string, consultationTime: string) {
  const dateKey = consultationDate.replace(/[^a-zA-Z0-9]/g, '-');
  const timeKey = consultationTime.replace(/[^a-zA-Z0-9]/g, '-');
  return `claim-${appointmentId}-${dateKey}-${timeKey}`;
}

function buildInsuranceClaimRecord(
  patient: DoctorPatientProfile,
  scenarioId: CoverageScenarioId,
  payload: {
    appointmentId: string;
    consultationDate: string;
    consultationTime?: string;
    consultationDuration: string;
  },
): DoctorInsuranceClaimRecord {
  const coverageResult = getMockCoverageResultForScenario(scenarioId, {
    patientName: patient.name,
  });

  return {
    id: buildClaimId(
      payload.appointmentId,
      payload.consultationDate,
      payload.consultationTime ?? patient.appointmentTime,
    ),
    patientId: patient.id,
    patientName: patient.name,
    appointmentId: payload.appointmentId,
    consultationDate: payload.consultationDate,
    consultationTime: payload.consultationTime ?? patient.appointmentTime,
    consultationDuration: payload.consultationDuration,
    insuranceStatus: coverageResult.insuranceStatus,
    coverageOutcome: coverageResult.outcome,
    carrierLabel: coverageResult.carrierLabel,
    memberId: coverageResult.memberId,
    groupNumber: coverageResult.groupNumber,
    planType: coverageResult.planType,
    chiefComplaint: patient.symptoms[0] ?? patient.aiSummary.summary,
  };
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
    insuranceScenarioId: 'insured_full',
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
    insuranceScenarioId: 'insured_partial_with_donor',
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
    insuranceScenarioId: 'no_insurance_donor_approved',
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
    insuranceScenarioId: 'insured_inactive',
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
    insuranceScenarioId: 'insured_inconclusive',
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

const INITIAL_INSURANCE_CLAIMS: DoctorInsuranceClaimRecord[] = [
  buildInsuranceClaimRecord(INITIAL_PATIENTS[0], 'insured_full', {
    appointmentId: 'consultation-angela-1',
    consultationDate: 'May 4, 2026',
    consultationTime: '8:00 AM',
    consultationDuration: '35 mins',
  }),
  buildInsuranceClaimRecord(INITIAL_PATIENTS[1], 'insured_partial_with_donor', {
    appointmentId: 'consultation-david-1',
    consultationDate: 'May 3, 2026',
    consultationTime: '10:15 AM',
    consultationDuration: '42 mins',
  }),
  buildInsuranceClaimRecord(INITIAL_PATIENTS[3], 'insured_partial_no_donor', {
    appointmentId: 'consultation-moses-1',
    consultationDate: 'May 1, 2026',
    consultationTime: '1:10 PM',
    consultationDuration: '29 mins',
  }),
  buildInsuranceClaimRecord(INITIAL_PATIENTS[3], 'insured_inactive', {
    appointmentId: 'consultation-moses-2',
    consultationDate: 'Apr 26, 2026',
    consultationTime: '2:00 PM',
    consultationDuration: '31 mins',
  }),
  buildInsuranceClaimRecord(INITIAL_PATIENTS[4], 'insured_inconclusive', {
    appointmentId: 'consultation-tosin-1',
    consultationDate: 'Apr 20, 2026',
    consultationTime: '4:20 PM',
    consultationDuration: '26 mins',
  }),
];

export const useDoctorPatientsStore = create<DoctorPatientsState>((set) => ({
  patients: INITIAL_PATIENTS,
  insuranceClaims: INITIAL_INSURANCE_CLAIMS,
  selectedInsuranceClaimId: null,
  successByPatientId: {},
  setSelectedInsuranceClaimId: (claimId) => set({ selectedInsuranceClaimId: claimId }),
  recordInsuranceClaim: (payload) => {
    const patient = useDoctorPatientsStore
      .getState()
      .patients.find((item) => item.id === payload.patientId);

    if (!patient?.insuranceScenarioId || !patient.insuranceScenarioId.startsWith('insured_')) {
      return null;
    }

    const claim = buildInsuranceClaimRecord(patient, patient.insuranceScenarioId, payload);

    set((state) => ({
      insuranceClaims: [
        claim,
        ...state.insuranceClaims.filter((item) => item.id !== claim.id),
      ],
      selectedInsuranceClaimId: claim.id,
    }));

    return claim;
  },

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
