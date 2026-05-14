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
import { primitiveColors } from '@design/tokens';
import type { DoctorLoginMethod } from '../types/doctor.types';
import { useDoctorLogin } from '../hooks/useDoctorLogin';
import { TabletContainer } from '@shared/components/ui/TabletContainer';
import { useState } from 'react';

export interface DoctorLoginViewProps {
  onSuccess: () => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
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

const METHOD_OPTIONS: {
  method: DoctorLoginMethod;
  labelKey: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
    { method: 'email', labelKey: 'doctorLogin.methodEmail', icon: 'mail' },
    { method: 'phone', labelKey: 'doctorLogin.methodPhone', icon: 'call-outline' },
  ];

function MethodSelector({
  selected,
  onSelect,
}: {
  selected: DoctorLoginMethod;
  onSelect: (method: DoctorLoginMethod) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = METHOD_OPTIONS.find((option) => option.method === selected) ?? METHOD_OPTIONS[0];

  return (
    <View className="relative z-50">
      <Pressable
        onPress={() => setOpen((prev) => !prev)}
        className="flex-row items-center gap-2 bg-grey-50 border-[1.5px] border-grey-200 rounded-xl px-2 py-3 w-[135px] h-12"
        accessibilityRole="combobox"
        accessibilityLabel={t('doctorLogin.methodSelectorLabel')}
      >
        <Ionicons name={current.icon} size={20} color={primitiveColors['grey-900']} />
        <Text className="flex-1 text-b3 font-sans text-grey-400" numberOfLines={2}>
          {t(current.labelKey)}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={primitiveColors['grey-400']}
        />
      </Pressable>

      {open && (
        <View className="absolute right-0 top-[52px] bg-white rounded-xl w-[160px] overflow-hidden border border-grey-200">
          {METHOD_OPTIONS.map((option) => (
            <Pressable
              key={option.method}
              onPress={() => {
                onSelect(option.method);
                setOpen(false);
              }}
              className={[
                'flex-row items-center gap-3 px-4 py-3',
                selected === option.method ? 'bg-primary-50' : 'bg-white',
              ].join(' ')}
            >
              <Ionicons
                name={option.icon}
                size={18}
                color={
                  selected === option.method
                    ? primitiveColors['primary-500']
                    : primitiveColors['grey-600']
                }
              />
              <Text
                className={[
                  'flex-1 text-b3 font-sans',
                  selected === option.method
                    ? 'text-primary-500 font-semibold'
                    : 'text-grey-700',
                ].join(' ')}
                numberOfLines={2}
              >
                {t(option.labelKey)}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export function DoctorLoginView({
  onSuccess,
  onForgotPassword,
  onSignUp,
}: DoctorLoginViewProps) {
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
  } = useDoctorLogin();

  const isLoading = status === 'loading';
  const isDisabled = isLoading || !isFormValid;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="bg-primary-50 h-[66px] justify-end">
        <View className="h-[48px] items-center justify-center pb-3">
          <AppLogo />
        </View>
      </View>

      <TabletContainer>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-4 pt-[37px] pb-10 gap-8"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-row items-start justify-between">
              <View className="gap-2 flex-1 mr-3 w-[208px]">
                <Text className="text-h4 font-semibold font-sans text-grey-900">
                  {t('doctorLogin.title')}
                </Text>
                <Text className="text-b1 font-sans text-grey-500">
                  {t('doctorLogin.subtitle')}
                </Text>
              </View>
              <MethodSelector selected={signInMethod} onSelect={setSignInMethod} />
            </View>

            <View className="gap-4">
              {signInMethod === 'email' ? (
                <Input
                  placeholder={t('doctorLogin.emailPlaceholder')}
                  value={form.email}
                  onChangeText={(value) => handleChange('email', value)}
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
                  onChangeText={(value) => handleChange('phone', value)}
                  onChangeCountryCode={(code) => handleChange('phoneCountryCode', code)}
                  onBlur={() => handleBlur('phone')}
                  status={errors.phone ? 'error' : 'default'}
                  helperText={errors.phone ? t(errors.phone) : undefined}
                  placeholder={t('doctorLogin.phonePlaceholder')}
                  disabled={isLoading}
                />
              )}

              <View className="gap-2">
                <Input
                  placeholder={t('doctorLogin.passwordPlaceholder')}
                  value={form.password}
                  onChangeText={(value) => handleChange('password', value)}
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
                        showPassword
                          ? t('doctorLogin.hidePassword')
                          : t('doctorLogin.showPassword')
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

                <View className="items-end">
                  <Pressable
                    onPress={onForgotPassword}
                    accessibilityRole="link"
                    disabled={isLoading}
                  >
                    <Text className="text-btn-medium font-sans text-primary-500">
                      {t('doctorLogin.forgotPassword')}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {status === 'error' && (
              <Alert
                status="error"
                variant="outline"
                description={t('doctorLogin.errors.submitFailed')}
              />
            )}

            <Button
              label={t('doctorLogin.logIn')}
              onPress={() => handleSubmit(onSuccess)}
              variant="filled"
              size="large"
              fullWidth
              disabled={isDisabled}
              iconLeft={isLoading ? <ActivityIndicator size="small" color="#ffffff" /> : undefined}
            />

            <View className="flex-row justify-center items-center pt-[167px]">
              <Text className="text-b1 font-sans text-grey-900">
                {t('doctorLogin.noAccount')}{' '}
              </Text>
              <Pressable onPress={onSignUp} accessibilityRole="button" disabled={isLoading}>
                {({ pressed }) => (
                  <Text
                    className={[
                      'text-s2 font-sans text-primary-500',
                      pressed ? 'opacity-50' : '',
                    ].join(' ')}
                  >
                    {t('doctorLogin.signUp')}
                  </Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TabletContainer>
    </SafeAreaView>
  );
}
