import { useState } from 'react';
import { Modal, Platform, Pressable, Text, View } from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import type { InputStatus } from './Input';

type DateOutputFormat = 'display' | 'iso';

export interface DatePickerFieldProps {
  label?: string;
  value: string;
  onChange: (date: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  status?: InputStatus;
  helperText?: string;
  disabled?: boolean;
  testID?: string;
  maximumDate?: Date;
  minimumDate?: Date;
  outputFormat?: DateOutputFormat;
}

function parseDate(value: string): Date {
  const raw = value.trim();
  if (!raw) return new Date();

  const displayMatch = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (displayMatch) {
    const [, day, month, year] = displayMatch;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  const isoDateMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDateMatch) {
    const [, year, month, day] = isoDateMatch;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function formatDisplayFromDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatIsoFromDate(date: Date): string {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0),
  ).toISOString();
}

function formatDisplay(value: string): string {
  if (!value) return '';
  const parsed = parseDate(value);
  return Number.isNaN(parsed.getTime()) ? value : formatDisplayFromDate(parsed);
}

function formatOutput(date: Date, outputFormat: DateOutputFormat): string {
  return outputFormat === 'iso' ? formatIsoFromDate(date) : formatDisplayFromDate(date);
}

const BORDER_CLASS: Record<'default' | 'error' | 'disabled', string> = {
  default: 'border-grey-200',
  error: 'border-red-500',
  disabled: 'border-grey-200',
};

const BG_CLASS: Record<'default' | 'error' | 'disabled', string> = {
  default: 'bg-grey-50',
  error: 'bg-red-50',
  disabled: 'bg-grey-50',
};

export function DatePickerField({
  label,
  value,
  onChange,
  onBlur,
  placeholder = 'DD/MM/YYYY',
  status = 'default',
  helperText,
  disabled = false,
  testID,
  maximumDate,
  minimumDate,
  outputFormat = 'display',
}: DatePickerFieldProps) {
  const [visible, setVisible] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(() => parseDate(value));

  const visualState: 'default' | 'error' | 'disabled' =
    disabled ? 'disabled' : status === 'error' ? 'error' : 'default';

  function handleChange(_: DateTimePickerEvent, selected?: Date) {
    if (Platform.OS === 'android') {
      setVisible(false);
      if (selected) {
        onChange(formatOutput(selected, outputFormat));
        onBlur?.();
      }
    } else {
      if (selected) setTempDate(selected);
    }
  }

  function handleConfirm() {
    onChange(formatOutput(tempDate, outputFormat));
    onBlur?.();
    setVisible(false);
  }

  return (
    <View className="gap-2 w-full" testID={testID}>
      {label != null && (
        <Text className="text-b2 text-grey-900 font-sans">{label}</Text>
      )}

      <Pressable
        onPress={() => !disabled && setVisible(true)}
        disabled={disabled}
        className={[
          'flex-row items-center gap-3 border-[1.5px] rounded-md p-3',
          BG_CLASS[visualState],
          BORDER_CLASS[visualState],
          disabled ? 'opacity-60' : '',
        ].join(' ')}
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
      >
        <Ionicons name="calendar-outline" size={20} color={primitiveColors['grey-500']} />
        <Text
          className={[
            'flex-1 text-b1 font-sans',
            value ? 'text-grey-900' : 'text-grey-400',
          ].join(' ')}
        >
          {value ? formatDisplay(value) : placeholder}
        </Text>
      </Pressable>

      {helperText != null && (
        <Text
          className={[
            'text-b3 font-sans',
            status === 'error' ? 'text-red-500' : 'text-grey-400',
          ].join(' ')}
        >
          {helperText}
        </Text>
      )}

      {Platform.OS === 'ios' ? (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
          <Pressable className="flex-1 bg-black/40" onPress={() => setVisible(false)} accessible={false}>
            <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl pb-8">
              <View className="flex-row items-center justify-between px-5 pt-4 pb-2 border-b border-grey-200">
                <Pressable onPress={() => setVisible(false)}>
                  <Text className="text-b2 font-sans text-grey-500">Cancel</Text>
                </Pressable>
                <Pressable onPress={handleConfirm}>
                  <Text className="text-b2 font-semibold font-sans text-primary-500">Done</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleChange}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
              />
            </View>
          </Pressable>
        </Modal>
      ) : (
        visible && (
          <DateTimePicker
            value={parseDate(value)}
            mode="date"
            display="default"
            onChange={handleChange}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
          />
        )
      )}
    </View>
  );
}
