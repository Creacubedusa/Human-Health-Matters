import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { TypingIndicator } from '@shared/components/ui/TypingIndicator';
import { capitalizeFirst } from '@shared/utils/text';
import type { DoctorChatMessage, DoctorLanguage } from '../../types/doctorConsultation.types';
import type { DoctorConsultationAISummary } from '../../utils/consultationAiSummary';

export interface DoctorAIPatientPanelProps {
  visible: boolean;
  patientName: string;
  patientInitials: string;
  summary: DoctorConsultationAISummary | null;
  messages: DoctorChatMessage[];
  input: string;
  isTyping: boolean;
  selectedLanguage: DoctorLanguage;
  onChangeInput: (text: string) => void;
  onSend: () => void;
  onClose: () => void;
}

interface SummaryBlockProps {
  label: string;
  value: string;
}

interface SeverityBadgeProps {
  severity: 'high' | 'moderate' | 'low';
}

function SummaryBlock({ label, value }: SummaryBlockProps) {
  return (
    <View className="gap-2">
      <Text className="text-[14px] font-medium font-sans text-grey-900">
        {label}
      </Text>
      <Text className="text-[14px] font-sans leading-5 text-grey-600">{value}</Text>
    </View>
  );
}

function SeverityBadge({ severity }: SeverityBadgeProps) {
  const styles =
    severity === 'high'
      ? {
        container: 'bg-[#FDECEC]',
        text: 'text-[#EE443F]',
        label: 'High',
      }
      : severity === 'moderate'
        ? {
          container: 'bg-[#FFF7E6]',
          text: 'text-[#FFAA00]',
          label: 'Moderate',
        }
        : {
          container: 'bg-[#EAF6EC]',
          text: 'text-[#2D9F5D]',
          label: 'Low',
        };

  return (
    <View className={`min-w-[54px] items-center justify-center rounded-[8px] px-2 py-1 ${styles.container}`}>
      <Text className={`text-[10px] font-semibold font-sans leading-3 ${styles.text}`}>
        {styles.label}
      </Text>
    </View>
  );
}

