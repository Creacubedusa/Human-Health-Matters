import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { SelectInput } from '@shared/components/ui/SelectInput';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { toast } from '@shared/components/ui/toast';
import {
  createDefaultDoctorAvailabilitySettings,
  type DoctorAvailabilityDay,
  type DoctorAvailabilitySettings,
  type DoctorAvailabilitySlot,
  useDoctorAvailabilityStore,
} from '../store/doctorAvailability.store';
import {
  fetchDoctorAvailability,
  updateDoctorAvailability,
} from '../services/doctor.service';

export interface DoctorAvailabilityViewProps {
  onBack: () => void;
}

type PickerTarget =
  | { type: 'date'; field: 'fromDate' | 'toDate' }
  | { type: 'time'; dayKey: DoctorAvailabilityDay['key']; slotId: string; field: 'startTime' | 'endTime' };

interface SectionHeadingProps {
  title: string;
  subtitle: string;
}

interface InteractiveFieldProps {
  label?: string;
  value: string;
  iconRight?: ReactNode;
  widthClassName?: string;
  helperText?: string;
  status?: 'default' | 'error';
  onPress: () => void;
}

const DURATION_OPTIONS = [
  { label: '15 min', value: '15' },
  { label: '30 min', value: '30' },
  { label: '45 min', value: '45' },
  { label: '60 min', value: '60' },
] as const;

const BUFFER_OPTIONS = [
  { label: '10 min', value: '10' },
  { label: '15 min', value: '15' },
  { label: '30 min', value: '30' },
  { label: '45 min', value: '45' },
] as const;

function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <View className="gap-2">
      <Text className="text-s1 font-semibold font-sans text-grey-900">{title}</Text>
      <Text className="text-b2 font-medium font-sans text-grey-600">{subtitle}</Text>
    </View>
  );
}

