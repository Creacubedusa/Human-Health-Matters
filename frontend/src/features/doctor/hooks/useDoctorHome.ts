import { useEffect, useMemo, useState } from 'react';
import { fetchDoctorManagedAppointments } from '../services/doctor.service';
import { useDoctorAppointmentsStore } from '../store/doctorAppointments.store';
import { useDoctorPatientsStore } from '../store/doctorPatients.store';
import { useDoctorStore } from '../store/doctor.store';
import type {
  DoctorHomeDashboard,
  DoctorPatientProfile,
  DoctorPatientSeverity,
  PatientInQueue,
} from '../types/doctor.types';

type Status = 'loading' | 'error' | 'success';

interface UseDoctorHomeResult {
  status: Status;
  homeDashboard: DoctorHomeDashboard | null;
  retry: () => void;
}

function normalizeName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function urgencyFromSeverity(
  severity: DoctorPatientSeverity | undefined,
): PatientInQueue['urgency'] {
  if (severity === 'emergency' || severity === 'moderate' || severity === 'low') {
    return severity;
  }

  return 'emergency';
}

function buildQueueItem(
  patient: DoctorPatientProfile | undefined,
  appointment: {
    id: string;
    patientId?: string;
    patientName: string;
    patientAvatar: string;
    time: string;
  },
): PatientInQueue {
  const fallbackName = appointment.patientName || 'Patient';

  return {
    id: patient?.id ?? appointment.patientId ?? `patient-${appointment.id}`,
    appointmentId: appointment.id,
    name: patient?.name ?? fallbackName,
    gender: patient?.gender ?? 'Patient',
    age: patient?.age ?? 0,
    urgency: urgencyFromSeverity(patient?.severity),
    timeSlot: appointment.time,
    aiSummary:
      patient?.aiSummary.summary ??
      'Severe case flagged for urgent doctor review. Open the consultation to assess the patient and complete the visit.',
    avatarUri: patient?.avatarUri ?? appointment.patientAvatar,
  };
}

function deriveHomeDashboard(
  doctorName: string,
  patients: DoctorPatientProfile[],
  appointments: Array<{
    id: string;
    patientId?: string;
    patientName: string;
    patientAvatar: string;
    startsAt: string;
    date: string;
    time: string;
    status: 'upcoming' | 'completed' | 'cancelled';
  }>,
): DoctorHomeDashboard {
  const now = Date.now();
  const patientsByName = new Map(
    patients.map((patient) => [normalizeName(patient.name), patient]),
  );

  const activeAppointments = appointments.filter(
    (appointment) => appointment.status !== 'cancelled',
  );
  const completedAppointments = activeAppointments.filter(
    (appointment) => appointment.status === 'completed',
  );
  const futureAppointments = activeAppointments
    .filter(
      (appointment) =>
        appointment.status === 'upcoming' &&
        new Date(appointment.startsAt).getTime() >= now,
    )
    .sort(
      (left, right) =>
        new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime(),
    );

  const futurePatients = futureAppointments.map((appointment) =>
    patientsByName.get(normalizeName(appointment.patientName)),
  );

  const patientsQueue = futureAppointments.map((appointment) =>
    buildQueueItem(
      patientsByName.get(normalizeName(appointment.patientName)),
      appointment,
    ),
  );

  return {
    doctorName,
    isNewUser: false,
    stats: {
      totalPatients: activeAppointments.length,
      emergencyCount: futurePatients.filter(
        (patient) => !patient || patient.severity === 'emergency',
      ).length,
      seenCount: completedAppointments.length,
    },
    patientsQueue,
  };
}

export function useDoctorHome(): UseDoctorHomeResult {
  const { homeDashboard, setHomeDashboard } = useDoctorStore();
  const appointments = useDoctorAppointmentsStore((state) => state.appointments);
  const setAppointments = useDoctorAppointmentsStore((state) => state.setAppointments);
  const patients = useDoctorPatientsStore((state) => state.patients);
  const [status, setStatus] = useState<Status>(
    homeDashboard || appointments.length > 0 ? 'success' : 'loading',
  );

  const derivedDashboard = useMemo(
    () => deriveHomeDashboard('Grant', patients, appointments),
    [appointments, patients],
  );

  async function load(options?: { silent?: boolean }) {
    if (!options?.silent) {
      setStatus('loading');
    }
    try {
      const data = await fetchDoctorManagedAppointments();
      setAppointments(data);
      setStatus('success');
    } catch {
      if (appointments.length > 0) {
        setStatus('success');
        return;
      }

      setStatus('error');
    }
  }

  useEffect(() => {
    void load({ silent: appointments.length > 0 });
  }, []);

  useEffect(() => {
    setHomeDashboard(derivedDashboard);
  }, [derivedDashboard, setHomeDashboard]);

  return {
    status,
    homeDashboard: derivedDashboard,
    retry: () => {
      void load();
    },
  };
}
