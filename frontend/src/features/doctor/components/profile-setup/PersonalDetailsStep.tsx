import { Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AvatarUpload } from '@shared/components/ui/AvatarUpload';
import { SelectInput } from '@shared/components/ui/SelectInput';
import { DatePickerField } from '@shared/components/ui/DatePickerField';
import type { PersonalDetails } from '../../types/doctorProfileSetup.types';

export interface PersonalDetailsStepProps {
  data: PersonalDetails;
  onChange: (data: Partial<PersonalDetails>) => void;
  testID?: string;
}

const GENDER_OPTIONS = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
  { label: 'Non-binary', value: 'non-binary' },
  { label: 'Prefer not to say', value: 'prefer-not-to-say' },
];

export function PersonalDetailsStep({ data, onChange, testID }: PersonalDetailsStepProps) {
  const { t } = useTranslation();

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-4 pt-6 pb-8 gap-8"
      showsVerticalScrollIndicator={false}
      testID={testID}
    >
      <Text className="text-h4 font-semibold font-sans text-grey-900">
        {t('doctorProfileSetup.personal.heading')}
      </Text>

      <View className="items-center">
        <AvatarUpload
          uri={data.profileImage}
          onSelect={(uri) => onChange({ profileImage: uri })}
          initials="A"
          testID="personal-avatar-upload"
        />
      </View>

      <View className="gap-4">
        <SelectInput
          label={t('doctorProfileSetup.personal.genderLabel')}
          placeholder={t('doctorProfileSetup.personal.genderPlaceholder')}
          options={GENDER_OPTIONS}
          value={data.gender || null}
          onChange={(val) => onChange({ gender: val })}
          testID="personal-gender"
        />

        <DatePickerField
          label={t('doctorProfileSetup.personal.dobLabel')}
          value={data.dateOfBirth}
          onChange={(date) => onChange({ dateOfBirth: date })}
          placeholder={t('doctorProfileSetup.personal.dobPlaceholder')}
          testID="personal-dob"
        />

        <View className="gap-2">
          <Text className="text-b2 text-grey-900 font-sans">
            {t('doctorProfileSetup.personal.availabilityLabel')}
          </Text>
          <Pressable
            className="flex-row items-center gap-3 border-[1.5px] border-grey-200 rounded-md p-3 bg-grey-50"
            accessibilityRole="button"
          >
            <Text className="flex-1 text-b1 font-sans text-grey-400">
              {data.availability || t('doctorProfileSetup.personal.availabilityPlaceholder')}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
