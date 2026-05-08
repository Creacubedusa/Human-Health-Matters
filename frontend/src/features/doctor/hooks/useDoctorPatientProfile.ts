import { format } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDoctorPatientsStore } from '../store/doctorPatients.store';
import {
  fetchDoctorLabOrders,
  fetchDoctorPatientById,
  fetchDoctorPrescriptions,
  type DoctorPatientDetail,
  type DoctorRemoteLabOrder,
  type DoctorRemotePrescription,
} from '../services/doctor.service';
import type {
  DoctorOrderRecord,
  DoctorPatientProfile,
  DoctorPrescriptionRecord,
  DoctorTestRecord,
} from '../types/doctor.types';

function formatRemoteDate(iso: string): string {
  try {
    return format(new Date(iso), 'MMM d, yyyy');
  } catch {
    return iso;
  }
}

function toPrescriptionRecord(rx: DoctorRemotePrescription): DoctorPrescriptionRecord {
  return {
    id: rx.id,
    doctorName: rx.doctorName,
    specialty: rx.specialty,
    licenseNo: '',
    date: formatRemoteDate(rx.createdAt),
    status: rx.status,
    refillsLeft: rx.refillsLeft,
    totalRefills: rx.totalRefills,
    medication: rx.medication + (rx.brandName ? ` (${rx.brandName})` : ''),
    rxNumber: rx.rxNumber,
    details: [
      `Dose: ${rx.dose}`,
      `Frequency: ${rx.frequency}`,
      `Duration: ${rx.duration}`,
      `Route: ${rx.route}`,
    ],
  };
}

function toOrderRecord(order: DoctorRemoteLabOrder): DoctorOrderRecord {
  const priority: DoctorOrderRecord['priority'] =
    order.priority?.toLowerCase() === 'urgent' ? 'urgent' : 'not-urgent';
  return {
    id: order.id,
    testName: order.testName,
    orderedBy: order.doctorName,
    date: formatRemoteDate(order.createdAt),
    status: order.status,
    priority,
  };
}

function toTestRecords(order: DoctorRemoteLabOrder): DoctorTestRecord[] {
  if (!order.submittedFiles || order.submittedFiles.length === 0) return [];
  return order.submittedFiles.map((file) => ({
    id: `${order.id}-${file.url}`,
    fileName: file.name,
    fileType: (file.mimeType ?? '').startsWith('image/') ? 'image' : 'lab',
    orderedBy: order.doctorName,
    date: formatRemoteDate(order.submittedAt ?? order.createdAt),
  }));
}

const EMPTY_MEDICAL_RECORDS: DoctorPatientProfile['medicalRecords'] = {
  patientHistory: [],
  medication: [],
  patientHistoryCategories: {
    chronicDiseases: [],
    familyDiabetesHistory: '',
    generalFamilyHistory: [],
    surgeries: [],
    allergies: [],
  },
  medicationCategories: {
    medicationTypes: [],
    currentMedications: [],
  },
  orders: [],
  tests: [],
  prescriptions: [],
  reports: [],
  carePlans: [],
};

function buildDoctorPatientProfile(detail: DoctorPatientDetail): DoctorPatientProfile {
  const lastVisitLabel = (() => {
    if (!detail.lastVisit) return '';
    const d = new Date(detail.lastVisit);
    if (Number.isNaN(d.getTime())) return '';
    return format(d, 'MMM d, yyyy');
  })();

  return {
    id: detail.id,
    name: detail.name || 'Patient',
    age: detail.age ?? 0,
    gender: detail.gender || 'Patient',
    appointmentTime: lastVisitLabel,
    severity: 'low',
    aiSummary: {
      label: lastVisitLabel ? 'Last visit' : 'New patient',
      summary: lastVisitLabel
        ? `Last visit on ${lastVisitLabel}`
        : 'No previous visits on record',
    },
    symptoms: [],
    avatarUri: detail.avatarUri ?? undefined,
    height: detail.height ?? '—',
    weight: detail.weight ?? '—',
    phone: detail.phone ?? '',
    email: detail.email ?? '',
    address: detail.address ?? '',
    nationality: detail.nationality ?? '',
    medicalRecords: EMPTY_MEDICAL_RECORDS,
  };
}

export function useDoctorPatientProfile(patientId: string) {
  const storedPatient = useDoctorPatientsStore((state) =>
    state.patients.find((item) => item.id === patientId) ?? null,
  );
  const successKey = useDoctorPatientsStore((state) => state.successByPatientId[patientId] ?? null);
  const clearSuccess = useDoctorPatientsStore((state) => state.clearSuccess);

  const [remotePatient, setRemotePatient] = useState<DoctorPatientProfile | null>(null);
  const [remotePrescriptions, setRemotePrescriptions] = useState<DoctorPrescriptionRecord[]>([]);
  const [remoteOrders, setRemoteOrders] = useState<DoctorOrderRecord[]>([]);
  const [remoteTests, setRemoteTests] = useState<DoctorTestRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!patientId) return;
    setError(null);
    try {
      const [detail, prescriptions, orders] = await Promise.all([
        fetchDoctorPatientById(patientId),
        fetchDoctorPrescriptions().catch(() => [] as DoctorRemotePrescription[]),
        fetchDoctorLabOrders().catch(() => [] as DoctorRemoteLabOrder[]),
      ]);
      const ownPrescriptions = prescriptions.filter((rx) => rx.patientId === patientId);
      const ownOrders = orders.filter((order) => order.patientId === patientId);
      setRemotePatient(buildDoctorPatientProfile(detail));
      setRemotePrescriptions(ownPrescriptions.map(toPrescriptionRecord));
      setRemoteOrders(ownOrders.map(toOrderRecord));
      setRemoteTests(ownOrders.flatMap(toTestRecords));
    } catch {
      setError('failed_to_load');
    }
  }, [patientId]);

  useEffect(() => {
    if (!patientId) return;
    let cancelled = false;
    setLoading(true);
    void load().finally(() => {
      if (cancelled) return;
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [patientId, load]);

  const patient = useMemo<DoctorPatientProfile | null>(() => {
    const base = remotePatient ?? storedPatient;
    if (!base) return null;
    return {
      ...base,
      medicalRecords: {
        ...base.medicalRecords,
        prescriptions: remotePrescriptions.length
          ? remotePrescriptions
          : base.medicalRecords.prescriptions,
        orders: remoteOrders.length ? remoteOrders : base.medicalRecords.orders,
        tests: remoteTests.length ? remoteTests : base.medicalRecords.tests,
      },
    };
  }, [remotePatient, storedPatient, remotePrescriptions, remoteOrders, remoteTests]);

  const hasMedicalRecords = useMemo(() => {
    if (!patient) return false;

    return (
      patient.medicalRecords.patientHistory.length > 0 ||
      patient.medicalRecords.medication.length > 0 ||
      patient.medicalRecords.orders.length > 0 ||
      patient.medicalRecords.tests.length > 0 ||
      patient.medicalRecords.prescriptions.length > 0 ||
      patient.medicalRecords.reports.length > 0
    );
  }, [patient]);

  async function refresh() {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }

  return {
    patient,
    loading,
    error,
    successKey,
    clearSuccess: () => clearSuccess(patientId),
    hasMedicalRecords,
    refresh,
    refreshing,
  };
}
