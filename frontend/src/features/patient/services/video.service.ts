import { http } from '@shared/api/http';

export type JoinVideoResponse = {
  appointmentId: string;
  roomName: string;
  roomUrl: string;
  token: string;
  expiresAt: string;
};

export async function joinAppointmentVideo(appointmentId: string): Promise<JoinVideoResponse> {
  const res = await http.post<JoinVideoResponse>(`/video/appointments/${appointmentId}/join`);
  return res.data;
}

export function buildDailyJoinUrl(roomUrl: string, token: string) {
  const url = new URL(roomUrl);
  url.searchParams.set('t', token);
  return url.toString();
}

