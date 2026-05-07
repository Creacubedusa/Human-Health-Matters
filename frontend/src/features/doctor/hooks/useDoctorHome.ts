import { useEffect, useMemo, useState } from 'react';
import {
  fetchDoctorManagedAppointments,
  fetchDoctorProfile,
  type DoctorProfileResponse,
} from '../services/doctor.service';
import { useDoctorAppointmentsStore } from '../store/doctorAppointments.store';
import { useDoctorStore } from '../store/doctor.store';
import type { DoctorHomeDashboard, PatientInQueue } from '../types/doctor.types';

type Status = 'loading' | 'error' | 'success';

interface UseDoctorHomeResult {
  status: Status;
  refreshing: boolean;
  homeDashboard: DoctorHomeDashboard | null;
  doctorAvatar: string | null;
  retry: () => void;
  refresh: () => Promise<void>;
}

function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function endOfToday(): number {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

function buildQueueItem(appointment: {
  id: string;
  patientId?: string;
  patientName: string;
  patientAvatar: string;
  time: string;
}): PatientInQueue {
  return {
    id: appointment.patientId ?? `patient-${appointment.id}`,
    appointmentId: appointment.id,
    name: appointment.patientName || 'Patient',
    gender: 'Patient',
    age: 0,
    urgency: 'emergency',
    timeSlot: appointment.time,
    aiSummary:
      'Open the consultation to assess the patient and complete the visit.',
    avatarUri: appointment.patientAvatar,
  };
}

function deriveHomeDashboard(
  doctorName: string,
  appointments: Array<{
    id: string;
    patientId?: string;
    patientName: string;
    patientAvatar: string;
    startsAt: string;
    endsAt: string;
    date: string;
    time: string;
    status: 'upcoming' | 'completed' | 'cancelled';
  }>,
): DoctorHomeDashboard {
  const todayStart = startOfToday();
  const todayEnd = endOfToday();

  const activeAppointments = appointments.filter(
    (appointment) => appointment.status !== 'cancelled',
  );

  const todaysAppointments = activeAppointments.filter((appointment) => {
    const startMs = new Date(appointment.startsAt).getTime();
    return startMs >= todayStart && startMs <= todayEnd;
  });

  const completedAppointments = activeAppointments.filter(
    (appointment) => appointment.status === 'completed',
  );

  const queueAppointments = activeAppointments
    .filter(
      (appointment) =>
        appointment.status === 'upcoming' &&
        new Date(appointment.endsAt).getTime() >= Date.now(),
    )
    .sort(
      (left, right) =>
        new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime(),
    );

  const patientsQueue = queueAppointments.map((appointment) =>
    buildQueueItem(appointment),
  );

  return {
    doctorName,
    isNewUser: false,
    stats: {
      totalPatients: todaysAppointments.length,
      emergencyCount: queueAppointments.length,
      seenCount: completedAppointments.length,
    },
    patientsQueue,
  };
}

export function useDoctorHome(): UseDoctorHomeResult {
  const { homeDashboard, setHomeDashboard } = useDoctorStore();
  const appointments = useDoctorAppointmentsStore((state) => state.appointments);
  const setAppointments = useDoctorAppointmentsStore((state) => state.setAppointments);
  const [profile, setProfile] = useState<DoctorProfileResponse | null>(null);
  const [status, setStatus] = useState<Status>(
    homeDashboard || appointments.length > 0 ? 'success' : 'loading',
  );
  const [refreshing, setRefreshing] = useState(false);

  const doctorName = useMemo(() => {
    const first = profile?.user?.firstName ?? '';
    const last = profile?.user?.lastName ?? '';
    const combined = [first, last].filter(Boolean).join(' ').trim();
    return combined || 'Doctor';
  }, [profile?.user?.firstName, profile?.user?.lastName]);

  const derivedDashboard = useMemo(
    () => deriveHomeDashboard(doctorName, appointments),
    [appointments, doctorName],
  );

  async function load(options?: { silent?: boolean }) {
    if (!options?.silent) {
      setStatus('loading');
    }
    try {
      const [appts, prof] = await Promise.all([
        fetchDoctorManagedAppointments(),
        fetchDoctorProfile().catch(() => null),
      ]);
      setAppointments(appts);
      if (prof) setProfile(prof);
      setStatus('success');
    } catch {
      if (appointments.length > 0) {
        setStatus('success');
        return;
      }
      if (!options?.silent) setStatus('error');
    }
  }

  async function refresh() {
    setRefreshing(true);
    try {
      await load({ silent: true });
    } finally {
      setRefreshing(false);
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
    refreshing,
    homeDashboard: derivedDashboard,
    doctorAvatar: profile?.profile?.avatarUri ?? null,
    retry: () => {
      void load();
    },
    refresh,
  };
}
