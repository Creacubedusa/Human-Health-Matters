import { Text, View } from 'react-native';
import type { MedicalRecordSection, ProfileRecordId } from '../../types/profileOverview.types';
import { ProfileActionRow } from './ProfileActionRow';

interface MedicalRecordsSectionProps {
  title: string;
  records: MedicalRecordSection[];
  onRecordPress: (id: ProfileRecordId) => void;
}

export function MedicalRecordsSection({ title, records, onRecordPress }: MedicalRecordsSectionProps) {
  return (
    <View className="bg-white border border-grey-200 rounded-2xl p-4 gap-4 w-full">
      <Text className="text-s2 font-semibold font-sans text-grey-900">{title}</Text>
      <View className="gap-4">
        {records.map((record) => (
          <ProfileActionRow
            key={record.id}
            title={record.title}
            onPress={() => onRecordPress(record.id)}
          />
        ))}
      </View>
    </View>
  );
}
