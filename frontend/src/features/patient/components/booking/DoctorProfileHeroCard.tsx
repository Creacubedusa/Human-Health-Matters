import { Text, View } from 'react-native';
import type { DoctorRecommendation } from '@features/patient/types/appointmentBooking.types';
import { DoctorAvatar } from './DoctorAvatar';

export interface DoctorProfileHeroCardProps {
  doctor: DoctorRecommendation;
}

export function DoctorProfileHeroCard({ doctor }: DoctorProfileHeroCardProps) {
  return (
    <View className="rounded-md bg-primary-50 px-4 py-2">
      <View className="flex-row items-center gap-6">
        <DoctorAvatar uri={doctor.avatarUri} size="hero" />
        <View className="gap-1">
          <Text className="text-s2 font-semibold font-sans text-grey-900">
            {doctor.name}
          </Text>
          <Text className="text-b3 font-sans text-grey-500">
            {doctor.specialty}
          </Text>
        </View>
      </View>
    </View>
  );
}
