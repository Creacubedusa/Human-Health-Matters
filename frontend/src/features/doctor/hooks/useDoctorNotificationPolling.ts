import { useCallback, useEffect, useRef } from 'react';
import { AppState, Vibration } from 'react-native';
import { useRouter } from 'expo-router';
import { toast } from '@shared/components/ui/toast';
import { fetchDoctorNotifications } from '../services/doctorNotification.service';
import { useDoctorNotificationStore } from '../store/doctorNotification.store';

const POLL_INTERVAL_MS = 30_000; // 30 seconds

/**
 * Polls for new doctor notifications every 30 seconds.
 * When an instant appointment notification arrives, vibrates the device
 * and shows an in-app toast alert.
 */
export function useDoctorNotificationPolling() {
    const router = useRouter();
    const setNotifications = useDoctorNotificationStore((s) => s.setNotifications);
    const seenIdsRef = useRef<Set<string>>(new Set());
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const initialLoadDoneRef = useRef(false);

    const poll = useCallback(async () => {
        try {
            const notifications = await fetchDoctorNotifications();
            setNotifications(notifications);

            // On first load, just record existing IDs without alerting
            if (!initialLoadDoneRef.current) {
                initialLoadDoneRef.current = true;
                notifications.forEach((n) => seenIdsRef.current.add(n.id));
                return;
            }

            // Check for new unread notifications we haven't seen
            const newNotifications = notifications.filter(
                (n) => !n.isRead && !seenIdsRef.current.has(n.id),
            );

            // Mark all as seen
            notifications.forEach((n) => seenIdsRef.current.add(n.id));

            if (newNotifications.length === 0) return;

            // Check if any are instant appointment notifications
            const instantAppointment = newNotifications.find(
                (n) => n.type === 'consultation' && n.metadata?.appointmentId,
            );

            if (instantAppointment) {
                // Vibrate to alert the doctor
                Vibration.vibrate([0, 300, 100, 300]);
                toast.info(instantAppointment.message || 'A patient is waiting for a consultation');
            } else {
                // Generic new notification alert
                toast.info(newNotifications[0].message || 'You have a new notification');
            }
        } catch {
            // Silently ignore polling errors
        }
    }, [setNotifications]);

    useEffect(() => {
        // Initial fetch
        void poll();

        // Start polling
        intervalRef.current = setInterval(() => void poll(), POLL_INTERVAL_MS);

        // Pause polling when app is in background, resume on foreground
        const subscription = AppState.addEventListener('change', (state) => {
            if (state === 'active') {
                void poll();
                if (!intervalRef.current) {
                    intervalRef.current = setInterval(() => void poll(), POLL_INTERVAL_MS);
                }
            } else {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            }
        });

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            subscription.remove();
        };
    }, [poll]);
}
