import { Image, Text, View } from 'react-native';
import { Button } from '@shared/components/ui/Button';
import type { PatientProfileOverview } from '../../types/profileOverview.types';
import { ProfileMetricRow } from './ProfileMetricRow';

interface ProfileCardProps {
  profile: PatientProfileOverview;
  labels: {
    height: string;
    weight: string;
    age: string;
    edit: string;
  };
  onEdit: () => void;
}

export function ProfileCard({ profile, labels, onEdit }: ProfileCardProps) {
  return (
    <View className="items-center gap-6 w-[241px] self-center">
      <View className="p-2.5">
        <Image
          source={{ uri: profile.avatarUri }}
          className="w-[100px] h-[100px] rounded-full bg-primary-100"
        />
      </View>

      <View className="gap-6 w-full">
        <View className="items-center gap-4">
          <View className="items-center gap-1">
            <Text className="text-s2 font-semibold font-sans text-grey-900 text-center">
              {profile.name}
            </Text>
            <Text className="text-c1 font-sans text-grey-600 text-center">{profile.gender}</Text>
          </View>

          <ProfileMetricRow
            metrics={[
              { label: labels.height, value: profile.height },
              { label: labels.weight, value: profile.weight },
              { label: labels.age, value: profile.age },
            ]}
          />
        </View>

        <Button label={labels.edit} onPress={onEdit} size="small" fullWidth />
      </View>
    </View>
  );
}
