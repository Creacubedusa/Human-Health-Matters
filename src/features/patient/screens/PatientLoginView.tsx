import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from '@shared/components/ui/Alert';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { PhoneInput } from '@shared/components/ui/PhoneInput';
import { usePatientLogin } from '../hooks/usePatientLogin';
import { primitiveColors } from '@design/tokens';
import type { LoginMethod } from '../types/patient.types';
import { useState } from 'react';

export interface PatientLoginViewProps {
  onSuccess: () => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
}

// ── HHMS logo — same pattern as sign-up screen ────────────────────────────────

function AppLogo() {
  return (
    <View className="flex-row items-center gap-[6px]">
      <View className="w-10 h-10 rounded-lg bg-green-50 items-center justify-center">
        <View className="w-9 h-9 rounded-md bg-primary-500 items-center justify-center">
          <Text className="text-white font-semibold font-sans text-[19px]">H</Text>
        </View>
      </View>
      <Text className="font-semibold font-sans text-[19px] text-grey-900">HHMS</Text>
    </View>
  );
}

// ── Method selector dropdown (135×48px, Figma exact) ─────────────────────────

const METHOD_OPTIONS: { method: LoginMethod; labelKey: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { method: 'email', labelKey: 'patientLogin.methodEmail', icon: 'mail-outline' },
  { method: 'phone', labelKey: 'patientLogin.methodPhone', icon: 'call-outline' },
];

function MethodSelector({
  selected,
  onSelect,
}: {
  selected: LoginMethod;
  onSelect: (m: LoginMethod) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = METHOD_OPTIONS.find((o) => o.method === selected)!;

  return (
    <View className="relative">
      {/* Selector trigger */}
      <Pressable
        onPress={() => setOpen((prev) => !prev)}
        className="flex-row items-center gap-2 bg-grey-50 border-[1.5px] border-grey-200 rounded-xl px-2 py-3 w-[135px]"
        accessibilityRole="combobox"
        accessibilityLabel={t('patientLogin.methodSelectorLabel')}
      >
        <Ionicons name={current.icon} size={18} color={primitiveColors['grey-700']} />
        <Text className="flex-1 text-[14px] font-sans text-grey-500" numberOfLines={1}>
          {t(current.labelKey)}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={14}
          color={primitiveColors['grey-500']}
        />
      </Pressable>

      {/* Inline absolute dropdown — no Modal, no opacity hacks */}
      {open && (
        <View
          className="absolute right-0 top-[52px] bg-white rounded-xl w-[160px] overflow-hidden z-50 border border-grey-100"
          style={{ elevation: 8 }}
        >
          {METHOD_OPTIONS.map(({ method, labelKey, icon }) => (
            <Pressable
              key={method}
              onPress={() => { onSelect(method); setOpen(false); }}
              className={[
                'flex-row items-center gap-3 px-4 py-3',
                selected === method ? 'bg-primary-50' : 'bg-white',
              ].join(' ')}
              accessibilityRole="button"
            >
              <Ionicons
                name={icon}
                size={16}
                color={selected === method ? primitiveColors['primary-500'] : primitiveColors['grey-600']}
              />
              <Text
                className={[
                  'text-[14px] font-sans',
                  selected === method ? 'text-primary-500 font-semibold' : 'text-grey-700',
                ].join(' ')}
              >
                {t(labelKey)}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export function PatientLoginView({ onSuccess, onForgotPassword, onSignUp }: PatientLoginViewProps) {
  const { t } = useTranslation();
  const {
    form,
    errors,
    signInMethod,
    status,
    isFormValid,
    showPassword,
    setSignInMethod,
    handleChange,
    handleBlur,
    toggleShowPassword,
    handleSubmit,
  } = usePatientLogin();

  const isLoading = status === 'loading';
  const isDisabled = isLoading || !isFormValid;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="bg-primary-50 h-[120px] items-center justify-end pb-5">
        <AppLogo />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pt-8 pb-10 gap-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title row + method selector */}
          <View className="flex-row items-start justify-between">
            <View className="gap-2 flex-1 mr-3">
              <Text className="text-h4 font-semibold font-sans text-grey-900">
                {t('patientLogin.title')}
              </Text>
              <Text className="text-b1 font-sans text-grey-600">
                {t('patientLogin.subtitle')}
              </Text>
            </View>
            <MethodSelector selected={signInMethod} onSelect={setSignInMethod} />
          </View>

          {/* Fields */}
          <View className="gap-4">
            {signInMethod === 'email' ? (
              <Input
                placeholder={t('patientLogin.emailPlaceholder')}
                value={form.email}
                onChangeText={(v) => handleChange('email', v)}
                onBlur={() => handleBlur('email')}
                status={errors.email ? 'error' : 'default'}
                helperText={errors.email ? t(errors.email) : undefined}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                disabled={isLoading}
              />
            ) : (
              <PhoneInput
                value={form.phone}
                onChangeText={(v) => handleChange('phone', v)}
                onBlur={() => handleBlur('phone')}
                status={errors.phone ? 'error' : 'default'}
                helperText={errors.phone ? t(errors.phone) : undefined}
                placeholder={t('patientLogin.phonePlaceholder')}
                disabled={isLoading}
              />
            )}

            {/* Password field + Forgot Password */}
            <View className="gap-2">
              <Input
                placeholder={t('patientLogin.passwordPlaceholder')}
                value={form.password}
                onChangeText={(v) => handleChange('password', v)}
                onBlur={() => handleBlur('password')}
                secureTextEntry={!showPassword}
                status={errors.password ? 'error' : 'default'}
                helperText={errors.password ? t(errors.password) : undefined}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                disabled={isLoading}
                iconRight={
                  <Pressable
                    onPress={toggleShowPassword}
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword ? t('patientLogin.hidePassword') : t('patientLogin.showPassword')
                    }
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={24}
                      color={primitiveColors['grey-400']}
                    />
                  </Pressable>
                }
              />

              {/* Forgot Password — right-aligned */}
              <View className="items-end">
                <Pressable
                  onPress={onForgotPassword}
                  accessibilityRole="link"
                  disabled={isLoading}
                >
                  <Text className="text-[14px] font-semibold font-sans text-primary-500">
                    {t('patientLogin.forgotPassword')}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Server error */}
          {status === 'error' && (
            <Alert
              status="error"
              variant="outline"
              description={t('patientLogin.errors.submitFailed')}
            />
          )}

          {/* Log In button */}
          <Button
            label={t('patientLogin.logIn')}
            onPress={() => handleSubmit(onSuccess)}
            variant="filled"
            size="large"
            fullWidth
            disabled={isDisabled}
            iconLeft={isLoading ? <ActivityIndicator size="small" color="#ffffff" /> : undefined}
          />

          {/* Sign Up link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-b1 font-sans text-grey-900">
              {t('patientLogin.noAccount')}{' '}
            </Text>
            <Pressable onPress={onSignUp} accessibilityRole="button" disabled={isLoading}>
              {({ pressed }) => (
                <Text
                  className={[
                    'text-s2 font-sans text-primary-500',
                    pressed ? 'opacity-50' : '',
                  ].join(' ')}
                >
                  {t('patientLogin.signUp')}
                </Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
