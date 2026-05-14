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
import { primitiveColors } from '@design/tokens';
import { useDonorLogin } from '../hooks/useDonorLogin';
import { TabletContainer } from '@shared/components/ui/TabletContainer';

export interface DonorLoginViewProps {
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

export function DonorLoginView({ onSuccess, onForgotPassword, onSignUp }: DonorLoginViewProps) {
  const { t } = useTranslation();
  const {
    form,
    errors,
    status,
    isFormValid,
    showPassword,
    handleChange,
    handleBlur,
    toggleShowPassword,
    handleSubmit,
  } = useDonorLogin();

  const isLoading = status === 'loading';
  const isDisabled = isLoading || !isFormValid;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
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
            contentContainerClassName="px-4 pt-8 pb-10 gap-8"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            <View className="gap-2">
              <Text className="text-h4 font-semibold font-sans text-grey-900">
                {t('donorLogin.title')}
              </Text>
              <Text className="text-b1 font-sans text-grey-600">
                {t('donorLogin.subtitle')}
              </Text>
            </View>

            {/* Fields */}
            <View className="gap-4">
              <Input
                placeholder={t('donorLogin.emailPlaceholder')}
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

              {/* Password + forgot password */}
              <View className="gap-2">
                <Input
                  placeholder={t('donorLogin.passwordPlaceholder')}
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
                        showPassword ? t('donorLogin.hidePassword') : t('donorLogin.showPassword')
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
                    <Text className="text-[14px] font-semibold font-sans text-primary-500">
                      {t('donorLogin.forgotPassword')}
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
                description={t('donorLogin.errors.submitFailed')}
              />
            )}

            {/* Log In button */}
            <Button
              label={t('donorLogin.logIn')}
              onPress={() => handleSubmit(onSuccess)}
              variant="filled"
              size="large"
              fullWidth
              disabled={isDisabled}
              iconLeft={isLoading ? <ActivityIndicator size="small" color="#ffffff" /> : undefined}
            />

            {/* Sign up link */}
            <View className="flex-row justify-center items-center">
              <Text className="text-b1 font-sans text-grey-900">
                {t('donorLogin.noAccount')}{' '}
              </Text>
              <Pressable onPress={onSignUp} accessibilityRole="button" disabled={isLoading}>
                {({ pressed }) => (
                  <Text
                    className={[
                      'text-s2 font-sans text-primary-500',
                      pressed ? 'opacity-50' : '',
                    ].join(' ')}
                  >
                    {t('donorLogin.signUp')}
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
