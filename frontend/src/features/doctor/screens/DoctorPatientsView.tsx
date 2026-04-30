import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { fetchDoctorPatients, type DoctorPatientListItem } from '../services/doctor.service';

export function DoctorPatientsView() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [patients, setPatients] = useState<DoctorPatientListItem[]>([]);

  async function load() {
    setStatus('loading');
    try {
      const data = await fetchDoctorPatients();
      setPatients(data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  useEffect(() => {
    void load();
  }, []);

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
        <Text className="text-s2 text-text-primary text-center">{t('doctorPatients.error')}</Text>
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
          <Text className="text-h5 text-text-primary">{t('doctorPatients.title')}</Text>
          <Text className="text-b3 text-text-secondary mt-1">{t('doctorPatients.subtitle')}</Text>
        </View>

        {patients.length === 0 ? (
          <View className="items-center py-12">
            <Text className="text-b1 text-text-secondary">{t('doctorPatients.empty')}</Text>
          </View>
        ) : (
          patients.map((p) => (
            <View
              key={p.id}
              className="bg-bg-surface border border-border-default rounded-xl p-4 mb-3"
            >
              <Text className="text-b2 text-text-primary">{p.name || t('doctorPatients.nameFallback')}</Text>
              <Text className="text-c1 text-text-tertiary mt-1">
                {t('doctorPatients.lastVisit', { date: p.lastVisit })}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

