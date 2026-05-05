import { ActivityIndicator, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import type { SoapNote } from '../types/doctorConsultation.types';

export interface DoctorSoapNoteViewProps {
  soap: SoapNote;
  submitting: boolean;
  onChangeField: (field: keyof SoapNote, value: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
}

interface SoapFieldProps {
  label: string;
  hint: string;
  value: string;
  onChangeText: (text: string) => void;
}

function SoapField({ label, hint, value, onChangeText }: SoapFieldProps) {
  return (
    <View className="gap-2">
      <Text className="text-[14px] font-semibold font-sans text-grey-900">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={hint}
        placeholderTextColor={primitiveColors['grey-400']}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        className="min-h-[96px] rounded-xl border border-grey-300 bg-white px-4 py-3 text-b3 font-sans text-grey-900"
      />
    </View>
  );
}

export function DoctorSoapNoteView({
  soap,
  submitting,
  onChangeField,
  onSubmit,
  onSkip,
}: DoctorSoapNoteViewProps) {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-grey-50" edges={['top']}>
      <View className="bg-primary-50 h-[66px] justify-end">
        <View className="px-5 pb-3 h-[48px] justify-end">
          <Text className="text-[16px] font-semibold font-sans text-grey-900">
            {t('doctorConsultation.soapNoteTitle')}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-6 pb-40 gap-5"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-[13px] font-sans text-grey-500 leading-5">
          {t('doctorConsultation.soapNoteSubtitle')}
        </Text>

        <SoapField
          label={t('doctorConsultation.soapSubjectiveLabel')}
          hint={t('doctorConsultation.soapSubjectiveHint')}
          value={soap.subjective}
          onChangeText={(v) => onChangeField('subjective', v)}
        />
        <SoapField
          label={t('doctorConsultation.soapObjectiveLabel')}
          hint={t('doctorConsultation.soapObjectiveHint')}
          value={soap.objective}
          onChangeText={(v) => onChangeField('objective', v)}
        />
        <SoapField
          label={t('doctorConsultation.soapAssessmentLabel')}
          hint={t('doctorConsultation.soapAssessmentHint')}
          value={soap.assessment}
          onChangeText={(v) => onChangeField('assessment', v)}
        />
        <SoapField
          label={t('doctorConsultation.soapPlanLabel')}
          hint={t('doctorConsultation.soapPlanHint')}
          value={soap.plan}
          onChangeText={(v) => onChangeField('plan', v)}
        />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-grey-100 px-4 py-5 gap-3">
        <Button
          label={
            submitting
              ? ''
              : t('doctorConsultation.soapSubmit')
          }
          variant="filled"
          size="large"
          fullWidth
          disabled={submitting}
          iconLeft={submitting ? <ActivityIndicator size="small" color={primitiveColors.white} /> : undefined}
          onPress={onSubmit}
        />
        <Button
          label={t('doctorConsultation.soapSkip')}
          variant="outline"
          size="large"
          fullWidth
          disabled={submitting}
          onPress={onSkip}
        />
      </View>
    </SafeAreaView>
  );
}
