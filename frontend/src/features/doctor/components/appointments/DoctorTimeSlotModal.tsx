import { useEffect, useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { toast } from '@shared/components/ui/toast';
import type { DoctorAppointmentTimeSlot } from '../../types/doctorAppointments.types';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function normalizeTimeLabel(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  const m24 = raw.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (m24) {
    const h = Number(m24[1]);
    const mm = m24[2];
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${pad2(h12)}:${mm} ${period}`;
  }

  const m12 = raw.match(/^(\d{1,2}):([0-5]\d)\s*([aApP][mM])$/);
  if (m12) {
    const h = Number(m12[1]);
    const mm = m12[2];
    const period = m12[3].toUpperCase();
    if (h < 1 || h > 12) return null;
    return `${pad2(h)}:${mm} ${period}`;
  }

  const m12NoMinutes = raw.match(/^(\d{1,2})\s*([aApP][mM])$/);
  if (m12NoMinutes) {
    const h = Number(m12NoMinutes[1]);
    const period = m12NoMinutes[2].toUpperCase();
    if (h < 1 || h > 12) return null;
    return `${pad2(h)}:00 ${period}`;
  }

  return null;
}

export interface DoctorTimeSlotModalProps {
  visible: boolean;
  title: string;
  slots: DoctorAppointmentTimeSlot[];
  selectedTimeSlotId: string | null;
  ctaLabel: string;
  ctaDisabled: boolean;
  onClose: () => void;
  onSelectTimeSlot: (slotId: string) => void;
  onSubmit: () => void;
}

export function DoctorTimeSlotModal({
  visible,
  title,
  slots,
  selectedTimeSlotId,
  ctaLabel,
  ctaDisabled,
  onClose,
  onSelectTimeSlot,
  onSubmit,
}: DoctorTimeSlotModalProps) {
  const { t } = useTranslation();
  const [custom, setCustom] = useState('');

  useEffect(() => {
    if (!visible) setCustom('');
  }, [visible]);

  const customSelected = selectedTimeSlotId != null && selectedTimeSlotId === custom;
  const slotRows = Array.from({ length: Math.ceil(slots.length / 3) }, (_, rowIndex) =>
    slots.slice(rowIndex * 3, rowIndex * 3 + 3),
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-grey-900/10">
        <Pressable className="flex-1" onPress={onClose} accessibilityRole="button" accessibilityLabel={title} />

        <View className="rounded-tl-[32px] rounded-tr-[32px] bg-primary-500 px-[26px] pb-9 pt-[61px]">
          <Text className="text-h5 font-semibold font-sans text-white">{title}</Text>

          <View className="mt-6 gap-5">
            {slotRows.map((row, rowIndex) => (
              <View key={`doctor-slot-row-${rowIndex}`} className="flex-row gap-3">
                {row.map((slot) => {
                  const isSelected = slot.id === selectedTimeSlotId;
                  return (
                    <Pressable
                      key={slot.id}
                      onPress={() => slot.available && onSelectTimeSlot(slot.id)}
                      className={[
                        'h-[42px] w-[98px] items-center justify-center rounded-[10px] border px-[10px]',
                        isSelected ? 'border-yellow-500 bg-yellow-500' : 'border-grey-200 bg-transparent',
                      ].join(' ')}
                      accessibilityRole="button"
                    >
                      <Text
                        className={
                          isSelected
                            ? 'text-b2 font-medium font-sans text-grey-900'
                            : 'text-b1 font-sans text-white'
                        }
                      >
                        {slot.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}

            <View className="mt-1">
              <Text className="text-b2 font-medium font-sans text-white mb-2">{t('doctorAppointmentManagement.customTimeLabel')}</Text>
              <View className="flex-row items-center gap-3">
                <View className="flex-1 bg-white rounded-[10px] px-3 py-2">
                  <TextInput
                    value={custom}
                    onChangeText={setCustom}
                    placeholder="e.g. 20:00 or 08:00 PM"
                    placeholderTextColor={primitiveColors['grey-400']}
                    className="text-b2 font-sans text-grey-900 p-0"
                    editable
                  />
                </View>
                <Pressable
                  onPress={() => {
                    const normalized = normalizeTimeLabel(custom);
                    if (!normalized) {
                      toast.error(t('doctorAppointmentManagement.customTimeInvalidFormat'));
                      return;
                    }
                    setCustom(normalized);
                    onSelectTimeSlot(normalized);
                  }}
                  className={[
                    'h-[42px] w-[98px] items-center justify-center rounded-[10px] border px-[10px]',
                    customSelected ? 'border-yellow-500 bg-yellow-500' : 'border-grey-200 bg-transparent',
                  ].join(' ')}
                  accessibilityRole="button"
                >
                  <Text className={customSelected ? 'text-b2 font-medium font-sans text-grey-900' : 'text-b1 font-sans text-white'}>
                    {t('doctorAppointmentManagement.customTimeUse')}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          <Pressable
            onPress={onSubmit}
            disabled={ctaDisabled}
            className={[
              'mt-12 h-12 items-center justify-center rounded-md border border-primary-500 bg-white',
              ctaDisabled ? 'opacity-50' : 'opacity-100',
            ].join(' ')}
            accessibilityRole="button"
          >
            <Text className="text-btn-large font-semibold font-sans text-primary-500">{ctaLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
