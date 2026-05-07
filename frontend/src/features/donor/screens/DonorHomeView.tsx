import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { useDonorHome } from '../hooks/useDonorHome';
import type { DonorLiveActivity } from '../types/donor.types';

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? '').toUpperCase();
}

export function DonorHomeView() {
  const { t } = useTranslation();
  const router = useRouter();
  const { status, dashboard, retry } = useDonorHome();
  const liveBadgePulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(liveBadgePulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(liveBadgePulse, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [liveBadgePulse]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <View className="bg-primary-50 h-[66px]" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
          <Text className="text-[14px] font-sans text-grey-500 mt-3">{t('common.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <View className="bg-primary-50 h-[66px]" />
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Text className="text-[16px] font-semibold font-sans text-grey-900 text-center">
            {t('donorHome.errorMessage')}
          </Text>
          <Pressable
            className="bg-primary-500 rounded-xl px-6 py-3"
            onPress={retry}
            accessibilityRole="button"
          >
            <Text className="text-[14px] font-semibold font-sans text-white">{t('common.retry')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!dashboard) return null;

  const initials = initialsFromName(dashboard.donorName);
  const poolFillPct = Math.min(Math.max(dashboard.poolProgress * 100, 0), 100);
  const liveBadgeScale = liveBadgePulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });
  const liveDotScale = liveBadgePulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.8],
  });
  const liveDotOpacity = liveBadgePulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0],
  });

  // ── Success ──────────────────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="bg-primary-50 h-[66px] justify-end">
        <View className="flex-row items-center justify-between px-4 pb-3 h-[48px]">
          {/* Avatar */}
          <Pressable
            onPress={() => router.push('/(donor)/profile')}
            accessibilityRole="button"
            accessibilityLabel={t('donorBottomNav.profile')}
            className="w-[30px] h-[30px] rounded-full bg-primary-100 items-center justify-center"
          >
            <Text className="text-[12px] font-semibold font-sans text-primary-500">{initials}</Text>
          </Pressable>

          {/* Title */}
          <Text className="text-[16px] font-semibold font-sans text-grey-900 absolute left-0 right-0 text-center pointer-events-none">
            {t('donorHome.title')}
          </Text>

          {/* Right: flag badge + bell */}
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => router.push('/(auth)/select-language')}
              accessibilityRole="button"
              accessibilityLabel={t('selectLanguage.headerTitle')}
              className="flex-row items-center gap-1 bg-grey-50 border border-grey-300 rounded-md px-2.5 py-0.5 h-6"
            >
              <Text className="text-[12px]">🇺🇸</Text>
              <Ionicons name="chevron-down" size={12} color={primitiveColors['grey-500']} />
            </Pressable>
            <Pressable
              onPress={() => router.push('/(donor)/notifications')}
              accessibilityRole="button"
              accessibilityLabel={t('donorHome.notifications')}
            >
              <Ionicons name="notifications" size={22} color={primitiveColors['grey-900']} />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-6 pb-32 gap-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View className="gap-1">
          <Text className="text-[12px] font-semibold font-sans text-grey-500">
            {t('donorHome.welcomeLabel')}
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-[16px] font-semibold font-sans text-grey-900">
              {t('donorHome.greeting', { name: dashboard.donorName })}
            </Text>
            <Text className="text-[16px]">👋</Text>
          </View>
        </View>

        {/* Care Funding Card */}
        <View className="bg-white border border-grey-200 rounded-2xl px-4 py-[17px] gap-[22px]">
          <View className="flex-row items-start justify-between">
            <View className="gap-2">
              <Text className="text-[12px] font-sans text-grey-500">
                {t('donorHome.careFundingLabel')}
              </Text>
              <Text className="text-[32px] font-semibold font-sans text-grey-900">
                ${dashboard.careFunding.toLocaleString()}
              </Text>
            </View>
            <Ionicons name="trending-up-outline" size={24} color={primitiveColors['green-500']} />
          </View>

          {/* Stat boxes */}
          <View className="flex-row gap-4">
            <View className="flex-1 bg-grey-50 border border-grey-200 rounded-2xl p-4 h-[110px] items-center justify-center gap-4">
              <Text className="text-[40px] font-semibold font-sans text-primary-500 leading-[48px]">
                {dashboard.patientsHelped}
              </Text>
              <Text className="text-[12px] font-sans text-grey-500 text-center">
                {t('donorHome.patientsHelpedLabel')}
              </Text>
            </View>
            <View className="flex-1 bg-grey-50 border border-grey-200 rounded-2xl p-4 h-[110px] items-center justify-center gap-4">
              <Text className="text-[40px] font-semibold font-sans text-green-500 leading-[48px]">
                {dashboard.impactRate}%
              </Text>
              <Text className="text-[12px] font-sans text-grey-500 text-center">
                {t('donorHome.impactRateLabel')}
              </Text>
            </View>
          </View>
        </View>

        {/* Fund Pool Status Card */}
        <View className="bg-white border border-grey-200 rounded-2xl p-4 gap-4">
          <View className="flex-row items-start justify-between">
            <View className="gap-2">
              <Text className="text-[12px] font-sans text-grey-500">
                {t('donorHome.poolStatusLabel')}
              </Text>
              <Text className="text-[32px] font-semibold font-sans text-grey-900">
                ${dashboard.poolBalance.toLocaleString()}
              </Text>
            </View>
            {/* Live badge */}
            <Animated.View
              className="flex-row items-center gap-1 bg-green-50 px-3 py-1.5 rounded-lg"
              style={{ transform: [{ scale: liveBadgeScale }] }}
            >
              <View className="relative h-2 w-2 items-center justify-center">
                <Animated.View
                  className="absolute h-2 w-2 rounded-full bg-green-500"
                  style={{
                    opacity: liveDotOpacity,
                    transform: [{ scale: liveDotScale }],
                  }}
                />
                <View className="h-2 w-2 rounded-full bg-green-500" />
              </View>
              <Text className="text-[12px] font-semibold font-sans text-green-500">
                {t('donorHome.poolLiveBadge')}
              </Text>
            </Animated.View>
          </View>

          {/* Progress bar */}
          <View className="gap-2">
            <View className="w-full h-2 bg-grey-100 rounded-full overflow-hidden">
              <View
                className="h-full bg-primary-500 rounded-full"
                style={{ width: `${poolFillPct}%` }}
              />
            </View>
            <Text className="text-[14px] font-medium font-sans text-grey-900">
              {t('donorHome.poolStatusCaption')}
            </Text>
          </View>
        </View>

        {/* Donate to pool button */}
        <Button
          label={t('donorHome.donateBtn')}
          variant="filled"
          size="large"
          fullWidth
          iconRight={<Ionicons name="add" size={20} color={primitiveColors.white} />}
          onPress={() => router.push('/(donor)/donate')}
        />

        {/* Live Activity */}
        <View className="gap-4">
          <Text className="text-[16px] font-semibold font-sans text-grey-900">
            {t('donorHome.liveActivityTitle')}
          </Text>

          {dashboard.liveActivity.length === 0 ? (
            <View className="items-center py-10 gap-2">
              <Text className="text-[16px] font-sans text-grey-500">
                {t('donorHome.emptyActivity')}
              </Text>
              <Text className="text-[14px] font-sans text-grey-400 text-center">
                {t('donorHome.emptyActivityHint')}
              </Text>
            </View>
          ) : (
            <View className="gap-2">
              {dashboard.liveActivity.map((item: DonorLiveActivity) => (
                <View
                  key={item.id}
                  className="bg-white border border-grey-300 rounded-lg p-4 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center">
                      <Ionicons name="heart" size={20} color={primitiveColors['primary-500']} />
                    </View>
                    <View className="flex-1 gap-2">
                      <Text className="text-[14px] font-medium font-sans text-grey-900" numberOfLines={1}>
                        {item.diagnosis}
                      </Text>
                      <Text className="text-[12px] font-sans text-grey-500" numberOfLines={1}>
                        {item.patientType}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end gap-3">
                    <Text className="text-[16px] font-semibold font-sans text-green-500">
                      ${item.amount}
                    </Text>
                    <Text className="text-[10px] font-medium font-sans text-grey-500">
                      {item.timeLabel}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
