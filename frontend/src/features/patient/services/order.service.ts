import { format } from 'date-fns';
import { http } from '@shared/api/http';
import type { OrderDetail, OrderListItem, OrderPriority } from '../types/order.types';

export interface ApiLabOrderFile {
  name: string;
  url: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
}

interface ApiLabOrder {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string | null;
  testName: string;
  testType: string | null;
  priority: string | null;
  sampleType: string | null;
  collectionInstruction: string | null;
  additionalComment: string | null;
  status: 'ongoing' | 'completed';
  rawStatus: 'PENDING' | 'SUBMITTED' | 'COMPLETED';
  submittedFiles: ApiLabOrderFile[];
  submittedAt: string | null;
  doctorName: string;
  doctorAvatarUri: string | null;
  specialty: string;
  patientName: string;
  createdAt: string;
  updatedAt: string;
}

function formatOrderDate(iso: string): string {
  try {
    return format(new Date(iso), 'MMM d, yyyy');
  } catch {
    return iso;
  }
}

function normalizePriority(value: string | null): OrderPriority {
  return value && value.toLowerCase() === 'urgent' ? 'urgent' : 'not-urgent';
}

function toListItem(o: ApiLabOrder): OrderListItem {
  return {
    id: o.id,
    testName: o.testName,
    orderedBy: o.doctorName.startsWith('Dr.') ? o.doctorName : `Dr. ${o.doctorName}`,
    date: formatOrderDate(o.createdAt),
    status: o.status,
    priority: normalizePriority(o.priority),
  };
}

function toDetail(o: ApiLabOrder): OrderDetail {
  return {
    ...toListItem(o),
    orderId: o.id,
    patientName: o.patientName,
    specialisation: o.specialty,
    additionalComment: o.additionalComment ?? '',
    testType: o.testType ?? '',
    sampleType: o.sampleType ?? '',
    collectionInstruction: o.collectionInstruction ?? '',
  };
}

export async function fetchPatientOrders(): Promise<OrderListItem[]> {
  const res = await http.get<ApiLabOrder[]>('/lab-orders');
  return res.data.map(toListItem);
}

export async function fetchPatientOrderById(id: string): Promise<{
  detail: OrderDetail;
  submittedFiles: ApiLabOrderFile[];
} | null> {
  try {
    const res = await http.get<ApiLabOrder>(`/lab-orders/${id}`);
    return {
      detail: toDetail(res.data),
      submittedFiles: res.data.submittedFiles ?? [],
    };
  } catch {
    return null;
  }
}

export async function submitPatientOrderFiles(
  id: string,
  files: ApiLabOrderFile[],
): Promise<ApiLabOrderFile[]> {
  const res = await http.post<{ submittedFiles: ApiLabOrderFile[] }>(
    `/lab-orders/${id}/submit`,
    { files },
  );
  return res.data.submittedFiles;
}
