import { ActivityIndicator, KeyboardAvoidingView, Platform, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import { ScreenHeader } from '@shared/components/ui/ScreenHeader';
import { useDoctorPatients } from '../hooks/useDoctorPatients';
import { DoctorPatientCard } from '../components/patients/DoctorPatientCard';
import { DoctorPatientEmptyState } from '../components/patients/DoctorPatientEmptyState';

export function DoctorPatientsView() {
  const { t } = useTranslation();
  const router = useRouter();
  const { status, refreshing, query, setQuery, patients, refresh } = useDoctorPatients();

  if (status === 'loading') {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
      </SafeAreaView>
    );
  }

  const hasResults = patients.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreenHeader title={t('doctorPatients.headerTitle')} fallbackHref="/(doctor)" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pt-6 pb-24 gap-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void refresh()}
              tintColor={primitiveColors['primary-500']}
              colors={[primitiveColors['primary-500']]}
            />
          }
        >
          <View className="flex-row items-center gap-3 rounded-xl border-[1.5px] border-grey-200 bg-white px-3 py-3">
            <Ionicons name="search" size={22} color={primitiveColors['grey-500']} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('doctorPatients.searchPlaceholder')}
              placeholderTextColor={primitiveColors['grey-400']}
              className="flex-1 p-0 text-b1 font-sans text-grey-900"
            />
          </View>

          <View>
            <Text className="text-s2 font-semibold font-sans text-grey-900">
              {t('doctorPatients.listTitle')}
            </Text>
          </View>

          {hasResults ? (
            patients.map((patient, index) => (
              <DoctorPatientCard
                key={patient.id}
                patient={patient}
                onViewPatient={(patientId) => router.push(`/(doctor)/patients/${patientId}`)}
                showSummary={index < 2}
              />
            ))
          ) : (
            <DoctorPatientEmptyState searching={query.trim().length > 0} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
