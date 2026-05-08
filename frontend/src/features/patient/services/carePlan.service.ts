import { http } from '@shared/api/http';
import type { CarePlan } from '../types/carePlan.types';

interface ApiCarePlan {
  id: string;
  appointmentId: string;
  status: 'active' | 'inactive';
  consultationTitle: string;
  doctorId: string;
  doctorName: string;
  doctorDisplayName: string;
  specialty: string;
  avatarUri: string;
  consultationDate: string;
  detailDate: string;
  duration: string;
  sessionType: string;
  consultationType: string;
  soapNotes: {
    subjective: string;
    objective: string;
    assessment: string[];
    plan: string[];
  };
  diagnoses: { id: string; name: string; icd10Code: string; priority: 'primary' | 'secondary' }[];
  recommendedTests: { id: string; name: string }[];
  prescriptions: { id: string; medication: string; details: string[] }[];
}

function toCarePlan(p: ApiCarePlan): CarePlan {
  return {
    id: p.id,
    status: p.status,
    consultationTitle: p.consultationTitle,
    doctorName: p.doctorName,
    doctorDisplayName: p.doctorDisplayName,
    specialty: p.specialty,
    consultationDate: p.consultationDate,
    detailDate: p.detailDate,
    duration: p.duration,
    sessionType: p.sessionType,
    consultationType: p.consultationType,
    avatarUri: p.avatarUri,
    soapNotes: {
      subjective: p.soapNotes.subjective,
      objective: p.soapNotes.objective,
      assessment: p.soapNotes.assessment,
      plan: p.soapNotes.plan,
    },
    diagnoses: p.diagnoses,
    recommendedTests: p.recommendedTests,
    prescriptions: p.prescriptions,
  };
}

export async function fetchCarePlans(): Promise<CarePlan[]> {
  const res = await http.get<ApiCarePlan[]>('/care-plans');
  return res.data.map(toCarePlan);
}

export async function fetchCarePlanById(id: string): Promise<CarePlan | null> {
  try {
    const res = await http.get<ApiCarePlan>(`/care-plans/${id}`);
    return toCarePlan(res.data);
  } catch {
    return null;
  }
}
