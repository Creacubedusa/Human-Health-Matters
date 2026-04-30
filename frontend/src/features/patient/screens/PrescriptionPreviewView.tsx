import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { AppointmentBookingHeader } from '../components/booking/AppointmentBookingHeader';
import { usePrescriptions } from '../hooks/usePrescriptions';

// Mock patient data — replace with real patient profile store when available
const MOCK_PATIENT = {
  name: 'Angela Dairo',
  dob: 'Jun 12, 1988',
  memberId: 'U98765432100',
};

export interface PrescriptionPreviewViewProps {
  prescriptionId: string;
  onBack: () => void;
}

export function PrescriptionPreviewView({
  prescriptionId,
  onBack,
}: PrescriptionPreviewViewProps) {
  const { t } = useTranslation();
  const { status, getDetailById, simulateDownload, isDownloading, downloadSuccess } =
    usePrescriptions();
  const detail = getDetailById(prescriptionId);

  const header = (
    <AppointmentBookingHeader title={t('prescription.detail.headerTitle')} onBack={onBack} />
  );

  if (status === 'loading') {
    return (
      <SafeAreaView edges={['bottom']} className="flex-1 bg-surface">
        {header}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView edges={['bottom']} className="flex-1 bg-surface">
        {header}
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Text className="text-b3 font-sans text-grey-700 text-center">
            {t('prescription.preview.errorMessage')}
          </Text>
          <Button label={t('common.retry')} onPress={onBack} size="medium" />
        </View>
      </SafeAreaView>
    );
  }

  if (!detail) {
    return (
      <SafeAreaView edges={['bottom']} className="flex-1 bg-surface">
        {header}
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-b3 font-sans text-grey-500 text-center">
            {t('prescription.preview.emptyMessage')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const refillDisplay = `${detail.totalRefills - detail.refillsLeft} of ${detail.totalRefills}`;
  const quantityDisplay = `${detail.quantity ?? 30} ${detail.quantityUnit ?? 'tablets'}`;

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-surface">
      {header}

      <ScrollView
        contentContainerClassName="px-4 pt-6 pb-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Document card */}
        <View className="border border-grey-200 rounded-2xl overflow-hidden">

          {/* ── Header section: bg-primary-50 ── */}
          <View className="bg-primary-50 px-5 py-4">
            <View className="flex-row items-start justify-between">
              <View className="gap-1 flex-1">
                <Text className="text-label font-medium font-sans text-grey-500 uppercase">
                  {t('prescription.preview.label')}
                </Text>
                <Text className="text-s2 font-semibold font-sans text-grey-900">
                  {detail.medication.split(' ')[0]}
                </Text>
                <Text className="text-c1 font-sans text-grey-500">
                  {detail.brandName} · {detail.dosage} · Tablet
                </Text>
              </View>
              <View className="items-end gap-1">
                <Text className="text-label font-medium font-sans text-grey-500 uppercase">
                  {t('prescription.preview.rxNoLabel')}
                </Text>
                <Text className="text-b2 font-medium font-sans text-grey-900 text-right">
                  {detail.rxNumber}
                </Text>
              </View>
            </View>
          </View>

          {/* ── Patient / Physician section ── */}
          <View className="bg-white border-b border-grey-300 px-5 py-8">
            <View className="flex-row items-start justify-between">
              {/* Patient */}
              <View className="gap-1 flex-1">
                <Text className="text-label font-medium font-sans text-grey-500 uppercase">
                  {t('prescription.preview.patientSection')}
                </Text>
                <Text className="text-s2 font-semibold font-sans text-grey-900">
                  {MOCK_PATIENT.name}
                </Text>
                <Text className="text-c1 font-sans text-grey-500">
                  {t('prescription.preview.dob')}: {MOCK_PATIENT.dob}
                </Text>
                <Text className="text-c1 font-sans text-grey-500">
                  {t('prescription.preview.memberId')} · {MOCK_PATIENT.memberId}
                </Text>
              </View>

              {/* Physician */}
              <View className="gap-1 items-end">
                <Text className="text-label font-medium font-sans text-grey-500 uppercase">
                  {t('prescription.preview.physicianSection')}
                </Text>
                <Text className="text-s2 font-semibold font-sans text-grey-900 text-right">
                  {detail.doctorName}
                </Text>
                <Text className="text-c1 font-sans text-grey-500 text-right">
                  {detail.specialty}
                </Text>
                <Text className="text-c1 font-sans text-grey-500 text-right">
                  Lic: {detail.licenseNo}
                </Text>
              </View>
            </View>
          </View>

          {/* ── Quantity / Refills + Issued / Expires ── */}
          <View className="bg-white px-5 py-4 gap-4">
            <View className="flex-row items-start justify-between">
              <View className="gap-1">
                <Text className="text-label font-medium font-sans text-grey-500 uppercase">
                  {t('prescription.preview.quantity')}
                </Text>
                <Text className="text-s2 font-semibold font-sans text-grey-900">
                  {quantityDisplay}
                </Text>
              </View>
              <View className="gap-1 items-end">
                <Text className="text-label font-medium font-sans text-grey-500 uppercase">
                  {t('prescription.preview.refills')}
                </Text>
                <Text className="text-s2 font-semibold font-sans text-grey-900 text-right">
                  {refillDisplay}
                </Text>
              </View>
            </View>

            <View className="flex-row items-start justify-between">
              <View className="gap-1">
                <Text className="text-label font-medium font-sans text-grey-500 uppercase">
                  {t('prescription.preview.issued')}
                </Text>
                <Text className="text-s2 font-semibold font-sans text-grey-900">
                  {detail.issuedDate}
                </Text>
              </View>
              <View className="gap-1 items-end">
                <Text className="text-label font-medium font-sans text-grey-500 uppercase">
                  {t('prescription.preview.expiry')}
                </Text>
                <Text className="text-s2 font-semibold font-sans text-grey-900 text-right">
                  {detail.expiresDate}
                </Text>
              </View>
            </View>
          </View>

          {/* ── Direction for use: bg-blue-50 ── */}
          <View className="bg-blue-50 px-4 py-4 gap-1">
            <Text className="text-s2 font-semibold font-sans text-grey-900">
              {t('prescription.preview.directionsTitle')}
            </Text>
            <Text className="text-b4 font-medium font-sans text-grey-500 leading-relaxed">
              {detail.directions}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed footer */}
      <View className="px-4 pt-4 pb-8 bg-surface border-t border-grey-100 gap-3">
        {downloadSuccess && (
          <View className="bg-green-50 rounded-sm px-4 py-3">
            <Text className="text-b4 font-medium font-sans text-green-700 text-center">
              {t('prescription.preview.downloadSuccess')}
            </Text>
          </View>
        )}
        <Button
          label={t('prescription.preview.downloadBtn')}
          variant="filled"
          size="large"
          fullWidth
          disabled={isDownloading}
          onPress={simulateDownload}
        />
      </View>
    </SafeAreaView>
  );
}