export function DoctorAIPatientPanel({
  visible,
  patientName,
  patientInitials,
  summary,
  messages,
  input,
  isTyping,
  selectedLanguage,
  onChangeInput,
  onSend,
  onClose,
}: DoctorAIPatientPanelProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [reportOpen, setReportOpen] = useState(false);

  const languageMeta: Record<DoctorLanguage, { flag: string; label: string }> = {
    en: { flag: '🇺🇸', label: 'English' },
    es: { flag: '🇪🇸', label: 'Spanish' },
    fr: { flag: '🇫🇷', label: 'French' },
    ar: { flag: '🇸🇦', label: 'Arabic' },
    tr: { flag: '🇹🇷', label: 'Turkish' },
  };

  const activeLanguage = languageMeta[selectedLanguage] ?? languageMeta.en;

  const introMessage = useMemo(
    () =>
      messages.find((message) => message.sender === 'ai')?.text ??
      `Hey Dr Paul, Find below ${patientName}'s AI summary report`,
    [messages, patientName],
  );

  const conversationMessages = useMemo(
    () => messages.slice(1),
    [messages],
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
        <View className="bg-primary-50 h-[120px]">
          <View className="mt-[47px] h-[66px] flex-row items-center justify-between px-4">
            <HeaderBackButton onPress={onClose} accessibilityLabel={t('common.back')} />
            <Text className="text-[16px] font-semibold font-sans text-grey-900">
              Nura AI
            </Text>
            <View className="w-[29px] h-[29px]" />
          </View>
        </View>

        <View className="flex-1 bg-white">
          <View className="items-end px-[19px] pt-[27px]">
            <Pressable
              onPress={() => router.push('/(doctor)/language')}
              className="h-10 min-w-[70px] flex-row items-center justify-center gap-2 rounded-md border border-grey-300 bg-grey-50 px-[10px]"
              accessibilityRole="button"
              accessibilityLabel={t('selectLanguage.headerTitle', {
                defaultValue: 'Select language',
              })}
            >
              <Text className="text-c2 font-sans">{activeLanguage.flag}</Text>
              <Ionicons name="chevron-down" size={14} color={primitiveColors['grey-700']} />
            </Pressable>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerClassName="px-4 pt-[36px] pb-36"
            showsVerticalScrollIndicator={false}
          >
            <View className="items-center">
              <View className="h-6 w-[281px] items-center justify-center rounded-[8px] bg-primary-50 px-2">
                <Text className="text-[10px] font-semibold font-sans text-grey-600">
                  View patient AI summary report
                </Text>
              </View>
            </View>

            <View className="mt-[116px] items-end">
              <View className="w-[215px] items-end gap-6">
                <View className="w-[215px] rounded-bl-[16px] rounded-br-[16px] rounded-tl-[6px] rounded-tr-[16px] bg-grey-50 px-[15px] py-[9px]">
                  <Text className="text-b3 font-sans leading-5 text-grey-900">
                    {introMessage}
                  </Text>
                </View>

                <Pressable
                  onPress={() => setReportOpen(true)}
                  className="h-8 flex-row items-center justify-center gap-2 rounded-[8px] bg-primary-500 px-3"
                  accessibilityRole="button"
                  accessibilityLabel="View patient AI summary report"
                >
                  <Text className="text-[12px] font-semibold font-sans text-white">
                    View result
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#ffffff" />
                </Pressable>
              </View>
            </View>

            {conversationMessages.length > 0 ? (
              <View className="mt-8 gap-4">
                {conversationMessages.map((message) => {
                  const isDoctor = message.sender === 'doctor';
                  return (
                    <View
                      key={message.id}
                      className={isDoctor ? 'items-end' : 'items-start'}
                    >
                      <View
                        className={[
                          'max-w-[215px] px-4 py-3',
                          isDoctor
                            ? 'rounded-bl-[16px] rounded-br-[16px] rounded-tl-[16px] rounded-tr-[6px] bg-primary-700'
                            : 'rounded-bl-[16px] rounded-br-[16px] rounded-tl-[6px] rounded-tr-[16px] bg-grey-50',
                        ].join(' ')}
                      >
                        <Text
                          className={[
                            'text-b3 font-sans leading-5',
                            isDoctor ? 'text-white' : 'text-grey-900',
                          ].join(' ')}
                        >
                          {message.text}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : null}

            {isTyping ? (
              <View className="mt-6">
                <TypingIndicator />
              </View>
            ) : null}
          </ScrollView>

          <View className="absolute bottom-0 left-0 right-0 bg-white px-[11px] pb-6 pt-3">
            <View className="rounded-[16px] border border-grey-300 bg-white px-[17px] py-[13px]">
              <View className="gap-4">
                <Text className="text-b3 font-sans text-grey-600">Chat with Nura</Text>

                <TextInput
                  value={input}
                  onChangeText={onChangeInput}
                  placeholder=""
                  placeholderTextColor={primitiveColors['grey-400']}
                  className="min-h-[20px] text-b3 font-sans text-grey-900"
                  multiline
                />

                <View className="flex-row items-center justify-between">
                  <Ionicons
                    name="attach-outline"
                    size={24}
                    color={primitiveColors['grey-900']}
                  />

                  <View className="flex-row items-center gap-4">
                    <Ionicons
                      name="mic-outline"
                      size={24}
                      color={primitiveColors['grey-900']}
                    />
                    <Pressable
                      className="h-10 w-10 items-center justify-center rounded-full bg-primary-50"
                      onPress={onSend}
                      accessibilityRole="button"
                      accessibilityLabel={t('doctorConsultation.send')}
                    >
                      <Ionicons
                        name="paper-plane-outline"
                        size={18}
                        color={primitiveColors['primary-500']}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {reportOpen && summary ? (
          <View className="absolute inset-0 z-50 bg-white">
            <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
              <View className="bg-primary-50">
                <View className="h-[66px] flex-row items-center justify-between px-4">
                  <HeaderBackButton
                    onPress={() => setReportOpen(false)}
                    accessibilityLabel={t('common.back')}
                  />
                  <Text className="text-[16px] font-semibold font-sans text-grey-900">
                    Nura AI
                  </Text>
                  <View className="h-[29px] w-[29px]" />
                </View>
              </View>

              <ScrollView
                className="flex-1 bg-white"
                contentContainerClassName="px-[10px] pb-8 pt-[29px]"
                showsVerticalScrollIndicator={false}
              >
                <View className="gap-4">
                  <View className="rounded-[8px] border border-grey-200 bg-white px-4 py-4">
                    <View className="gap-4">
                      <Text className="text-[16px] font-semibold font-sans leading-6 text-grey-900">
                        Patient Information
                      </Text>

                      <View className="flex-row items-start justify-between">
                        <View className="flex-row items-start gap-[15px]">
                          <View className="h-10 w-10 items-center justify-center rounded-full bg-[#F6D6D0]">
                            <Text className="text-[16px] font-semibold font-sans text-[#B55B47]">
                              {patientInitials.slice(0, 1).toUpperCase() || 'P'}
                            </Text>
                          </View>

                          <View className="w-[115px] gap-1">
                            <Text className="text-[14px] font-semibold font-sans leading-4 text-grey-900">
                              {summary.patientName}
                            </Text>
                            <Text className="text-[12px] font-sans leading-4 text-grey-600">
                              {capitalizeFirst(summary.gender)}
                            </Text>
                          </View>
                        </View>

                        <View className="h-6 min-w-[67px] items-center justify-center rounded-[8px] bg-[#E6F4FF] px-3">
                          <Text className="text-[10px] font-semibold font-sans leading-3 text-[#0095FF]">
                            Virtual
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row items-center justify-between">
                        <View className="w-[80px] gap-1">
                          <Text className="text-[12px] font-sans leading-4 text-grey-600">
                            Height
                          </Text>
                          <Text className="text-[16px] font-semibold font-sans leading-6 text-primary-500">
                            {summary.height}
                          </Text>
                        </View>

                        <View className="w-[80px] items-center gap-1">
                          <Text className="text-[12px] font-sans leading-4 text-grey-600">
                            Weight
                          </Text>
                          <Text className="text-[16px] font-semibold font-sans leading-6 text-primary-500">
                            {summary.weight}
                          </Text>
                        </View>

                        <View className="w-[79px] items-center gap-1">
                          <Text className="text-[12px] font-sans leading-4 text-grey-600">
                            Age
                          </Text>
                          <Text className="text-[16px] font-semibold font-sans leading-6 text-primary-500">
                            {summary.age}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View className="rounded-[8px] border border-grey-200 bg-white px-4 py-4">
                    <View className="gap-4">
                      <Text className="text-[16px] font-semibold font-sans leading-6 text-grey-900">
                        Reason for visit
                      </Text>

                      <View className="gap-4">
                        <SummaryBlock label="Chief Complaint" value={summary.chiefComplaint} />
                        <SummaryBlock
                          label="AI Symptom Summary (from patient chat)"
                          value={summary.aiSymptomsSummary}
                        />
                        <SummaryBlock label="Proposed test by AI" value={summary.proposedTest} />
                      </View>
                    </View>
                  </View>

                  <View className="rounded-[8px] border border-grey-100 bg-white px-4 py-4">
                    <View className="gap-4">
                      <Text className="text-[16px] font-semibold font-sans leading-6 text-grey-900">
                        Recent symptoms
                      </Text>

                      <View className="gap-3">
                        {summary.recentSymptoms.map((symptom) => (
                          <View
                            key={symptom.label}
                            className="rounded-[8px] bg-grey-50 px-[11px] py-[9px]"
                          >
                            <View className="flex-row items-center justify-between">
                              <Text className="flex-1 pr-3 text-[14px] font-sans leading-5 text-grey-600">
                                {symptom.label}
                              </Text>
                              <SeverityBadge severity={symptom.severity} />
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>

                  <View className="rounded-[8px] border border-grey-200 bg-white px-4 py-4">
                    <View className="gap-4">
                      <Text className="text-[16px] font-semibold font-sans leading-6 text-grey-900">
                        Medications and allergies
                      </Text>

                      <View className="gap-2">
                        <Text className="text-[16px] font-medium font-sans leading-6 text-grey-900">
                          Current Medication
                        </Text>
                        <View className="gap-1">
                          {summary.medications.length > 0 ? (
                            summary.medications.map((medication) => (
                              <View key={medication} className="flex-row items-start gap-2">
                                <Text className="text-[14px] leading-5 text-grey-600">{'\u2022'}</Text>
                                <Text className="flex-1 text-[14px] font-sans leading-5 text-grey-600">
                                  {medication}
                                </Text>
                              </View>
                            ))
                          ) : (
                            <Text className="text-[14px] font-sans leading-5 text-grey-600">
                              None reported
                            </Text>
                          )}
                        </View>
                      </View>

                      <View className="gap-2">
                        <Text className="text-[16px] font-medium font-sans leading-6 text-grey-900">
                          Allergies
                        </Text>
                        <Text className="text-[14px] font-sans leading-5 text-grey-600">
                          {summary.allergies.length > 0
                            ? summary.allergies.join(', ')
                            : 'No known allergies reported'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="rounded-[8px] border border-[#E3ECFE] bg-white px-[18px] py-4">
                    <View className="gap-4">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-[16px] font-semibold font-sans leading-6 text-grey-900">
                          Suggested first question
                        </Text>
                        <Ionicons name="sparkles" size={14} color={primitiveColors['primary-500']} />
                      </View>

                      <View className="gap-3">
                        {summary.suggestedQuestions.map((question) => (
                          <View
                            key={question}
                            className="rounded-[8px] bg-primary-50 px-4 py-[9px]"
                          >
                            <Text className="text-[14px] font-sans leading-5 text-grey-600">
                              {question}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </SafeAreaView>
          </View>
        ) : null}
      </SafeAreaView>
    </Modal>
  );
}
