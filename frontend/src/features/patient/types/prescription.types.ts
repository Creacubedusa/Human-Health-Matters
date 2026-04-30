export type PrescriptionStatus = 'active' | 'inactive';
export type PrescriptionFilter = 'all' | 'active' | 'inactive';

export interface PrescriptionListItem {
  id: string;
  doctorName: string;
  specialty: string;
  licenseNo: string;
  date: string;
  status: PrescriptionStatus;
  refillsLeft: number;
  totalRefills: number;
  medication: string;
  rxNumber: string;
  details?: string[];
}

export interface PrescriptionDetail extends PrescriptionListItem {
  brandName: string;
  dosage: string;
  sig: string;
  issuedDate: string;
  expiresDate: string;
  directions: string;
  quantity?: number;
  quantityUnit?: string;
}

export interface PrescriptionPreviewData extends PrescriptionDetail {
  patientName: string;
  patientDob: string;
  patientMemberId: string;
  quantity: number;
  quantityUnit: string;
}
