import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { kvDelete } from '@shared/storage/kv';
import { useAuthStore } from '@shared/store/auth.store';
import { useDoctorStore } from '../store/doctor.store';
import { fetchDoctorProfile } from '../services/doctor.service';

const TOKEN_KEY = 'hhm_access_token';

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
  return (first + last).toUpperCase() || '?';
}

export function DoctorProfileView() {
  const { t } = useTranslation();
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const clearDashboard = useDoctorStore((s) => s.clearDashboard);

  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [name, setName] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [bio, setBio] = useState<string | null>(null);

  const initials = useMemo(() => initialsFromName(name || t('doctorProfile.initialsFallback')), [name, t]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setStatus('loading');
      try {
        const res = await fetchDoctorProfile();
        const fullName = [res.user?.firstName, res.user?.lastName].filter(Boolean).join(' ');
        if (!mounted) return;
        setName(fullName);
        setAvatarUri(res.profile?.avatarUri ?? null);
        setSpecialties(res.profile?.specialties ?? []);
        setBio(res.profile?.bio ?? null);
        setStatus('success');
      } catch {
        if (mounted) setStatus('error');
      }
    }
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  async function onLogout() {
    Alert.alert(
      t('doctorProfile.logoutTitle'),
      t('doctorProfile.logoutSubtitle'),
      [
        { text: t('doctorProfile.logoutCancel'), style: 'cancel' },
        {
          text: t('doctorProfile.logoutConfirm'),
          style: 'destructive',
          onPress: async () => {
            clearAuth();
            clearDashboard();
            await kvDelete(TOKEN_KEY);
            await kvDelete('app_role');
            router.replace('/(auth)/patient-get-started');
          },
        },
      ],
    );
  }

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
        <Text className="text-s2 text-text-primary text-center">{t('doctorProfile.error')}</Text>
        <Pressable
          className="mt-4 bg-action-primary rounded-lg px-6 py-3"
          onPress={() => router.replace('/(doctor)/profile')}
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
        <View className="pt-6 pb-4 flex-row items-center justify-between">
          <Text className="text-h5 text-text-primary">{t('doctorProfile.title')}</Text>
          <Pressable
            onPress={() => router.push('/(auth)/doctor-onboarding')}
            accessibilityRole="button"
          >
            <Text className="text-b2 text-primary-500">{t('doctorProfile.edit')}</Text>
          </Pressable>
        </View>

        <View className="bg-bg-surface border border-border-default rounded-xl p-5">
          <View className="flex-row items-center gap-4">
            <View className="w-14 h-14 rounded-full bg-primary-100 items-center justify-center overflow-hidden">
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={{ width: 56, height: 56 }} contentFit="cover" />
              ) : (
                <Text className="text-h5 font-semibold font-sans text-primary-600">
                  {initials}
                </Text>
              )}
            </View>

            <View className="flex-1">
              <Text className="text-s2 text-text-primary">{name || t('doctorProfile.nameFallback')}</Text>
              <Text className="text-b3 text-text-secondary mt-0.5">
                {specialties.length > 0 ? specialties.join(', ') : t('doctorProfile.specialtiesEmpty')}
              </Text>
            </View>
          </View>

          {bio ? (
            <View className="mt-4">
              <Text className="text-b2 text-text-primary">{t('doctorProfile.bioLabel')}</Text>
              <Text className="text-b3 text-text-secondary mt-1">{bio}</Text>
            </View>
          ) : null}
        </View>

        <View className="mt-8">
          <Button
            label={t('doctorProfile.logout')}
            onPress={onLogout}
            variant="outline"
            size="large"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

