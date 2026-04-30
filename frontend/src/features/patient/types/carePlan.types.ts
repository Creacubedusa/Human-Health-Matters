export type CarePlanStatus = 'active' | 'inactive';

export interface SoapNotes {
  subjective: string;
  objective: string;
  assessment: string[];
  plan: string[];
}

export interface Diagnosis {
  id: string;
  name: string;
  icd10Code: string;
  priority: 'primary' | 'secondary';
}

export interface Prescription {
  id: string;
  medication: string;
  details: string[];
}

export interface RecommendedTest {
  id: string;
  name: string;
}

export interface CarePlan {
  id: string;
  status: CarePlanStatus;
  consultationTitle: string;
  doctorName: string;
  doctorDisplayName: string;
  specialty: string;
  consultationDate: string;
  detailDate: string;
  duration: string;
  sessionType: string;
  consultationType: string;
  avatarUri: string;
  soapNotes: SoapNotes;
  diagnoses: Diagnosis[];
  recommendedTests: RecommendedTest[];
  prescriptions: Prescription[];
}
