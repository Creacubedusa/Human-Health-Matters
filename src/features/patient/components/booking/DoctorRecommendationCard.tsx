import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@shared/components/ui/Badge';
import { Button } from '@shared/components/ui/Button';
import { primitiveColors } from '@design/tokens';
import type { DoctorRecommendation } from '@features/patient/types/appointmentBooking.types';
import { DoctorAvatar } from './DoctorAvatar';

export interface DoctorRecommendationCardProps {
  doctor: DoctorRecommendation;
  ctaLabel: string;
  onSelect: (doctor: DoctorRecommendation) => void;
}

export function DoctorRecommendationCard({
  doctor,
  ctaLabel,
  onSelect,
}: DoctorRecommendationCardProps) {
  return (
    <View className="rounded-md border border-grey-300 bg-white px-3 py-[18px]">
      <View className="gap-4">
        <View className="flex-row justify-between">
          <View className="flex-row items-center gap-6">
            <DoctorAvatar uri={doctor.avatarUri} />
            <View className="w-[140px] gap-1">
              <Text className="text-s2 font-semibold font-sans text-grey-900">
                {doctor.name}
              </Text>
              <Text className="text-b3 font-sans text-grey-500">
                {doctor.specialty}
              </Text>
            </View>
          </View>

          <View className="w-[52px] items-end gap-[7px]">
            <View className="rounded-xs bg-blue-50 px-2 py-1.5">
              <Text className="text-btn-tiny font-semibold font-sans text-blue-500">
                {doctor.matchScore}%
              </Text>
            </View>
            <Text className="text-c1 font-sans text-grey-500">
              Match
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between pl-[72px]">
          <View className="flex-row items-center gap-2">
            <Ionicons name="star" size={15} color={primitiveColors['yellow-500']} />
            <Text className="text-s2 font-semibold font-sans text-grey-900">
              {doctor.rating.toFixed(1)}
            </Text>
            <Text className="text-b1 font-sans text-grey-500">
              ({doctor.reviewCount})
            </Text>
          </View>

          {doctor.donorFunded ? (
            <Badge
              label="Donor funded"
              size="tiny"
              status="success"
              variant="outline"
            />
          ) : null}
        </View>

        <View className="rounded-sm bg-blue-50 px-4 py-4">
          <View className="flex-row items-center gap-4">
            <Ionicons name="sparkles" size={18} color={primitiveColors['blue-500']} />
            <Text className="flex-1 text-c1 font-sans text-grey-500">
              {doctor.aiReason}
            </Text>
          </View>
        </View>

        <Button
          label={ctaLabel}
          onPress={() => onSelect(doctor)}
          size="large"
          fullWidth
        />
      </View>
    </View>
  );
}
