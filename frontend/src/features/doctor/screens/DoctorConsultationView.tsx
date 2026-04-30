import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { toast } from '@shared/components/ui/toast';
import { buildDailyJoinUrl, joinAppointmentVideo } from '@features/patient/services/video.service';
import { InAppCallWebView } from '@shared/components/ui/InAppCallWebView';

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

  if (meetingUrl) {
    return <InAppCallWebView url={meetingUrl} onBack={onBack} />;
  }

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
        ) : status === 'error' ? (
          <>
            <Text className="text-white/80 text-center font-sans">
              {t('consultation.unableToJoin', { defaultValue: 'Unable to join call.' })}
            </Text>
            <Pressable
              className="mt-2 border border-white/30 rounded-xl px-6 py-3"
              onPress={() => void handleJoin()}
              accessibilityRole="button"
            >
              <Text className="text-white font-semibold font-sans">{t('common.retry')}</Text>
            </Pressable>
          </>
        ) : (
          <Text className="text-white/80 text-center font-sans">
            {t('consultation.preparingCall', { defaultValue: 'Preparing your call…' })}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

