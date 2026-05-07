import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Badge } from '@shared/components/ui/Badge';
import type { DonorImpactPatient, DonorImpactPatientType, DonorImpactStatus } from '../../types/donorImpact.types';

export interface DonorImpactPatientCardProps {
  patient: DonorImpactPatient;
}

const PATIENT_TYPE_KEY: Record<DonorImpactPatientType, string> = {
  adult:  'donorImpact.patientTypeAdult',
  child:  'donorImpact.patientTypeChild',
  senior: 'donorImpact.patientTypeSenior',
};

const STATUS_BADGE: Record<DonorImpactStatus, { labelKey: string; status: 'success' | 'warning' | 'info' }> = {
  paid:       { labelKey: 'donorImpact.statusPaid',       status: 'success' },
  pending:    { labelKey: 'donorImpact.statusPending',    status: 'warning' },
  processing: { labelKey: 'donorImpact.statusProcessing', status: 'info'    },
};

export function DonorImpactPatientCard({ patient }: DonorImpactPatientCardProps) {
  const { t } = useTranslation();
  const badge = STATUS_BADGE[patient.status];

  return (
    <View className="bg-white border border-grey-300 rounded-lg px-3 py-[18px] gap-6">
      {/* Patient header row */}
      <View className="flex-row items-center">
        {/* Avatar */}
        <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center shrink-0">
          <Ionicons name="heart" size={20} color={primitiveColors['primary-500']} />
        </View>

        {/* Type + age */}
        <View className="flex-1 gap-2 ml-3">
          <Text className="text-b2 font-medium font-sans text-grey-900">
            {t(PATIENT_TYPE_KEY[patient.patientType])}
          </Text>
          <Text className="text-b4 font-sans text-grey-500">{patient.ageRange}</Text>
        </View>

        {/* Amount + status badge */}
        <View className="items-end gap-3 shrink-0">
          <Text className="text-b2 font-medium font-sans text-grey-900">
            {`$${patient.amount}`}
          </Text>
          <Badge
            label={t(badge.labelKey)}
            status={badge.status}
            variant="outline"
            size="tiny"
          />
        </View>
      </View>

      {/* Condition box */}
      <View className="bg-blue-50 rounded-xl p-4">
        <Text className="text-b4 font-sans text-grey-500">{patient.condition}</Text>
      </View>
    </View>
  );
}
