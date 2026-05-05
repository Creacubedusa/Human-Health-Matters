import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from '@shared/components/ui/Alert';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { primitiveColors } from '@design/tokens';
import { useDoctorSetPassword } from '../hooks/useDoctorSetPassword';

export interface DoctorSetPasswordViewProps {
  onSuccess: () => void;
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

export function DoctorSetPasswordView({ onSuccess }: DoctorSetPasswordViewProps) {
  const { t } = useTranslation();
  const {
    form,
    errors,
    status,
    isFormValid,
    showNewPassword,
    showConfirmPassword,
    handleChange,
    toggleShowNewPassword,
    toggleShowConfirmPassword,
    handleSubmit,
  } = useDoctorSetPassword();

  const isLoading = status === 'loading';
  const isDisabled = isLoading || !isFormValid;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="bg-primary-50 h-[66px] justify-end">
        <View className="h-[48px] items-center justify-center pb-3">
          <AppLogo />
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 px-4 pt-[148px] justify-between pb-[281px]">
          <View className="gap-8">
            <View className="gap-2">
              <Text className="text-h4 font-semibold font-sans text-grey-900">
                {t('doctorSetPassword.title')}
              </Text>
              <Text className="text-b2 font-sans text-grey-500">
                {t('doctorSetPassword.subtitle')}
              </Text>
            </View>

            <View className="gap-4">
              <Input
                placeholder={t('doctorSetPassword.newPasswordPlaceholder')}
                value={form.newPassword}
                onChangeText={(value) => handleChange('newPassword', value)}
                secureTextEntry={!showNewPassword}
                status={errors.newPassword ? 'error' : 'default'}
                helperText={errors.newPassword ? t(errors.newPassword) : undefined}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                disabled={isLoading}
                iconRight={
                  <Pressable onPress={toggleShowNewPassword} accessibilityRole="button">
                    <Ionicons
                      name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={24}
                      color={primitiveColors['grey-400']}
                    />
                  </Pressable>
                }
              />

              <Input
                placeholder={t('doctorSetPassword.confirmPasswordPlaceholder')}
                value={form.confirmPassword}
                onChangeText={(value) => handleChange('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
                status={errors.confirmPassword ? 'error' : 'default'}
                helperText={errors.confirmPassword ? t(errors.confirmPassword) : undefined}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                disabled={isLoading}
                iconRight={
                  <Pressable onPress={toggleShowConfirmPassword} accessibilityRole="button">
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={24}
                      color={
                        errors.confirmPassword
                          ? primitiveColors['red-500']
                          : primitiveColors['grey-400']
                      }
                    />
                  </Pressable>
                }
              />
            </View>

            {status === 'error' && (
              <Alert
                status="error"
                variant="outline"
                description={t('doctorSetPassword.errors.submitFailed')}
              />
            )}

            <Button
              label={t('doctorSetPassword.changePassword')}
              onPress={() => handleSubmit(onSuccess)}
              variant="filled"
              size="large"
              fullWidth
              disabled={isDisabled}
              iconLeft={
                isLoading ? <ActivityIndicator size="small" color="#ffffff" /> : undefined
              }
            />
          </View>

          <View className="flex-row justify-center items-center">
            <Text className="text-b1 font-sans text-grey-900">
              {t('doctorSetPassword.noCode')}{' '}
            </Text>
            <Text className="text-s2 font-sans text-primary-500">
              {t('doctorSetPassword.resendCode')}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
