import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Alert } from '@shared/components/ui/Alert';
import { Button } from '@shared/components/ui/Button';
import { AppointmentBookingHeader } from '../components/booking/AppointmentBookingHeader';
import { PrescriptionDetailRow } from '../components/prescription/PrescriptionDetailRow';
import { OrderUploadZone } from '../components/order/OrderUploadZone';
import { OrderFileCard } from '../components/order/OrderFileCard';
import { useOrders } from '../hooks/useOrders';
import type { UploadedFile } from '../types/order.types';

export interface OrderDetailViewProps {
  orderId: string;
  onBack: () => void;
}

export function OrderDetailView({ orderId, onBack }: OrderDetailViewProps) {
  const { t } = useTranslation();
  const {
    status,
    getDetailById,
    simulateUpload,
    isUploading,
    uploadSuccess,
    uploadedFile,
    setUploadedFile,
    clearUpload,
  } = useOrders();

  const detail = getDetailById(orderId);

  const header = (
    <AppointmentBookingHeader title={t('order.detail.headerTitle')} onBack={onBack} />
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
            {t('order.detail.errorMessage')}
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
            {t('order.detail.emptyMessage')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const uploadLabels = {
    ctaHighlight: t('order.detail.uploadCta'),
    ctaRest: t('order.detail.uploadCtaRest'),
    maxSize: t('order.detail.uploadMaxSize'),
    maxSizeValue: '15MB',
  };

  function handleFileSelected(file: UploadedFile) {
    setUploadedFile(file);
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-surface">
      {header}
      <ScrollView
        contentContainerClassName="px-4 pt-6 pb-8 gap-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Personal details */}
        <View className="gap-4">
          <Text className="text-h5 font-semibold font-sans text-grey-900">
            {t('order.detail.personalDetailsTitle')}
          </Text>
          <View className="bg-grey-50 rounded-2xl px-5 py-1">
            <PrescriptionDetailRow label={t('order.detail.orderId')} value={detail.orderId} />
            <PrescriptionDetailRow label={t('order.detail.patientName')} value={detail.patientName} />
            <PrescriptionDetailRow label={t('order.detail.requestingDoctor')} value={detail.orderedBy} />
            <PrescriptionDetailRow label={t('order.detail.specialisation')} value={detail.specialisation} />
            <View className="flex-row items-center justify-between gap-4 py-3">
              <Text className="text-b4 font-medium font-sans text-grey-500 shrink-0">
                {t('order.detail.status')}
              </Text>
              <Text className="text-s2 font-semibold font-sans text-yellow-500 text-right flex-1">
                {detail.status.charAt(0).toUpperCase() + detail.status.slice(1)}
              </Text>
            </View>
            <PrescriptionDetailRow label={t('order.detail.date')} value={detail.date} />
          </View>
        </View>

        {/* Section 2: Additional Comment */}
        <Alert
          status="info"
          variant="outline"
          title={t('order.detail.additionalComment')}
          description={detail.additionalComment}
        />

        {/* Section 3: Test details */}
        <View className="gap-4">
          <Text className="text-h5 font-semibold font-sans text-grey-900">
            {t('order.detail.testDetailsTitle')}
          </Text>
          <View className="bg-grey-50 rounded-2xl px-5 py-1">
            <PrescriptionDetailRow label={t('order.detail.testType')} value={detail.testType} />
            <PrescriptionDetailRow label={t('order.detail.testName')} value={detail.testName} />
            <PrescriptionDetailRow label={t('order.detail.sampleType')} value={detail.sampleType} />
            <PrescriptionDetailRow
              label={t('order.detail.priority')}
              value={detail.priority === 'urgent' ? t('order.urgentLabel') : t('order.notUrgentLabel')}
            />
          </View>
        </View>

        {/* Section 4: Collection Instruction */}
        <Alert
          status="info"
          variant="outline"
          title={t('order.detail.collectionInstruction')}
          description={detail.collectionInstruction}
        />

        {/* Section 5: Upload Test Result */}
        <View className="gap-4">
          <Text className="text-s2 font-semibold font-sans text-grey-900">
            {t('order.detail.uploadSubtitle')}
          </Text>

          <OrderUploadZone onSelectFile={handleFileSelected} labels={uploadLabels} />

          {uploadedFile && (
            <OrderFileCard file={uploadedFile} onRemove={clearUpload} />
          )}

          {uploadedFile && (
            <View className="flex-row items-center justify-between gap-4">
              <Button
                label={t('order.detail.cancelBtn')}
                variant="outline"
                size="large"
                onPress={clearUpload}
              />
              <View className="flex-1">
                <Button
                  label={t('order.detail.saveBtn')}
                  variant="filled"
                  size="large"
                  fullWidth
                  disabled={isUploading}
                  onPress={simulateUpload}
                />
              </View>
            </View>
          )}

          {uploadSuccess && (
            <View className="bg-green-50 rounded-sm px-4 py-3">
              <Text className="text-b4 font-medium font-sans text-green-700 text-center">
                {t('order.detail.saveSuccess')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
