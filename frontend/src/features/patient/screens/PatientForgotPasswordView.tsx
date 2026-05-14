import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Alert } from '@shared/components/ui/Alert';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { usePatientForgotPassword } from '../hooks/usePatientForgotPassword';
import { TabletContainer } from '@shared/components/ui/TabletContainer';

export interface PatientForgotPasswordViewProps {
  onSuccess: () => void;
  onBack: () => void;
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

export function PatientForgotPasswordView({ onSuccess, onBack }: PatientForgotPasswordViewProps) {
  const { t } = useTranslation();
  const { identifier, identifierError, status, setIdentifier, handleSubmit } =
    usePatientForgotPassword();

  const isLoading = status === 'loading';

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
          <View className="flex-1 px-4 pt-8 gap-8">
            {/* Title */}
            <View className="gap-2">
              <Text className="text-h4 font-semibold font-sans text-grey-900">
                {t('patientForgotPassword.title')}
              </Text>
              <Text className="text-b1 font-sans text-grey-600">
                {t('patientForgotPassword.subtitle')}
              </Text>
            </View>

            {/* Email / phone input */}
            <Input
              placeholder={t('patientForgotPassword.identifierPlaceholder')}
              value={identifier}
              onChangeText={setIdentifier}
              status={identifierError ? 'error' : 'default'}
              helperText={identifierError ? t(identifierError) : undefined}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              disabled={isLoading}
            />

            {/* Server error */}
            {status === 'error' && (
              <Alert
                status="error"
                variant="outline"
                description={t('patientForgotPassword.errors.submitFailed')}
              />
            )}

            {/* Send Code button */}
            <Button
              label={t('patientForgotPassword.sendCode')}
              onPress={() => handleSubmit(onSuccess)}
              variant="filled"
              size="large"
              fullWidth
              disabled={isLoading || !identifier.trim()}
              iconLeft={isLoading ? <ActivityIndicator size="small" color="#ffffff" /> : undefined}
            />

            {/* Back to login */}
            <View className="flex-row justify-center items-center">
              <Text className="text-b1 font-sans text-grey-900">
                {t('patientForgotPassword.rememberPassword')}{' '}
              </Text>
              <Pressable onPress={onBack} accessibilityRole="button" disabled={isLoading}>
                {({ pressed }) => (
                  <Text
                    className={['text-s2 font-sans text-primary-500', pressed ? 'opacity-50' : ''].join(' ')}
                  >
                    {t('patientForgotPassword.backToLogin')}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TabletContainer>
    </SafeAreaView>
  );
}
