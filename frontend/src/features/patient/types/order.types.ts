export type OrderStatus = 'ongoing' | 'completed';
export type OrderFilter = 'ongoing' | 'completed';
export type OrderPriority = 'urgent' | 'not-urgent';

export interface OrderListItem {
  id: string;
  testName: string;
  orderedBy: string;
  date: string;
  status: OrderStatus;
  priority: OrderPriority;
}

export interface OrderDetail extends OrderListItem {
  orderId: string;
  patientName: string;
  specialisation: string;
  additionalComment: string;
  testType: string;
  sampleType: string;
  collectionInstruction: string;
}

export interface UploadedFile {
  name: string;
  sizeMb: number;
  progress: number;
}
