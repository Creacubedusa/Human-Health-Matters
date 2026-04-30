import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/components/ui/Button';
import { AppointmentBookingHeader } from '../components/booking/AppointmentBookingHeader';

export interface BookAppointmentViewProps {
  onBack: () => void;
  onSymptoms: () => void;
  onFollowUp: () => void;
}

export function BookAppointmentView({ onBack, onSymptoms, onFollowUp }: BookAppointmentViewProps) {
  const { t } = useTranslation();

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-surface">
      <AppointmentBookingHeader
        title={t('appointmentBooking.headers.default')}
        onBack={onBack}
      />
      <View className="flex-1 px-4 pt-20 gap-6">
        <View className="gap-2">
          <Text className="text-h4 font-semibold font-sans text-grey-900">
            {t('appointmentBooking.intent.title')}
          </Text>
          <Text className="text-b2 font-medium font-sans text-grey-500">
            {t('appointmentBooking.intent.subtitle')}
          </Text>
        </View>
        <View className="gap-4">
          <Button
            variant="filled"
            size="large"
            fullWidth
            label={t('appointmentBooking.intent.symptoms')}
            onPress={onSymptoms}
          />
          <Button
            variant="outline"
            size="large"
            fullWidth
            label={t('appointmentBooking.intent.followUp')}
            onPress={onFollowUp}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
