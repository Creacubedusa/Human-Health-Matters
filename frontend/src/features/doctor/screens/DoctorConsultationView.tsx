import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import * as Linking from 'expo-linking';
import { toast } from '@shared/components/ui/toast';
import { buildDailyJoinUrl, joinAppointmentVideo } from '@features/patient/services/video.service';

export interface DoctorConsultationViewProps {
  appointmentId: string;
  onBack: () => void;
  onEnded: () => void;
}

export function DoctorConsultationView({
  appointmentId,
  onBack,
}: DoctorConsultationViewProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'idle' | 'joining' | 'ready' | 'error'>('idle');
  const [meetingUrl, setMeetingUrl] = useState<string | null>(null);

  const canJoin = useMemo(() => Boolean(appointmentId), [appointmentId]);

  async function handleJoin() {
    if (!canJoin) {
      toast.error('Missing appointment id');
      return;
    }
    setStatus('joining');
    try {
      const join = await joinAppointmentVideo(appointmentId);
      const url = buildDailyJoinUrl(join.roomUrl, join.token);
      setMeetingUrl(url);
      setStatus('ready');
      await Linking.openURL(url);
    } catch (e: any) {
      const msg = String(e?.response?.data?.message ?? e?.response?.data ?? e?.message ?? '');
      if (msg.includes('too_early_to_join')) {
        toast.info('Too early to join. Try closer to the appointment time.');
      } else if (msg.includes('too_late_to_join')) {
        toast.warning('This appointment is no longer joinable.');
      } else {
        toast.error('Unable to join call. Please try again.');
      }
      setStatus('error');
    }
  }

  useEffect(() => {
    void handleJoin();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      <View className="px-4 pt-4 pb-3 flex-row items-center justify-between">
        <Pressable onPress={onBack} accessibilityRole="button">
          <Text className="text-white font-sans">{t('common.back')}</Text>
        </Pressable>
        <Text className="text-white font-semibold font-sans">
          {t('consultation.connecting', { defaultValue: 'Connecting to your patient…' })}
        </Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 items-center justify-center px-6 gap-4">
        {status === 'joining' ? (
          <>
            <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
            <Text className="text-white/80 text-center font-sans">
              {t('consultation.preparingCall', { defaultValue: 'Preparing your call…' })}
            </Text>
          </>
        ) : (
          <>
            <Text className="text-white/80 text-center font-sans">
              {t('consultation.videoPoweredByDaily', { defaultValue: 'Video call powered by Daily' })}
            </Text>
            <Pressable
              className="bg-primary-500 rounded-xl px-6 py-3"
              onPress={() => meetingUrl && void Linking.openURL(meetingUrl)}
              accessibilityRole="button"
              disabled={!meetingUrl}
              style={{ opacity: meetingUrl ? 1 : 0.6 }}
            >
              <Text className="text-white font-semibold font-sans">
                {t('consultation.openCall', { defaultValue: 'Open call' })}
              </Text>
            </Pressable>
            {status === 'error' && (
              <Pressable
                className="mt-2 border border-white/30 rounded-xl px-6 py-3"
                onPress={() => void handleJoin()}
                accessibilityRole="button"
              >
                <Text className="text-white font-semibold font-sans">
                  {t('common.retry')}
                </Text>
              </Pressable>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