function InteractiveField({
  label,
  value,
  iconRight,
  widthClassName = 'w-full',
  helperText,
  status = 'default',
  onPress,
}: InteractiveFieldProps) {
  return (
    <View className={widthClassName}>
      {label ? (
        <Text className="mb-2 text-b2 font-medium font-sans text-grey-900">{label}</Text>
      ) : null}
      <Pressable
        onPress={onPress}
        className={[
          'h-12 flex-row items-center rounded-md border-2 px-3',
          status === 'error' ? 'border-red-500 bg-red-50' : 'border-grey-200 bg-grey-50',
        ].join(' ')}
        accessibilityRole="button"
      >
        <Text
          className={[
            'flex-1 text-b1 font-sans',
            value ? 'text-grey-900' : 'text-grey-400',
          ].join(' ')}
        >
          {value}
        </Text>
        {iconRight}
      </Pressable>
      {helperText ? (
        <Text
          className={[
            'mt-2 text-b3 font-sans',
            status === 'error' ? 'text-red-500' : 'text-grey-400',
          ].join(' ')}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}

function Checkbox({
  checked,
  onPress,
}: {
  checked: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={[
        'h-6 w-6 items-center justify-center rounded-[8px]',
        checked ? 'bg-primary-500' : 'border-2 border-grey-300 bg-white',
      ].join(' ')}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      {checked ? <Ionicons name="checkmark" size={16} color="white" /> : null}
    </Pressable>
  );
}

function parseIsoDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function formatDateDisplay(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parseIsoDate(value));
}

function toIsoDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseTimeValue(value: string) {
  const [hour, minute] = value.split(':').map(Number);
  const date = new Date();
  date.setHours(hour || 0, minute || 0, 0, 0);
  return date;
}

function timeToMinutes(value: string) {
  const [hour, minute] = value.split(':').map(Number);
  return (hour || 0) * 60 + (minute || 0);
}

function formatTimeDisplay(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(parseTimeValue(value));
}

function toTimeValue(value: Date) {
  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function addMinutes(value: string, minutesToAdd: number) {
  const total = timeToMinutes(value) + minutesToAdd;
  const wrapped = ((total % 1440) + 1440) % 1440;
  const hours = Math.floor(wrapped / 60);
  const minutes = wrapped % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function createSlotId(dayKey: string) {
  return `${dayKey}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function createNextSlot(day: DoctorAvailabilityDay, durationMinutes: number): DoctorAvailabilitySlot {
  if (day.slots.length === 0) {
    return {
      id: createSlotId(day.key),
      startTime: '08:00',
      endTime: '16:00',
    };
  }

  const lastSlot = day.slots[day.slots.length - 1];
  const startTime = lastSlot.endTime;
  return {
    id: createSlotId(day.key),
    startTime,
    endTime: addMinutes(startTime, durationMinutes),
  };
}

function updateDay(
  settings: DoctorAvailabilitySettings,
  dayKey: DoctorAvailabilityDay['key'],
  updater: (day: DoctorAvailabilityDay) => DoctorAvailabilityDay,
) {
  return {
    ...settings,
    days: settings.days.map((day) => (day.key === dayKey ? updater(day) : day)),
  };
}

export function DoctorAvailabilityView({ onBack }: DoctorAvailabilityViewProps) {
  const { t } = useTranslation();
  const savedSettings = useDoctorAvailabilityStore((state) => state.settings);
  const hydrateAvailability = useDoctorAvailabilityStore((state) => state.hydrate);
  const setSavedSettings = useDoctorAvailabilityStore((state) => state.setSettings);

  const [settings, setSettings] = useState<DoctorAvailabilitySettings>(savedSettings);
  const [loading, setLoading] = useState(true);
  const [bookingLimitExpanded, setBookingLimitExpanded] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget | null>(null);
  const [iosPickerValue, setIosPickerValue] = useState<Date>(new Date());
  const [dateRangeError, setDateRangeError] = useState<string | null>(null);
  const [slotErrors, setSlotErrors] = useState<Record<string, string>>({});
  const [dailyLimitError, setDailyLimitError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadAvailability = async () => {
      try {
        const response = await fetchDoctorAvailability();
        if (!active) return;

        const nextSettings =
          response.settings ?? createDefaultDoctorAvailabilitySettings();
        hydrateAvailability(nextSettings, response.hasAvailability);
        setSettings(nextSettings);
      } catch {
        if (active) {
          setSettings(savedSettings);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadAvailability();

    return () => {
      active = false;
    };
  }, [hydrateAvailability, savedSettings]);

  const datePickerValue = useMemo(() => {
    if (!pickerTarget || pickerTarget.type !== 'date') return new Date();
    return parseIsoDate(settings[pickerTarget.field]);
  }, [pickerTarget, settings]);

  function openDatePicker(field: 'fromDate' | 'toDate') {
    const nextValue = parseIsoDate(settings[field]);
    setIosPickerValue(nextValue);
    setPickerTarget({ type: 'date', field });
  }

  function openTimePicker(
    dayKey: DoctorAvailabilityDay['key'],
    slotId: string,
    field: 'startTime' | 'endTime',
    currentValue: string,
  ) {
    const nextValue = parseTimeValue(currentValue);
    setIosPickerValue(nextValue);
    setPickerTarget({ type: 'time', dayKey, slotId, field });
  }

  function closePicker() {
    setPickerTarget(null);
  }

  function applyPickerValue(target: PickerTarget, value: Date) {
    if (target.type === 'date') {
      const isoDate = toIsoDate(value);
      setSettings((current) => ({
        ...current,
        [target.field]: isoDate,
      }));
      setDateRangeError(null);
      return;
    }

    setSettings((current) =>
      updateDay(current, target.dayKey, (day) => ({
        ...day,
        slots: day.slots.map((slot) =>
          slot.id === target.slotId ? { ...slot, [target.field]: toTimeValue(value) } : slot,
        ),
      })),
    );
    setSlotErrors((current) => {
      const next = { ...current };
      delete next[`${target.dayKey}:${target.slotId}`];
      return next;
    });
  }

  function handlePickerChange(_: DateTimePickerEvent, selected?: Date) {
    if (!pickerTarget || !selected) {
      if (Platform.OS === 'android') closePicker();
      return;
    }

    if (Platform.OS === 'android') {
      applyPickerValue(pickerTarget, selected);
      closePicker();
      return;
    }

    setIosPickerValue(selected);
  }

  function confirmIosPicker() {
    if (pickerTarget) applyPickerValue(pickerTarget, iosPickerValue);
    closePicker();
  }

  function addSlot(dayKey: DoctorAvailabilityDay['key']) {
    setSettings((current) =>
      updateDay(current, dayKey, (day) => ({
        ...day,
        slots: [...day.slots, createNextSlot(day, current.appointmentDurationMinutes)],
      })),
    );
  }

  function removeSlot(dayKey: DoctorAvailabilityDay['key'], slotId: string) {
    setSettings((current) =>
      updateDay(current, dayKey, (day) => ({
        ...day,
        slots: day.slots.filter((slot) => slot.id !== slotId),
      })),
    );
    setSlotErrors((current) => {
      const next = { ...current };
      delete next[`${dayKey}:${slotId}`];
      return next;
    });
  }

  function validate() {
    let hasError = false;

    if (parseIsoDate(settings.toDate).getTime() < parseIsoDate(settings.fromDate).getTime()) {
      setDateRangeError('To date cannot be earlier than From date');
      hasError = true;
    } else {
      setDateRangeError(null);
    }

    const nextSlotErrors: Record<string, string> = {};
    settings.days.forEach((day) => {
      day.slots.forEach((slot) => {
        if (timeToMinutes(slot.endTime) <= timeToMinutes(slot.startTime)) {
          nextSlotErrors[`${day.key}:${slot.id}`] = 'End time must be later than start time';
          hasError = true;
        }
      });
    });
    setSlotErrors(nextSlotErrors);

    if (settings.bookingLimits.dailyLimitEnabled) {
      const numericValue = Number(settings.bookingLimits.dailyLimit);
      if (
        !settings.bookingLimits.dailyLimit.trim() ||
        !Number.isInteger(numericValue) ||
        numericValue <= 0
      ) {
        setDailyLimitError('Enter a positive number greater than 0');
        hasError = true;
      } else {
        setDailyLimitError(null);
      }
    } else {
      setDailyLimitError(null);
    }

    return !hasError;
  }

  function handleSave() {
    if (!validate()) {
      toast.error('Please fix the availability form errors before saving.');
      return;
    }

    void (async () => {
      try {
        const response = await updateDoctorAvailability(settings);
        setSavedSettings(response.settings ?? settings);
        toast.success('Availability settings saved successfully.');
        onBack();
      } catch {
        // Toast handled by HTTP interceptor.
      }
    })();
  }

  const pickerMode = pickerTarget?.type === 'time' ? 'time' : 'date';
  const androidDateValue = pickerTarget?.type === 'date' ? datePickerValue : iosPickerValue;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="bg-primary-50 h-[66px] justify-end">
        <View className="flex-row items-center justify-between px-4 pb-3 h-[48px]">
          <HeaderBackButton onPress={onBack} accessibilityLabel={t('common.back')} />
          <Text className="text-[16px] font-semibold font-sans text-grey-900">
            {t('calendar.setAvailability', { defaultValue: 'Set Availability' })}
          </Text>
          <View className="w-[29px]" />
        </View>
      </View>

      <View className="flex-1 bg-white">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-4 pt-8 pb-36"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {loading ? (
              <Text className="text-b2 font-sans text-grey-500">
                {t('common.loading')}
              </Text>
            ) : null}

            <Text className="text-h4 font-semibold font-sans text-grey-900">
              {t('calendar.setAvailability', { defaultValue: 'Set Availability' })}
            </Text>

            <View className="mt-6 gap-6">
              <View className="gap-4">
                <SectionHeading
                  title="Date Range"
                  subtitle="Patient can schedule within this date"
                />

                <View className="flex-row justify-between">
                  <InteractiveField
                    label="From"
                    value={formatDateDisplay(settings.fromDate)}
                    widthClassName="w-[154px]"
                    status={dateRangeError ? 'error' : 'default'}
                    onPress={() => openDatePicker('fromDate')}
                    iconRight={
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color={primitiveColors['grey-400']}
                      />
                    }
                  />
                  <InteractiveField
                    label="To"
                    value={formatDateDisplay(settings.toDate)}
                    widthClassName="w-[154px]"
                    status={dateRangeError ? 'error' : 'default'}
                    helperText={dateRangeError ?? undefined}
                    onPress={() => openDatePicker('toDate')}
                    iconRight={
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color={primitiveColors['grey-400']}
                      />
                    }
                  />
                </View>
              </View>

              <View className="gap-4">
                <SectionHeading
                  title="Appointment Duration"
                  subtitle="How long should each appointment last"
                />

                <SelectInput
                  options={[...DURATION_OPTIONS]}
                  value={String(settings.appointmentDurationMinutes)}
                  onChange={(value) =>
                    setSettings((current) => ({
                      ...current,
                      appointmentDurationMinutes: Number(value) as 15 | 30 | 45 | 60,
                    }))
                  }
                />
              </View>

              <View className="gap-4">
                <SectionHeading
                  title="Time Slots"
                  subtitle="Set when you are available for appointment"
                />

                <View className="gap-4">
                  {settings.days.map((day) =>
                    day.slots.length > 0 ? (
                      <View key={day.key} className="gap-3">
                        {day.slots.map((slot, slotIndex) => {
                          const errorText = slotErrors[`${day.key}:${slot.id}`];
                          return (
                            <View
                              key={slot.id}
                              className="flex-row items-start justify-between gap-3"
                            >
                              <View className="flex-1 flex-row items-start">
                                <Text className="w-[37px] pt-3 text-b1 font-sans text-grey-900">
                                  {slotIndex === 0 ? day.label : ''}
                                </Text>
                                <View className="ml-2 flex-1 gap-2">
                                  <View className="flex-row items-center gap-2">
                                    <InteractiveField
                                      value={formatTimeDisplay(slot.startTime)}
                                      widthClassName="w-[88px]"
                                      status={errorText ? 'error' : 'default'}
                                      onPress={() =>
                                        openTimePicker(day.key, slot.id, 'startTime', slot.startTime)
                                      }
                                    />
                                    <Text className="text-b1 font-sans text-grey-900">-</Text>
                                    <InteractiveField
                                      value={formatTimeDisplay(slot.endTime)}
                                      widthClassName="w-[88px]"
                                      status={errorText ? 'error' : 'default'}
                                      helperText={errorText}
                                      onPress={() =>
                                        openTimePicker(day.key, slot.id, 'endTime', slot.endTime)
                                      }
                                    />
                                  </View>
                                </View>
                              </View>

                              <View className="flex-row items-center gap-3 pt-3">
                                <Pressable
                                  accessibilityRole="button"
                                  onPress={() => removeSlot(day.key, slot.id)}
                                >
                                  <Ionicons
                                    name="close-circle-outline"
                                    size={22}
                                    color={primitiveColors['grey-900']}
                                  />
                                </Pressable>
                                <Pressable
                                  accessibilityRole="button"
                                  onPress={() => addSlot(day.key)}
                                >
                                  <Ionicons
                                    name="add-circle-outline"
                                    size={22}
                                    color={primitiveColors['grey-900']}
                                  />
                                </Pressable>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    ) : (
                      <View key={day.key} className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Text className="w-[37px] text-b1 font-sans text-grey-900">
                            {day.label}
                          </Text>
                          <Text className="ml-3 text-s2 font-semibold font-sans text-grey-900">
                            Unavailable
                          </Text>
                        </View>

                        <Pressable accessibilityRole="button" onPress={() => addSlot(day.key)}>
                          <Ionicons
                            name="add-circle-outline"
                            size={22}
                            color={primitiveColors['grey-900']}
                          />
                        </Pressable>
                      </View>
                    ),
                  )}
                </View>
              </View>

              <View className="gap-4">
                <Pressable
                  onPress={() => setBookingLimitExpanded((current) => !current)}
                  className="bg-primary-50 px-4 py-[10px]"
                  accessibilityRole="button"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="w-[254px] gap-2">
                      <Text className="text-s1 font-semibold font-sans text-grey-900">
                        Booking Limit Settings
                      </Text>
                      <Text className="text-b3 font-sans text-grey-600">
                        Manage how many booking per day
                      </Text>
                    </View>

                    <Ionicons
                      name={bookingLimitExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
                      size={20}
                      color={primitiveColors['grey-900']}
                    />
                  </View>
                </Pressable>

                {bookingLimitExpanded ? (
                  <View className="gap-6">
                    <View className="gap-4">
                      <View className="gap-2">
                        <Text className="text-s2 font-semibold font-sans text-grey-900">
                          Buffer time
                        </Text>
                        <Text className="text-b3 font-sans text-grey-900">
                          Manage break time after each appointment
                        </Text>
                      </View>

                      <View className="flex-row items-center gap-3">
                        <Checkbox
                          checked={settings.bookingLimits.bufferEnabled}
                          onPress={() =>
                            setSettings((current) => ({
                              ...current,
                              bookingLimits: {
                                ...current.bookingLimits,
                                bufferEnabled: !current.bookingLimits.bufferEnabled,
                              },
                            }))
                          }
                        />
                        <View className="flex-1">
                          <SelectInput
                            options={[...BUFFER_OPTIONS]}
                            value={String(settings.bookingLimits.bufferDurationMinutes)}
                            disabled={!settings.bookingLimits.bufferEnabled}
                            onChange={(value) =>
                              setSettings((current) => ({
                                ...current,
                                bookingLimits: {
                                  ...current.bookingLimits,
                                  bufferDurationMinutes: Number(value) as 10 | 15 | 30 | 45,
                                },
                              }))
                            }
                          />
                        </View>
                      </View>
                    </View>

                    <View className="gap-4">
                      <View className="gap-2">
                        <Text className="text-s2 font-semibold font-sans text-grey-900">
                          Maximum booking per day
                        </Text>
                        <Text className="text-b3 font-sans text-grey-900">
                          Limit how many booking you want to take per day
                        </Text>
                      </View>

                      <View className="flex-row items-start gap-3">
                        <View className="pt-3">
                          <Checkbox
                            checked={settings.bookingLimits.dailyLimitEnabled}
                            onPress={() =>
                              setSettings((current) => ({
                                ...current,
                                bookingLimits: {
                                  ...current.bookingLimits,
                                  dailyLimitEnabled: !current.bookingLimits.dailyLimitEnabled,
                                },
                              }))
                            }
                          />
                        </View>
                        <View className="flex-1">
                          <Input
                            value={settings.bookingLimits.dailyLimit}
                            onChangeText={(value) => {
                              setSettings((current) => ({
                                ...current,
                                bookingLimits: {
                                  ...current.bookingLimits,
                                  dailyLimit: value.replace(/[^0-9]/g, ''),
                                },
                              }));
                              setDailyLimitError(null);
                            }}
                            keyboardType="number-pad"
                            editable={settings.bookingLimits.dailyLimitEnabled}
                            disabled={!settings.bookingLimits.dailyLimitEnabled}
                            status={dailyLimitError ? 'error' : 'default'}
                            helperText={dailyLimitError ?? undefined}
                            placeholder="4"
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View className="absolute bottom-0 left-0 right-0 bg-white px-4 pb-8 pt-8">
          <Button label="Save" onPress={handleSave} size="large" fullWidth />
        </View>
      </View>

      {Platform.OS === 'ios' ? (
        <Modal
          visible={pickerTarget != null}
          transparent
          animationType="slide"
          onRequestClose={closePicker}
        >
          <Pressable className="flex-1 bg-black/40" onPress={closePicker} accessible={false}>
            <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl pb-8">
              <View className="flex-row items-center justify-between px-5 pt-4 pb-2 border-b border-grey-200">
                <Pressable onPress={closePicker}>
                  <Text className="text-b2 font-sans text-grey-500">Cancel</Text>
                </Pressable>
                <Pressable onPress={confirmIosPicker}>
                  <Text className="text-b2 font-semibold font-sans text-primary-500">Done</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={iosPickerValue}
                mode={pickerMode}
                display="spinner"
                onChange={handlePickerChange}
              />
            </View>
          </Pressable>
        </Modal>
      ) : pickerTarget ? (
        <DateTimePicker
          value={androidDateValue}
          mode={pickerMode}
          display="default"
          onChange={handlePickerChange}
        />
      ) : null}
    </SafeAreaView>
  );
}
