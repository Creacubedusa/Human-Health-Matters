import { useTranslation } from 'react-i18next';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import type { ProfileForm } from '../types/profile.types';

const INSULIN_OPTIONS = [
  { label: 'Rapid-acting',  value: 'rapid_acting'  },
  { label: 'Short-acting',  value: 'short_acting'  },
  { label: 'Intermediate',  value: 'intermediate'  },
  { label: 'Long-acting',   value: 'long_acting'   },
  { label: 'Ultra-long',    value: 'ultra_long'    },
];

const ANTIDIABETIC_OPTIONS = [
  { label: 'Metformin',     value: 'metformin'     },
  { label: 'Glipizide',     value: 'glipizide'     },
  { label: 'Sitagliptin',   value: 'sitagliptin'   },
  { label: 'Empagliflozin', value: 'empagliflozin' },
];

interface SplitRowProps {
  categoryLabel: string;
  rightNode: React.ReactNode;
}

// Figma: grey left label + white right input in one row
function SplitRow({ categoryLabel, rightNode }: SplitRowProps) {
  return (
    <View className="flex-row items-stretch h-[46px]">
      <View className="bg-grey-50 border border-grey-200 rounded-l-lg items-center justify-center px-5">
        <Text className="text-b2 font-semibold font-sans text-grey-900 whitespace-nowrap">{categoryLabel}</Text>
      </View>
      <View className="flex-1 bg-white border border-grey-200 rounded-r-lg flex-row items-center px-4">
        {rightNode}
      </View>
    </View>
  );
}

interface DropdownFieldProps {
  value: string | null;
  options: { label: string; value: string }[];
  onSelect: (v: string) => void;
  placeholder: string;
  disabled?: boolean;
}

function DropdownField({ value, options, onSelect, placeholder, disabled }: DropdownFieldProps) {
  const selected = options.find((o) => o.value === value);
  return (
    <Pressable
      className="flex-1 flex-row items-center justify-between"
      onPress={() => {
        if (disabled) return;
        // Cycle through options for simplicity (SelectInput modal not used here per Figma)
        const idx = options.findIndex((o) => o.value === value);
        const next = options[(idx + 1) % options.length];
        onSelect(next.value);
      }}
    >
      <Text className={['text-b1 font-sans', selected ? 'text-grey-900' : 'text-grey-500'].join(' ')}>
        {selected ? selected.label : placeholder}
      </Text>
      <Ionicons name="chevron-down" size={16} color={primitiveColors['grey-500']} />
    </Pressable>
  );
}

interface Props {
  form: Pick<ProfileForm, 'insulinSubtype' | 'antidiabeticSubtype' | 'otherMedication'>;
  errors: Partial<Record<keyof ProfileForm, string>>;
  onChange: <K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) => void;
  disabled?: boolean;
}

// Figma Screen 7: all 3 rows always visible
export function DiabetesMedicationStep({ form, errors, onChange, disabled }: Props) {
  const { t } = useTranslation();

  return (
    <View className="gap-6 w-full">
      {/* Row 1: Insulin | subtype dropdown */}
      <SplitRow
        categoryLabel={t('patientProfile.medicationInsulin')}
        rightNode={
          <DropdownField
            value={form.insulinSubtype}
            options={INSULIN_OPTIONS}
            onSelect={(v) => onChange('insulinSubtype', v)}
            placeholder={t('patientProfile.insulinRapidActing')}
            disabled={disabled}
          />
        }
      />

      {/* Row 2: Antidiabetic | subtype dropdown */}
      <SplitRow
        categoryLabel={t('patientProfile.medicationAntidiabetic')}
        rightNode={
          <DropdownField
            value={form.antidiabeticSubtype}
            options={ANTIDIABETIC_OPTIONS}
            onSelect={(v) => onChange('antidiabeticSubtype', v)}
            placeholder={t('patientProfile.antidiabeticMetformin')}
            disabled={disabled}
          />
        }
      />

      {/* Row 3: Others | free text */}
      <SplitRow
        categoryLabel={t('patientProfile.medicationOther')}
        rightNode={
          <TextInput
            className="flex-1 text-b1 font-sans text-grey-900 p-0"
            value={form.otherMedication}
            onChangeText={(v) => onChange('otherMedication', v)}
            placeholder={t('patientProfile.otherSpecifyPlaceholder')}
            placeholderTextColor={primitiveColors['grey-500']}
            editable={!disabled}
          />
        }
      />
    </View>
  );
}
