import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import type { AppointmentCalendarMonth } from '@features/patient/types/appointmentBooking.types';

export interface AppointmentCalendarProps {
  month: AppointmentCalendarMonth;
  headerLabel: string;
  selectedDateKey: string | null;
  weekdayLabels: string[];
  onSelectDate: (dateKey: string) => void;
}

const DOT_TONE_CLASS = {
  blue: 'bg-primary-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
} as const;

export function AppointmentCalendar({
  month,
  headerLabel,
  selectedDateKey,
  weekdayLabels,
  onSelectDate,
}: AppointmentCalendarProps) {
  return (
    <View className="w-full">
      <View className="items-center px-1 py-4">
        <View className="flex-row items-center gap-4">
          <Pressable className="h-6 w-6 items-center justify-center" accessibilityRole="button">
            <Ionicons name="chevron-back" size={20} color={primitiveColors['grey-900']} />
          </Pressable>
          <Text className="w-[110px] text-center text-btn-medium font-semibold font-sans text-grey-900">
            {headerLabel}
          </Text>
          <Pressable className="h-6 w-6 items-center justify-center" accessibilityRole="button">
            <Ionicons name="chevron-forward" size={20} color={primitiveColors['grey-500']} />
          </Pressable>
        </View>

        <View className="mt-7 flex-row">
          {weekdayLabels.map((label) => (
            <View key={label} className="w-12 items-center px-[10px] py-[3px]">
              <Text className="text-b4 font-medium font-sans text-grey-900">
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="rounded-bl-xl rounded-br-xl bg-white">
        <View className="px-3 pb-5 pt-1">
          {month.weeks.map((week, weekIndex) => (
            <View key={`calendar-week-${weekIndex}`} className="flex-row">
              {week.map((day, dayIndex) => {
                if (!day) {
                  return <View key={`calendar-empty-${weekIndex}-${dayIndex}`} className="h-10 w-12 px-[2px] py-1" />;
                }

                const isSelected = day.key === selectedDateKey;

                return (
                  <Pressable
                    key={day.key}
                    onPress={() => day.isAvailable && onSelectDate(day.key)}
                    className="h-10 w-12 px-[2px] py-1"
                    accessibilityRole="button"
                  >
                    <View className="items-center gap-2">
                      <View
                        className={[
                          'min-w-[28px] items-center justify-center rounded-sm px-2',
                          isSelected ? 'bg-primary-500' : 'bg-white',
                        ].join(' ')}
                      >
                        <Text
                          className={[
                            'text-b3 font-sans',
                            isSelected ? 'text-grey-50' : 'text-grey-900',
                          ].join(' ')}
                        >
                          {day.dayNumber}
                        </Text>
                      </View>

                      <View className="flex-row gap-1">
                        {day.availabilityDots.map((dotTone, dotIndex) => (
                          <View
                            key={`${day.key}-${dotTone}-${dotIndex}`}
                            className={['h-1 w-1 rounded-full', DOT_TONE_CLASS[dotTone]].join(' ')}
                          />
                        ))}
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
