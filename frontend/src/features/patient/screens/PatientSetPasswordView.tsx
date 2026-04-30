import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from '@shared/components/ui/Alert';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { usePatientSetPassword } from '../hooks/usePatientSetPassword';
import { primitiveColors } from '@design/tokens';

export interface PatientSetPasswordViewProps {
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

export function PatientSetPasswordView({ onSuccess }: PatientSetPasswordViewProps) {
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
  } = usePatientSetPassword();

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

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 px-4 pt-8 gap-8">
          {/* Title */}
          <View className="gap-2">
            <Text className="text-h4 font-semibold font-sans text-grey-900">
              {t('patientSetPassword.title')}
            </Text>
            <Text className="text-b1 font-sans text-grey-600">
              {t('patientSetPassword.subtitle')}
            </Text>
          </View>

          {/* Fields */}
          <View className="gap-4">
            <Input
              placeholder={t('patientSetPassword.newPasswordPlaceholder')}
              value={form.newPassword}
              onChangeText={(v) => handleChange('newPassword', v)}
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
              placeholder={t('patientSetPassword.confirmPasswordPlaceholder')}
              value={form.confirmPassword}
              onChangeText={(v) => handleChange('confirmPassword', v)}
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
                    color={primitiveColors['grey-400']}
                  />
                </Pressable>
              }
            />
          </View>

          {/* Server error */}
          {status === 'error' && (
            <Alert
              status="error"
              variant="outline"
              description={t('patientSetPassword.errors.submitFailed')}
            />
          )}

          {/* Change Password button */}
          <Button
            label={t('patientSetPassword.changePassword')}
            onPress={() => handleSubmit(onSuccess)}
            variant="filled"
            size="large"
            fullWidth
            disabled={isDisabled}
            iconLeft={isLoading ? <ActivityIndicator size="small" color="#ffffff" /> : undefined}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
