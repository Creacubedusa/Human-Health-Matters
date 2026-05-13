import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Input } from '@shared/components/ui/Input';
import { primitiveColors } from '@design/tokens';
import type { ProfessionalDetails } from '../../types/doctorProfileSetup.types';

export interface ServiceSetupStepProps {
  data: ProfessionalDetails;
  onChange: (data: Partial<ProfessionalDetails>) => void;
  onAvailabilityPress?: () => void;
  testID?: string;
}

export function ServiceSetupStep({
  data,
  onChange,
  onAvailabilityPress,
  testID,
}: ServiceSetupStepProps) {
  const { t } = useTranslation();

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-4 pt-2 pb-8 gap-6"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      testID={testID}
    >
      <Text className="text-h4 font-semibold font-sans text-grey-900">
        {t('doctorProfileSetup.service.heading')}
      </Text>

      <View className="gap-4">
        <Input
          label={t('doctorProfileSetup.service.experienceLabel')}
          placeholder={t('doctorProfileSetup.service.experiencePlaceholder')}
          value={data.yearsOfExperience}
          onChangeText={(v) => onChange({ yearsOfExperience: v })}
          keyboardType="numeric"
          testID="service-experience"
        />

        <Input
          label={t('doctorProfileSetup.service.hospitalLabel')}
          placeholder={t('doctorProfileSetup.service.hospitalPlaceholder')}
          value={data.hospital}
          onChangeText={(v) => onChange({ hospital: v })}
          testID="service-hospital"
        />

        <Input
          label={t('doctorProfileSetup.service.addressLabel')}
          placeholder={t('doctorProfileSetup.service.addressPlaceholder')}
          value={data.officeAddress}
          onChangeText={(v) => onChange({ officeAddress: v })}
          testID="service-address"
        />

        <Input
          label={t('doctorProfileSetup.service.feeLabel')}
          placeholder={t('doctorProfileSetup.service.feePlaceholder')}
          value={data.consultationFee}
          onChangeText={(v) => onChange({ consultationFee: v })}
          helperText={t('doctorProfileSetup.service.feeHelper')}
          keyboardType="decimal-pad"
          testID="service-fee"
        />

        <View className="gap-2">
          <Text className="text-b2 text-grey-900 font-sans">
            {t('doctorProfileSetup.service.availabilityLabel')}
          </Text>
          <Pressable
            onPress={onAvailabilityPress}
            className="flex-row items-center gap-3 border-[1.5px] border-grey-200 rounded-md p-3 bg-grey-50"
            accessibilityRole="button"
          >
            <Text className="flex-1 text-b1 font-sans text-grey-400">
              {data.availability || t('doctorProfileSetup.service.availabilityPlaceholder')}
            </Text>
          </Pressable>
        </View>

        <Input
          label={t('doctorProfileSetup.service.medSchoolLabel')}
          placeholder={t('doctorProfileSetup.service.medSchoolPlaceholder')}
          value={data.medicalSchool}
          onChangeText={(v) => onChange({ medicalSchool: v })}
          testID="service-med-school"
        />

        <View className="gap-2">
          <Text className="text-b2 text-grey-900 font-sans">
            {t('doctorProfileSetup.service.bioLabel')}
          </Text>
          <View className="bg-grey-50 border-[1.5px] border-grey-200 rounded-md p-3 h-[175px]">
            <TextInput
              value={data.biography}
              onChangeText={(v) => onChange({ biography: v })}
              placeholder={t('doctorProfileSetup.service.bioPlaceholder')}
              placeholderTextColor={primitiveColors['grey-400']}
              className="flex-1 text-b1 font-sans text-grey-900 p-0"
              multiline
              textAlignVertical="top"
              testID="service-bio"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
