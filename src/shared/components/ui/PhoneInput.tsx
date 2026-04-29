import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import type { InputStatus } from './Input';

// ── Country list ──────────────────────────────────────────────────────────────

interface Country {
  code: string;
  dialCode: string;
  name: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { code: 'US', dialCode: '+1',   name: 'United States',  flag: '🇺🇸' },
  { code: 'CA', dialCode: '+1',   name: 'Canada',         flag: '🇨🇦' },
  { code: 'GB', dialCode: '+44',  name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AU', dialCode: '+61',  name: 'Australia',      flag: '🇦🇺' },
  { code: 'MX', dialCode: '+52',  name: 'Mexico',         flag: '🇲🇽' },
  { code: 'DE', dialCode: '+49',  name: 'Germany',        flag: '🇩🇪' },
  { code: 'FR', dialCode: '+33',  name: 'France',         flag: '🇫🇷' },
  { code: 'ES', dialCode: '+34',  name: 'Spain',          flag: '🇪🇸' },
  { code: 'IT', dialCode: '+39',  name: 'Italy',          flag: '🇮🇹' },
  { code: 'BR', dialCode: '+55',  name: 'Brazil',         flag: '🇧🇷' },
  { code: 'IN', dialCode: '+91',  name: 'India',          flag: '🇮🇳' },
  { code: 'NG', dialCode: '+234', name: 'Nigeria',        flag: '🇳🇬' },
  { code: 'ZA', dialCode: '+27',  name: 'South Africa',   flag: '🇿🇦' },
  { code: 'AE', dialCode: '+971', name: 'UAE',            flag: '🇦🇪' },
  { code: 'SA', dialCode: '+966', name: 'Saudi Arabia',   flag: '🇸🇦' },
  { code: 'PH', dialCode: '+63',  name: 'Philippines',    flag: '🇵🇭' },
  { code: 'PK', dialCode: '+92',  name: 'Pakistan',       flag: '🇵🇰' },
  { code: 'JP', dialCode: '+81',  name: 'Japan',          flag: '🇯🇵' },
  { code: 'KR', dialCode: '+82',  name: 'South Korea',    flag: '🇰🇷' },
  { code: 'CN', dialCode: '+86',  name: 'China',          flag: '🇨🇳' },
];

// ── Props ─────────────────────────────────────────────────────────────────────

export interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onChangeCountryCode?: (dialCode: string) => void;
  status?: InputStatus;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  onBlur?: () => void;
  testID?: string;
}

// ── State lookup tables ───────────────────────────────────────────────────────

const CONTAINER_CLASS: Record<'default' | 'focus' | 'error' | 'disabled', string> = {
  default:  'bg-grey-50 border-grey-200',
  focus:    'bg-primary-50 border-primary-500',
  error:    'bg-red-50 border-red-500',
  disabled: 'bg-grey-50 border-grey-200',
};

const HELPER_CLASS: Record<'default' | 'error', string> = {
  default: 'text-grey-400',
  error:   'text-red-500',
};

const PLACEHOLDER_COLOR = primitiveColors['grey-400'];

// ── Component ─────────────────────────────────────────────────────────────────

export function PhoneInput({
  value,
  onChangeText,
  onChangeCountryCode,
  status = 'default',
  helperText,
  placeholder = 'Phone number',
  disabled = false,
  onBlur,
  testID,
}: PhoneInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);

  useEffect(() => {
    onChangeCountryCode?.(selectedCountry.dialCode);
  }, [onChangeCountryCode, selectedCountry.dialCode]);

  const containerState =
    disabled          ? 'disabled'
    : status === 'error' ? 'error'
    : focused         ? 'focus'
    : 'default';

  const containerClass = [
    'flex-row items-center border-2 rounded-md h-12 px-3',
    CONTAINER_CLASS[containerState === 'disabled' ? 'default' : containerState],
  ].join(' ');

  function handleSelectCountry(country: Country) {
    setSelectedCountry(country);
    onChangeCountryCode?.(country.dialCode);
    setPickerVisible(false);
  }

  return (
    <View className="w-full gap-2">
      {/* ── Input row ── */}
      <Pressable
        className={containerClass}
        onPress={() => inputRef.current?.focus()}
        accessible={false}
        disabled={disabled}
      >
        {/* Country selector button */}
        <Pressable
          className="flex-row items-center gap-1 pr-2"
          onPress={() => !disabled && setPickerVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Select country code"
        >
          <Text className="text-b1">{selectedCountry.flag}</Text>
          <Text className="text-b2 text-grey-900">{selectedCountry.dialCode}</Text>
          <Ionicons
            name="chevron-down"
            size={14}
            color={primitiveColors['grey-600']}
          />
        </Pressable>

        {/* Vertical divider */}
        <View className="w-px h-5 bg-grey-200 mr-3" />

        {/* Phone number input */}
        <TextInput
          ref={inputRef}
          className="flex-1 text-b1 text-grey-900 font-sans p-0"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={PLACEHOLDER_COLOR}
          keyboardType="phone-pad"
          editable={!disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlur?.(); }}
          testID={testID}
        />
      </Pressable>

      {helperText != null && (
        <Text className={['text-b3 font-sans', HELPER_CLASS[status === 'error' ? 'error' : 'default']].join(' ')}>
          {helperText}
        </Text>
      )}

      {/* ── Country picker modal ── */}
      <Modal
        visible={pickerVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setPickerVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setPickerVisible(false)}
          accessible={false}
        >
          {/* Bottom sheet */}
          <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl pb-8">
            {/* Handle + header */}
            <View className="items-center pt-3 pb-4 border-b border-grey-200">
              <View className="w-10 h-1 rounded-full bg-grey-300 mb-4" />
              <Text className="text-s1 font-semibold font-sans text-grey-900">
                Select Country
              </Text>
            </View>

            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item.code}
              style={{ maxHeight: 400 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable
                  className="flex-row items-center gap-3 px-5 py-3"
                  onPress={() => handleSelectCountry(item)}
                >
                  <Text className="text-b1">{item.flag}</Text>
                  <Text className="flex-1 text-b1 font-sans text-grey-900">
                    {item.name}
                  </Text>
                  <Text className="text-b2 font-sans text-grey-500">
                    {item.dialCode}
                  </Text>
                  {item.code === selectedCountry.code && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={primitiveColors['primary-500']}
                    />
                  )}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
