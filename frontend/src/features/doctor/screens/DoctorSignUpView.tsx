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
import { useDoctorSignUp } from '@features/doctor/hooks/useDoctorSignUp';
import { primitiveColors } from '@design/tokens';

export interface DoctorSignUpViewProps {
  onSuccess: () => void;
  onSignIn: () => void;
}

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

const PASS_COLOR = primitiveColors['primary-500'] as string;
const FAIL_COLOR = primitiveColors['red-500'] as string;

function StrengthRow({ passing, label }: { passing: boolean; label: string }) {
  return (
    <View className="flex-row items-center gap-2">
      <Ionicons
        name={passing ? 'checkmark-circle' : 'close-circle'}
        size={16}
        color={passing ? PASS_COLOR : FAIL_COLOR}
      />
      <Text className={['text-b3 font-sans', passing ? 'text-grey-900' : 'text-red-500'].join(' ')}>
        {label}
      </Text>
    </View>
  );
}

export function DoctorSignUpView({ onSuccess, onSignIn }: DoctorSignUpViewProps) {
  const { t } = useTranslation();
  const {
    form,
    errors,
    passwordStrength,
    status,
    errorMessage,
    isFormValid,
    showPassword,
    handleChange,
    handleBlur,
    toggleShowPassword,
    handleSubmit,
  } = useDoctorSignUp();

  const isLoading = status === 'loading';
  const isDisabled = isLoading || !isFormValid;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* ── Header ── */}
      <View className="bg-primary-50 h-[66px] justify-end">
        <View className="h-[48px] items-center justify-center pb-3">
          <AppLogo />
        </View>
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
          {/* ── Title block ── */}
          <View className="gap-2">
            <Text className="text-h4 font-semibold font-sans text-grey-900">
              {t('doctorSignUp.title')}
            </Text>
            <Text className="text-b2 font-sans text-grey-600">
              {t('doctorSignUp.subtitle')}
            </Text>
          </View>

          {/* ── Fields ── */}
          <View className="gap-4">
            <Input
              placeholder={t('doctorSignUp.firstName')}
              value={form.firstName}
              onChangeText={(v) => handleChange('firstName', v)}
              onBlur={() => handleBlur('firstName')}
              status={errors.firstName ? 'error' : 'default'}
              helperText={errors.firstName ? t(errors.firstName) : undefined}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              disabled={isLoading}
            />

            <Input
              placeholder={t('doctorSignUp.lastName')}
              value={form.lastName}
              onChangeText={(v) => handleChange('lastName', v)}
              onBlur={() => handleBlur('lastName')}
              status={errors.lastName ? 'error' : 'default'}
              helperText={errors.lastName ? t(errors.lastName) : undefined}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              disabled={isLoading}
            />

            <Input
              placeholder={t('doctorSignUp.email')}
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

            <PhoneInput
              value={form.phone}
              onChangeText={(v) => handleChange('phone', v)}
              onChangeCountryCode={(code) => handleChange('phoneCountryCode', code)}
              onBlur={() => handleBlur('phone')}
              status={errors.phone ? 'error' : 'default'}
              helperText={errors.phone ? t(errors.phone) : undefined}
              placeholder={t('doctorSignUp.phone')}
              disabled={isLoading}
            />

            <View className="gap-3">
              <Input
                placeholder={t('doctorSignUp.password')}
                value={form.password}
                onChangeText={(v) => handleChange('password', v)}
                onBlur={() => handleBlur('password')}
                secureTextEntry={!showPassword}
                status={errors.password ? 'error' : 'default'}
                helperText={errors.password ? t(errors.password) : undefined}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                disabled={isLoading}
                iconRight={
                  <Pressable
                    onPress={toggleShowPassword}
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword
                        ? t('doctorSignUp.hidePassword')
                        : t('doctorSignUp.showPassword')
                    }
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={24}
                      color={primitiveColors['grey-400'] as string}
                    />
                  </Pressable>
                }
              />

              {/* Password strength checklist follows the existing shared signup behavior. */}
              {form.password.length > 0 && (
                <View className="gap-2 pl-1">
                  <Text className="text-b3 font-sans text-grey-900">
                    {t('doctorSignUp.passwordStrengthTitle')}
                  </Text>
                  <View className="gap-2">
                    <StrengthRow passing={passwordStrength.minLength} label={t('doctorSignUp.passwordRule8Chars')} />
                    <StrengthRow passing={passwordStrength.hasNumber}  label={t('doctorSignUp.passwordRule1Number')} />
                    <StrengthRow passing={passwordStrength.hasSpecial} label={t('doctorSignUp.passwordRule1Special')} />
                    <StrengthRow passing={passwordStrength.hasUpper}   label={t('doctorSignUp.passwordRule1Upper')} />
                    <StrengthRow passing={passwordStrength.hasLower}   label={t('doctorSignUp.passwordRule1Lower')} />
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* ── Server error ── */}
          {status === 'error' && (
            <Alert
              status="error"
              variant="outline"
              title={t('doctorSignUp.errors.submitFailedTitle')}
              description={errorMessage ?? t('doctorSignUp.errors.submitFailed')}
            />
          )}

          {/* ── Submit section ── */}
          <View className="gap-4">
            <View className="flex-row flex-wrap">
              <Text className="text-b1 font-sans text-grey-900">
                {t('doctorSignUp.termsPrefix')}{' '}
              </Text>
              <Pressable accessibilityRole="link">
                <Text className="text-s2 font-sans text-primary-500">
                  {t('doctorSignUp.terms')}
                </Text>
              </Pressable>
            </View>

            <Button
              label={t('doctorSignUp.signUp')}
              onPress={() => handleSubmit(onSuccess)}
              variant="filled"
              size="large"
              fullWidth
              disabled={isDisabled}
              iconLeft={isLoading ? <ActivityIndicator size="small" color="#ffffff" /> : undefined}
            />
          </View>

          {/* ── Sign in link ── */}
          <View className="flex-row justify-center items-center">
            <Text className="text-b1 font-sans text-grey-900">
              {t('doctorSignUp.haveAccount')}{' '}
            </Text>
            <Pressable onPress={onSignIn} accessibilityRole="button">
              {({ pressed }) => (
                <Text
                  className={['text-s2 font-sans text-primary-500', pressed ? 'opacity-50' : ''].join(' ')}
                >
                  {t('doctorSignUp.signIn')}
                </Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
