import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { FamilyDiabetesAnswer } from '../../types/doctor.types';

// ── Standard list card ────────────────────────────────────────────────────────

export interface DoctorReadOnlyHistoryCardProps {
  title: string;
  items: string[];
  emptyLabel: string;
}

export function DoctorReadOnlyHistoryCard({
  title,
  items,
  emptyLabel,
}: DoctorReadOnlyHistoryCardProps) {
  const value = items.length > 0 ? items.join(', ') : emptyLabel;
  return (
    <View className="bg-primary-50 w-full p-4 gap-1">
      <Text className="text-[16px] font-medium font-sans text-grey-900">{title}</Text>
      <Text className="text-[14px] font-sans text-grey-500">{value}</Text>
    </View>
  );
}

// ── Radio / badge card (for family diabetes history) ──────────────────────────

const ANSWER_LABEL_KEY: Record<FamilyDiabetesAnswer, string> = {
  yes: 'doctorPatients.patientHistoryFamilyDiabetesYes',
  no: 'doctorPatients.patientHistoryFamilyDiabetesNo',
  unknown: 'doctorPatients.patientHistoryFamilyDiabetesUnknown',
  '': '',
};

export interface DoctorReadOnlyRadioCardProps {
  title: string;
  answer: FamilyDiabetesAnswer;
  emptyLabel: string;
}

export function DoctorReadOnlyRadioCard({
  title,
  answer,
  emptyLabel,
}: DoctorReadOnlyRadioCardProps) {
  const { t } = useTranslation();
  const value = answer ? t(ANSWER_LABEL_KEY[answer]) : emptyLabel;
  return (
    <View className="bg-primary-50 w-full p-4 gap-1">
      <Text className="text-[16px] font-medium font-sans text-grey-900">{title}</Text>
      <Text className="text-[14px] font-sans text-grey-500">{value}</Text>
    </View>
  );
}
