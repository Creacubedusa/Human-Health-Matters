import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { saveToWishlist } from '../services/triage.service';
import { TriageResultCard } from '../components/TriageResultCard';
import type { TriageResult } from '../types/triage.types';

export interface TriageResultViewProps {
  onBack: () => void;
  onClose: () => void;
  onConnectDoctor: () => void;
  result: TriageResult;
}

export function TriageResultView({
  onBack,
  onClose,
  onConnectDoctor,
  result,
}: TriageResultViewProps) {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isEmergency = result.severity === 'emergency' || result.severity === 'urgent';

  async function handleSaveWishlist() {
    setSaving(true);
    await saveToWishlist(result);
    setSaving(false);
    setSaved(true);
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="h-[66px] flex-row items-center justify-between px-4 border-b border-grey-100">
        <Pressable
          onPress={onBack}
          className="w-[29px] h-[29px] rounded-lg bg-grey-50 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <Ionicons name="chevron-back" size={20} color={primitiveColors['grey-900']} />
        </Pressable>

        <Text className="text-[16px] font-semibold font-sans text-grey-900">
          {t('nuraAI.triageResultTitle')}
        </Text>

        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Ionicons name="close" size={22} color={primitiveColors['grey-700']} />
        </Pressable>
      </View>

      {/* Scrollable content */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-4 pb-32 gap-4"
        showsVerticalScrollIndicator={false}
      >
        <TriageResultCard result={result} />
      </ScrollView>

      {/* Sticky CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-grey-100 px-5 py-6">
        {isEmergency ? (
          <Pressable
            onPress={onConnectDoctor}
            className="bg-primary-500 rounded-full h-12 items-center justify-center"
            accessibilityRole="button"
          >
            <Text className="text-[15px] font-semibold font-sans text-white">
              {t('nuraAI.connectDoctor')}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleSaveWishlist}
            disabled={saving || saved}
            className={[
              'rounded-full h-12 items-center justify-center flex-row gap-2',
              saved ? 'bg-green-500' : 'bg-primary-500',
            ].join(' ')}
            accessibilityRole="button"
          >
            {saving ? (
              <ActivityIndicator size="small" color={primitiveColors.white} />
            ) : (
              <Text className="text-[15px] font-semibold font-sans text-white">
                {saved ? t('nuraAI.wishlistSaved') : t('nuraAI.saveWishlist')}
              </Text>
            )}
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
