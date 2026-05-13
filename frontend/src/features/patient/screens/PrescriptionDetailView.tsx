import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { AppointmentBookingHeader } from '../components/booking/AppointmentBookingHeader';
import { PrescriptionDetailRow } from '../components/prescription/PrescriptionDetailRow';
import { PrescriptionDirectionsCard } from '../components/prescription/PrescriptionDirectionsCard';
import { usePrescriptions } from '../hooks/usePrescriptions';
import type { PrescriptionDetail } from '../types/prescription.types';

export interface PrescriptionDetailViewProps {
  prescriptionId: string;
  onBack: () => void;
  onPreview: (id: string) => void;
}

export function PrescriptionDetailView({
  prescriptionId,
  onBack,
  onPreview,
}: PrescriptionDetailViewProps) {
  const { t } = useTranslation();
  const { status, fetchDetail } = usePrescriptions();
  const [detail, setDetail] = useState<PrescriptionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void fetchDetail(prescriptionId).then((value) => {
      if (cancelled) return;
      setDetail(value);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [prescriptionId, fetchDetail]);

  const header = (
    <AppointmentBookingHeader title={t('prescription.detail.headerTitle')} onBack={onBack} />
  );

  if (loading || status === 'loading') {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-surface">
        {header}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-surface">
        {header}
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Text className="text-b3 font-sans text-grey-700 text-center">
            {t('prescription.detail.errorMessage')}
          </Text>
          <Button label={t('common.retry')} onPress={onBack} size="medium" />
        </View>
      </SafeAreaView>
    );
  }

  if (!detail) {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-surface">
        {header}
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-b3 font-sans text-grey-500 text-center">
            {t('prescription.detail.emptyMessage')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const refillDisplay = String(detail.totalRefills);

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-surface">
      {header}

      <ScrollView
        contentContainerClassName="px-4 pt-6 pb-6 gap-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Page title */}
        <Text className="text-h5 font-semibold font-sans text-grey-900">
          {t('prescription.detail.pageTitle')}
        </Text>

        {/* Grey info card */}
        <View className="bg-grey-50 rounded-2xl px-5 py-1">
          <PrescriptionDetailRow
            label={t('prescription.detail.medication')}
            value={detail.medication}
          />
          <PrescriptionDetailRow
            label={t('prescription.detail.brandName')}
            value={detail.brandName}
          />
          <PrescriptionDetailRow
            label={t('prescription.detail.dosage')}
            value={detail.dosage}
          />
          <PrescriptionDetailRow
            label={t('prescription.detail.sig')}
            value={detail.sig}
          />
          <PrescriptionDetailRow
            label={t('prescription.detail.prescriber')}
            value={`Dr. ${detail.doctorName}`}
          />
          <PrescriptionDetailRow
            label={t('prescription.detail.specialty')}
            value={detail.specialty}
          />
          <PrescriptionDetailRow
            label={t('prescription.detail.licenseNo')}
            value={detail.licenseNo}
          />
          <PrescriptionDetailRow
            label={t('prescription.detail.issued')}
            value={detail.issuedDate}
          />
          <PrescriptionDetailRow
            label={t('prescription.detail.expires')}
            value={detail.expiresDate}
          />
          <PrescriptionDetailRow
            label={t('prescription.detail.refills')}
            value={refillDisplay}
          />
          <PrescriptionDetailRow
            label={t('prescription.detail.rxNumber')}
            value={detail.rxNumber}
          />
        </View>

        {/* Direction for use */}
        <PrescriptionDirectionsCard
          title={t('prescription.detail.directionsTitle')}
          body={detail.directions}
        />
      </ScrollView>

      {/* Fixed footer CTA */}
      <View className="px-4 pt-4 pb-8 bg-surface border-t border-grey-100">
        <Button
          label={t('prescription.detail.previewBtn')}
          variant="filled"
          size="large"
          fullWidth
          onPress={() => onPreview(detail.id)}
        />
      </View>
    </SafeAreaView>
  );
}
