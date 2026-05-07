import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { primitiveColors } from '@design/tokens';
import type { DoctorReportRecord } from '../../types/doctor.types';

interface DoctorReportCardProps {
  item: DoctorReportRecord;
}

export function DoctorReportCard({ item }: DoctorReportCardProps) {
  return (
    <View className="bg-white border border-grey-200 rounded-2xl px-4 py-4 gap-3">
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center">
          <Ionicons
            name={item.fileType === 'pdf' ? 'document-text-outline' : 'image-outline'}
            size={20}
            color={primitiveColors['primary-500']}
          />
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-s2 font-semibold font-sans text-grey-900">{item.title}</Text>
          <Text className="text-c1 font-sans text-grey-500">{item.fileName}</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="text-c1 font-sans text-grey-500">{item.uploadedBy}</Text>
        <Text className="text-c1 font-sans text-grey-500">{item.date}</Text>
      </View>
    </View>
  );
}
