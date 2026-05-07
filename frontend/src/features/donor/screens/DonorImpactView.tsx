import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { DonorImpactPatientCard } from '../components/impact/DonorImpactPatientCard';
import { useDonorImpact } from '../hooks/useDonorImpact';

export function DonorImpactView() {
  const { t } = useTranslation();
  const { status, summary, retry } = useDonorImpact();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="bg-primary-50 px-5 py-4 items-center justify-center">
        <Text className="text-s1 font-semibold font-sans text-grey-900">
          {t('donorImpact.headerTitle')}
        </Text>
      </View>

      {/* Loading */}
      {status === 'loading' && (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
          <Text className="text-b2 font-sans text-grey-500">{t('common.loading')}</Text>
        </View>
      )}

      {/* Error */}
      {status === 'error' && (
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Ionicons name="alert-circle-outline" size={48} color={primitiveColors['grey-300']} />
          <Text className="text-b2 font-sans text-grey-500 text-center">
            {t('donorImpact.errorMessage')}
          </Text>
          <Button label={t('common.retry')} variant="outline" size="medium" onPress={() => void retry()} />
        </View>
      )}

      {/* Success */}
      {status === 'success' && summary != null && (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pt-6 pb-10 gap-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Total Impact card */}
          <View className="bg-primary-500 rounded-2xl px-4 py-4 gap-4">
            <Text className="text-b4 font-sans text-white/60">
              {t('donorImpact.totalImpactLabel')}
            </Text>
            <Text className="text-h3 font-semibold font-sans text-white">
              {`$${summary.totalImpact.toLocaleString()}`}
            </Text>
            <Text className="text-b3 font-medium font-sans text-white/80">
              {t('donorImpact.patientsSupported', { count: summary.patientsSupported })}
            </Text>
          </View>

          {/* Privacy notice — plain filled box, no border */}
          <View className="bg-blue-50 rounded-xl p-4">
            <Text className="text-b4 font-sans text-grey-500">
              {t('donorImpact.privacyNotice')}
            </Text>
          </View>

          {/* Patient Impact section */}
          <View className="gap-3">
            <Text className="text-s1 font-semibold font-sans text-grey-900">
              {t('donorImpact.patientImpactTitle')}
            </Text>

            {summary.patients.length === 0 ? (
              <View className="items-center py-10 gap-2">
                <Ionicons name="heart-outline" size={40} color={primitiveColors['grey-300']} />
                <Text className="text-b2 font-sans text-grey-400 text-center">
                  {t('donorImpact.emptyPatients')}
                </Text>
              </View>
            ) : (
              <View className="gap-2">
                {summary.patients.map((patient) => (
                  <DonorImpactPatientCard key={patient.id} patient={patient} />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
