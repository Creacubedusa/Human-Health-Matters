import { Text, View } from 'react-native';

export interface DoctorFloatingPatientCardProps {
  patientInitials: string;
  videoOn: boolean;
}

export function DoctorFloatingPatientCard({
  patientInitials,
  videoOn,
}: DoctorFloatingPatientCardProps) {
  if (videoOn) return null;

  const initial = patientInitials.slice(0, 1).toUpperCase() || 'P';

  return (
    <View
      className={[
        'absolute items-center justify-center overflow-hidden',
        'right-6 top-[88px] h-[110px] w-[110px] rounded-[16px] bg-[#3095e2]',
      ].join(' ')}
    >
      <Text className="font-['Montserrat'] text-[56px] font-semibold leading-none text-white">
        {initial}
      </Text>
    </View>
  );
}
