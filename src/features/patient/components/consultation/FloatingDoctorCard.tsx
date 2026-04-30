import { Text, View } from 'react-native';

export interface FloatingDoctorCardProps {
  doctorName: string;
  avatarInitials: string;
  videoOn: boolean;
}

export function FloatingDoctorCard({
  doctorName,
  avatarInitials,
  videoOn,
}: FloatingDoctorCardProps) {
  const primaryInitial = avatarInitials.slice(0, 1).toUpperCase() || doctorName.slice(0, 1).toUpperCase();

  return (
    <View
      className={[
        'absolute items-center justify-center overflow-hidden',
        videoOn
          ? 'right-6 top-24 h-[110px] w-[110px] rounded-[16px] bg-white'
          : 'right-6 top-[88px] h-[110px] w-[110px] rounded-[16px] bg-[#3095e2]',
      ].join(' ')}
    >
      {videoOn ? (
        <View className="h-[74px] w-[74px] items-center justify-center rounded-full bg-primary-100">
          <Text className="font-['Montserrat'] text-[36px] font-medium leading-none text-primary-500">
            {primaryInitial}
          </Text>
        </View>
      ) : (
        <Text className="font-['Montserrat'] text-[56px] font-semibold leading-none text-white">
          {primaryInitial}
        </Text>
      )}
    </View>
  );
}
