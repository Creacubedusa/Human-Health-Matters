import type { Activity, PatientHomeDashboard } from '../types/patient.types';
import { http } from '@shared/api/http';
import { fetchAppointments } from './appointmentManagement.service';

export async function fetchPatientDashboard(): Promise<PatientHomeDashboard> {
  const res = await http.get<PatientHomeDashboard>('/patients/dashboard');
  const base = res.data;

  const appointments = await fetchAppointments();
  const joinId = appointments.find((a) => a.status === 'upcoming')?.id ?? '';
  const recentActivities: Activity[] = appointments
    .filter((a) => a.status !== 'cancelled')
    .slice(0, 6)
    .map((a) => {
      const status =
        a.status === 'completed'
          ? ('completed' as const)
          : a.id === joinId
            ? ('join' as const)
            : ('upcoming' as const);

      return {
        type: 'consultation' as const,
        id: a.id,
        title: `Consultation with ${a.doctorName}`,
        subtitle: a.specialty || 'Consultation',
        date: a.date,
        status,
        canJoin: a.status === 'upcoming' && a.id === joinId,
      };
    });

  const upcoming = appointments.find((a) => a.status === 'upcoming');
  const careInProgress =
    base.careInProgress && base.careInProgress.id
      ? base.careInProgress
      : upcoming
        ? {
            id: upcoming.id,
            title: 'Upcoming consultation',
            doctorName: upcoming.doctorName,
            specialty: upcoming.specialty,
            date: upcoming.date,
            isActive: true,
          }
        : base.careInProgress
          ? { ...base.careInProgress, id: 'care-in-progress' }
          : null;

  return {
    ...base,
    careInProgress,
    recentActivities: recentActivities.length > 0 ? recentActivities : base.recentActivities,
  };
}
