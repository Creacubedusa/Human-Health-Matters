import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { primitiveColors } from '@design/tokens';
import { format } from 'date-fns';
import { fetchDoctorConsultations, type DoctorAppointment } from '../services/doctor.service';

function patientName(a: DoctorAppointment) {
  const p = a.patient;
  const name = [p?.firstName, p?.lastName].filter(Boolean).join(' ');
  return name || 'Patient';
}

export function DoctorConsultationsView() {
  const { t } = useTranslation();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [items, setItems] = useState<DoctorAppointment[]>([]);

  async function load() {
    setStatus('loading');
    try {
      const data = await fetchDoctorConsultations();
      setItems(data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const upcoming = useMemo(
    () => items.filter((i) => i.status === 'UPCOMING'),
    [items],
  );

  if (status === 'loading') {
    return (
      <SafeAreaView className="flex-1 bg-bg-default items-center justify-center">
        <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView className="flex-1 bg-bg-default items-center justify-center px-6">
        <Text className="text-s2 text-text-primary text-center">{t('doctorConsultations.error')}</Text>
        <Pressable
          className="mt-4 bg-action-primary rounded-lg px-6 py-3"
          onPress={load}
          accessibilityRole="button"
        >
          <Text className="text-btn-medium text-white">{t('common.retry')}</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg-default">
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="pt-6 pb-4">
          <Text className="text-h5 text-text-primary">{t('doctorConsultations.title')}</Text>
          <Text className="text-b3 text-text-secondary mt-1">
            {t('doctorConsultations.subtitle', { count: upcoming.length })}
          </Text>
        </View>

        {items.length === 0 ? (
          <View className="items-center py-12">
            <Text className="text-b1 text-text-secondary">{t('doctorConsultations.empty')}</Text>
          </View>
        ) : (
          items.map((a) => {
            const starts = new Date(a.startsAt);
            const date = format(starts, 'MMM d, yyyy');
            const time = format(starts, 'h:mm a');
            const statusLabel =
              a.status === 'CANCELLED'
                ? t('doctorConsultations.statusCancelled')
                : a.status === 'COMPLETED'
                  ? t('doctorConsultations.statusCompleted')
                  : t('doctorConsultations.statusUpcoming');
            return (
              <View
                key={a.id}
                className="bg-bg-surface border border-border-default rounded-xl p-4 mb-3"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-b2 text-text-primary">{patientName(a)}</Text>
                  <Text className="text-c2 text-text-tertiary">{statusLabel}</Text>
                </View>
                <Text className="text-b3 text-text-secondary mt-1">
                  {t('doctorConsultations.when', { date, time })}
                </Text>

                {a.status === 'UPCOMING' && (
                  <Pressable
                    className="mt-3 bg-action-primary rounded-lg px-4 py-3 items-center"
                    onPress={() => router.push({ pathname: '/(doctor)/consultation', params: { appointmentId: a.id } })}
                    accessibilityRole="button"
                  >
                    <Text className="text-btn-medium text-white">
                      {t('doctorConsultations.joinCall', { defaultValue: 'Join call' })}
                    </Text>
                  </Pressable>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

