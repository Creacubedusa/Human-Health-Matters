import { format } from 'date-fns';
import { http } from '@shared/api/http';
import type { PrescriptionDetail, PrescriptionListItem } from '../types/prescription.types';

interface ApiPrescription {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string | null;
  doctorName: string;
  doctorAvatarUri: string | null;
  specialty: string;
  patientName: string;
  medication: string;
  brandName: string | null;
  dose: string;
  frequency: string;
  duration: string;
  route: string;
  refillsLeft: number;
  totalRefills: number;
  notes: string | null;
  status: 'active' | 'inactive';
  rxNumber: string;
  createdAt: string;
  updatedAt: string;
}

function formatPrescriptionDate(iso: string): string {
  try {
    return format(new Date(iso), 'MMM d, yyyy');
  } catch {
    return iso;
  }
}

function buildDetails(p: ApiPrescription): string[] {
  return [
    p.dose ? `Dose: ${p.dose}` : null,
    p.frequency ? `Frequency: ${p.frequency}` : null,
    p.duration ? `Duration: ${p.duration}` : null,
    p.route ? `Route: ${p.route}` : null,
  ].filter((value): value is string => Boolean(value));
}

function toListItem(p: ApiPrescription): PrescriptionListItem {
  return {
    id: p.id,
    doctorName: p.doctorName,
    specialty: p.specialty,
    licenseNo: '',
    date: formatPrescriptionDate(p.createdAt),
    status: p.status,
    refillsLeft: p.refillsLeft,
    totalRefills: p.totalRefills,
    medication: p.medication + (p.brandName ? ` (${p.brandName})` : ''),
    rxNumber: p.rxNumber,
    details: buildDetails(p),
  };
}

function toDetail(p: ApiPrescription): PrescriptionDetail {
  return {
    ...toListItem(p),
    brandName: p.brandName ?? '',
    dosage: p.dose,
    sig: [p.dose, p.frequency, p.route].filter(Boolean).join(' '),
    issuedDate: formatPrescriptionDate(p.createdAt),
    expiresDate: '',
    directions: p.notes ?? `${p.dose} ${p.frequency} ${p.route}`.trim(),
  };
}

export async function fetchPatientPrescriptions(): Promise<PrescriptionListItem[]> {
  const res = await http.get<ApiPrescription[]>('/prescriptions');
  return res.data.map(toListItem);
}

export async function fetchPatientPrescriptionById(id: string): Promise<PrescriptionDetail | null> {
  try {
    const res = await http.get<ApiPrescription>(`/prescriptions/${id}`);
    return toDetail(res.data);
  } catch {
    return null;
  }
}
