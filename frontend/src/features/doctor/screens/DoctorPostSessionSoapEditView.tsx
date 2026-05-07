import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/components/ui/Button';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import type { SoapNote } from '../types/doctorConsultation.types';

interface DoctorPostSessionSoapEditViewProps {
  soap: SoapNote;
  onSave: (soap: SoapNote) => void;
  onCancel: () => void;
}

function SoapField({
  label,
  value,
  onChangeText,
  heightClassName,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  heightClassName: string;
}) {
  return (
    <View className="gap-2">
      <Text className="text-[16px] font-medium font-sans leading-6 text-grey-900">{label}</Text>
      <View className={`rounded-[8px] border-2 border-grey-200 bg-grey-50 px-4 py-3 ${heightClassName}`}>
        <TextInput
          multiline
          value={value}
          onChangeText={onChangeText}
          className="text-[14px] font-sans leading-5 text-grey-900"
          placeholder=""
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}

export function DoctorPostSessionSoapEditView({
  soap,
  onSave,
  onCancel,
}: DoctorPostSessionSoapEditViewProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<SoapNote>(soap);

  function updateField(field: keyof SoapNote, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="h-[120px] bg-primary-50">
        <View className="mt-[47px] h-[66px] flex-row items-center justify-between px-4">
          <HeaderBackButton onPress={onCancel} accessibilityLabel={t('common.back')} />
          <Text className="text-[16px] font-semibold font-sans text-grey-900">SOAP notes</Text>
          <View className="h-[29px] w-[29px]" />
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-white"
        contentContainerClassName="px-2 pb-32 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-[8px] border border-grey-100 bg-white px-4 py-4">
          <View className="gap-4">
            <Text className="text-[18px] font-semibold font-sans leading-7 text-[#212121]">
              SOAP notes
            </Text>

            <SoapField
              label="Subjective"
              value={draft.subjective}
              onChangeText={(value) => updateField('subjective', value)}
              heightClassName="min-h-[162px]"
            />
            <SoapField
              label="Objective"
              value={draft.objective}
              onChangeText={(value) => updateField('objective', value)}
              heightClassName="min-h-[183px]"
            />
            <SoapField
              label="Assessment"
              value={draft.assessment}
              onChangeText={(value) => updateField('assessment', value)}
              heightClassName="min-h-[162px]"
            />
            <SoapField
              label="Plan"
              value={draft.plan}
              onChangeText={(value) => updateField('plan', value)}
              heightClassName="min-h-[437px]"
            />
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white px-6 pb-6 pt-4">
        <View className="flex-row items-center justify-between">
          <Button
            label="Cancel"
            variant="outline"
            size="large"
            onPress={onCancel}
            testID="soap-edit-cancel"
          />
          <Button
            label="Save"
            size="large"
            onPress={() => onSave(draft)}
            testID="soap-edit-save"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
