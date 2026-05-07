import { View, Text } from 'react-native';
import type { PatientProfileOverview, ProfileDetailItem } from '../../types/profileOverview.types';
import { ProfileActionRow } from './ProfileActionRow';

interface ProfileDetailsSectionProps {
  title: string;
  profile: PatientProfileOverview;
  labels: Record<ProfileDetailItem['id'], string>;
  onEdit: (field: ProfileDetailItem['id']) => void;
}

export function ProfileDetailsSection({ title, profile, labels, onEdit }: ProfileDetailsSectionProps) {
  const items: ProfileDetailItem[] = [
    { id: 'phone', label: labels.phone, value: profile.phone },
    { id: 'email', label: labels.email, value: profile.email },
    { id: 'address', label: labels.address, value: profile.address },
    { id: 'nationality', label: labels.nationality, value: profile.nationality },
  ];

  return (
    <View className="bg-white border border-grey-200 rounded-2xl p-4 gap-2 w-full">
      <Text className="text-s2 font-semibold font-sans text-grey-900">{title}</Text>
      <View className="gap-0.5">
        {items.map((item) => (
          <ProfileActionRow
            key={item.id}
            title={item.label}
            subtitle={item.value}
            onPress={() => onEdit(item.id)}
          />
        ))}
      </View>
    </View>
  );
}
