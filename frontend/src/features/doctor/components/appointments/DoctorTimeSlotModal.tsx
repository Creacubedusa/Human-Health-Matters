import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import type { DoctorAppointmentTimeSlot } from '../../types/doctorAppointments.types';

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
  const slotRows = Array.from({ length: Math.ceil(slots.length / 3) }, (_, rowIndex) =>
    slots.slice(rowIndex * 3, rowIndex * 3 + 3),
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-grey-900/10">
        <Pressable className="flex-1" onPress={onClose} accessibilityRole="button" accessibilityLabel={title} />

        <View className="h-[357px] rounded-tl-[32px] rounded-tr-[32px] bg-primary-500 px-[26px] pb-9 pt-[61px]">
          <Text className="text-h5 font-semibold font-sans text-white">{title}</Text>

          <ScrollView
            className="mt-6 flex-1"
            contentContainerClassName="gap-5 pb-6"
            showsVerticalScrollIndicator={false}
          >
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
          </ScrollView>

          <View className="pt-2">
            <Pressable
              onPress={onSubmit}
              disabled={ctaDisabled}
              className={[
                'h-12 items-center justify-center rounded-md border border-primary-500 bg-white',
                ctaDisabled ? 'opacity-50' : 'opacity-100',
              ].join(' ')}
              accessibilityRole="button"
            >
              <Text className="text-btn-large font-semibold font-sans text-primary-500">{ctaLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
