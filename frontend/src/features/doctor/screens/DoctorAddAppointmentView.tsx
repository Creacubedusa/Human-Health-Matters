import { useState, type ComponentProps } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { Button } from '@shared/components/ui/Button';

export interface DoctorAddAppointmentViewProps {
  onBack: () => void;
  initialTitle?: string;
  initialPatientName?: string;
}

interface FieldLabelProps {
  label: string;
}

interface DisplayFieldProps {
  value: string;
  placeholder?: string;
  iconLeftName?: ComponentProps<typeof Ionicons>['name'];
  iconRightName?: ComponentProps<typeof Ionicons>['name'];
  wide?: boolean;
}

const INPUT_BASE_CLASS =
  'rounded-md border-2 border-grey-200 bg-grey-50 px-3 text-b1 font-sans text-grey-900';

function FieldLabel({ label }: FieldLabelProps) {
  return (
    <Text className="text-b2 font-medium font-sans text-grey-900">
      {label}
    </Text>
  );
}

function DisplayField({
  value,
  placeholder,
  iconLeftName,
  iconRightName,
  wide = true,
}: DisplayFieldProps) {
  return (
    <Pressable
      className={[
        'flex-row items-center rounded-md border-2 border-grey-200 bg-grey-50 px-3 py-3',
        wide ? 'w-full' : 'w-[170px]',
      ].join(' ')}
      accessibilityRole="button"
    >
      {iconLeftName ? (
        <Ionicons
          name={iconLeftName}
          size={22}
          color={primitiveColors['grey-900']}
        />
      ) : null}
      <Text
        className={[
          'flex-1 text-b1 font-sans',
          value ? 'text-grey-900' : 'text-grey-400',
          iconLeftName ? 'ml-3' : '',
        ].join(' ')}
        numberOfLines={1}
      >
        {value || placeholder || ''}
      </Text>
      {iconRightName ? (
        <Ionicons
          name={iconRightName}
          size={22}
          color={primitiveColors['grey-400']}
        />
      ) : null}
    </Pressable>
  );
}

export function DoctorAddAppointmentView({
  onBack,
  initialTitle,
  initialPatientName,
}: DoctorAddAppointmentViewProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialTitle ?? '');
  const [description, setDescription] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="bg-primary-50 h-[66px] justify-end">
        <View className="flex-row items-center justify-between px-4 pb-3 h-[48px]">
          <HeaderBackButton onPress={onBack} accessibilityLabel={t('common.back')} />
          <Text className="text-[16px] font-semibold font-sans text-grey-900">
            {t('calendar.addAppointmentTitle', { defaultValue: 'Add Appointment' })}
          </Text>
          <View className="w-[29px]" />
        </View>
      </View>

      <View className="flex-1 bg-white">
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-[14px] pt-8 pb-36"
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-h4 font-semibold font-sans text-grey-900">
            {t('calendar.addAppointmentTitle', { defaultValue: 'Add Appointment' })}
          </Text>

          <View className="mt-6 gap-5">
            <View className="gap-2">
              <FieldLabel label={t('calendar.appointmentTitleLabel', { defaultValue: 'Appointment Title' })} />
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder={t('calendar.appointmentTitlePlaceholder', { defaultValue: 'Appointment title' })}
                placeholderTextColor={primitiveColors['grey-400']}
                className={[INPUT_BASE_CLASS, 'h-12'].join(' ')}
              />
            </View>

            <View className="gap-2">
              <FieldLabel label={t('calendar.descriptionLabel', { defaultValue: 'Description' })} />
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder={t('calendar.descriptionPlaceholder', { defaultValue: 'Description' })}
                placeholderTextColor={primitiveColors['grey-400']}
                multiline
                textAlignVertical="top"
                className={[INPUT_BASE_CLASS, 'min-h-[210px] py-3'].join(' ')}
              />
            </View>

            <View className="gap-2">
              <FieldLabel label={t('calendar.dateLabel', { defaultValue: 'Date' })} />
              <DisplayField value="23/3/2026" iconLeftName="calendar-outline" />
            </View>

            <View className="flex-row justify-between">
              <View className="gap-2 w-[170px]">
                <FieldLabel label={t('calendar.fromLabel', { defaultValue: 'From' })} />
                <DisplayField value="08:00 AM" iconRightName="time-outline" wide={false} />
              </View>

              <View className="gap-2 w-[170px]">
                <FieldLabel label={t('calendar.toLabel', { defaultValue: 'To' })} />
                <DisplayField value="08:30 AM" iconRightName="time-outline" wide={false} />
              </View>
            </View>

            <View className="gap-2">
              <FieldLabel label={t('calendar.addPatientLabel', { defaultValue: 'Add Patient' })} />
              <DisplayField
                value={initialPatientName ?? ''}
                placeholder={t('calendar.addPatientPlaceholder', { defaultValue: 'Add Patient' })}
              />
            </View>
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 bg-white px-4 pb-8 pt-8">
          <Button
            label={t('calendar.scheduleAppointmentCta', { defaultValue: 'Schedule Appointment' })}
            onPress={onBack}
            size="large"
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
