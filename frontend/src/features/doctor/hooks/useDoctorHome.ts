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

function formatTodayLabel() {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());
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

  return 'low';
}

function buildQueueItem(
  patient: DoctorPatientProfile | undefined,
  appointment: {
    id: string;
    patientName: string;
    patientAvatar: string;
    time: string;
  },
): PatientInQueue {
  const fallbackName = appointment.patientName || 'Patient';

  return {
    id: patient?.id ?? `patient-${appointment.id}`,
    appointmentId: appointment.id,
    name: patient?.name ?? fallbackName,
    gender: patient?.gender ?? 'Patient',
    age: patient?.age ?? 0,
    urgency: urgencyFromSeverity(patient?.severity),
    timeSlot: appointment.time,
    aiSummary:
      patient?.aiSummary.summary ??
      'AI summary will appear here when patient triage details are available.',
    avatarUri: patient?.avatarUri ?? appointment.patientAvatar,
  };
}

function deriveHomeDashboard(
  doctorName: string,
  patients: DoctorPatientProfile[],
  appointments: Array<{
    id: string;
    patientName: string;
    patientAvatar: string;
    date: string;
    time: string;
    status: 'upcoming' | 'completed' | 'cancelled';
  }>,
): DoctorHomeDashboard {
  const todayLabel = formatTodayLabel();
  const patientsByName = new Map(
    patients.map((patient) => [normalizeName(patient.name), patient]),
  );

  const todaysAppointments = appointments.filter(
    (appointment) =>
      appointment.date === todayLabel && appointment.status !== 'cancelled',
  );

  const todaysPatients = todaysAppointments.map((appointment) =>
    patientsByName.get(normalizeName(appointment.patientName)),
  );

  const patientsQueue = todaysAppointments
    .filter((appointment) => appointment.status === 'upcoming')
    .map((appointment) =>
      buildQueueItem(
        patientsByName.get(normalizeName(appointment.patientName)),
        appointment,
      ),
    );

  return {
    doctorName,
    isNewUser: false,
    stats: {
      totalPatients: todaysAppointments.length,
      emergencyCount: todaysPatients.filter(
        (patient) => patient?.severity === 'emergency',
      ).length,
      seenCount: todaysAppointments.filter(
        (appointment) => appointment.status === 'completed',
      ).length,
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

  async function load() {
    setStatus('loading');
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
    if (appointments.length === 0) {
      void load();
    }
  }, []);

  useEffect(() => {
    setHomeDashboard(derivedDashboard);
  }, [derivedDashboard, setHomeDashboard]);

  return {
    status,
    homeDashboard: derivedDashboard,
    retry: load,
  };
}
