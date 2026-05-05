import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export interface DoctorAINoteConsentModalProps {
  visible: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export function DoctorAINoteConsentModal({
  visible,
  onAccept,
  onReject,
}: DoctorAINoteConsentModalProps) {
  const { t } = useTranslation();
  const bulletPoints = [
    t('doctorConsultation.aiNoteConsentBulletDecisions', {
      defaultValue: 'It does not make medical decisions.',
    }),
    t('doctorConsultation.aiNoteConsentBulletPrivacy', {
      defaultValue: 'Your information is kept confidential and secure.',
    }),
    t('doctorConsultation.aiNoteConsentBulletPause', {
      defaultValue: 'You can pause or turn it off at any time.',
    }),
    t('doctorConsultation.aiNoteConsentBulletConsent', {
      defaultValue: 'Your consent is required before we proceed.',
    }),
  ];

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onReject}>
      <View className="flex-1 items-center justify-center bg-black/65 px-6">
        <View className="w-full max-w-[332px] rounded-[8px] border border-[#E5E7EB] bg-white px-4 pb-4 pt-3">
          <View className="items-end">
            <Pressable
              onPress={onReject}
              accessibilityRole="button"
              accessibilityLabel={t('common.close', { defaultValue: 'Close' })}
              className="h-8 w-8 items-center justify-center"
            >
              <Ionicons name="close" size={18} color="#9CA3AF" />
            </Pressable>
          </View>

          <View className="mt-1 gap-4">
            <View className="gap-3">
              <Text className="font-sans text-[18px] font-semibold leading-7 text-grey-900">
                {t('doctorConsultation.aiNoteConsentTitle', {
                  defaultValue: 'AI note taker',
                })}
              </Text>
              <Text className="font-sans text-[16px] leading-6 text-grey-600">
                {t('doctorConsultation.aiNoteConsentBody', {
                  defaultValue:
                    'To improve your care experience, we use an AI-powered note-taking assistant during this session. The AI will listen only to capture medical notes and convert conversation into a clinical summary for your record.',
                })}
              </Text>
            </View>

            <View className="gap-2">
              {bulletPoints.map((bulletPoint) => (
                <View key={bulletPoint} className="flex-row items-start gap-2">
                  <Text className="pt-[2px] font-sans text-[16px] leading-6 text-grey-600">
                    {'\u2022'}
                  </Text>
                  <Text className="flex-1 font-sans text-[16px] leading-6 text-grey-600">
                    {bulletPoint}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mt-6 flex-row justify-end gap-3">
            <Pressable
              className="h-8 min-w-[101px] items-center justify-center rounded-[8px] border border-[#4E61F6] bg-white px-4"
              onPress={onReject}
              accessibilityRole="button"
            >
              <Text className="font-sans text-[12px] font-semibold leading-4 text-[#4E61F6]">
                {t('doctorConsultation.aiNoteReject', { defaultValue: 'Reject' })}
              </Text>
            </Pressable>

            <Pressable
              className="h-8 min-w-[101px] items-center justify-center rounded-[8px] bg-[#4E61F6] px-4"
              onPress={onAccept}
              accessibilityRole="button"
            >
              <Text className="font-sans text-[12px] font-semibold leading-4 text-white">
                {t('doctorConsultation.aiNoteAccept', { defaultValue: 'Accept' })}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
