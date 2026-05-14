import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Alert } from '@shared/components/ui/Alert';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { useDoctorForgotPassword } from '../hooks/useDoctorForgotPassword';
import { TabletContainer } from '@shared/components/ui/TabletContainer';

export interface DoctorForgotPasswordViewProps {
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

export function DoctorForgotPasswordView({ onSuccess }: DoctorForgotPasswordViewProps) {
  const { t } = useTranslation();
  const { email, emailError, status, setEmail, handleSubmit } = useDoctorForgotPassword();

  const isLoading = status === 'loading';

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
          <View className="flex-1 px-4 pt-[148px] justify-between pb-[281px]">
            <View className="gap-8">
              <View className="gap-2">
                <Text className="text-h4 font-semibold font-sans text-grey-900">
                  {t('doctorForgotPassword.title')}
                </Text>
                <Text className="text-b2 font-sans text-grey-500">
                  {t('doctorForgotPassword.subtitle')}
                </Text>
              </View>

              <View className="gap-6">
                <Input
                  placeholder={t('doctorForgotPassword.emailPlaceholder')}
                  value={email}
                  onChangeText={setEmail}
                  status={emailError ? 'error' : 'default'}
                  helperText={emailError ? t(emailError) : undefined}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  disabled={isLoading}
                />

                {status === 'error' && (
                  <Alert
                    status="error"
                    variant="outline"
                    description={t('doctorForgotPassword.errors.submitFailed')}
                  />
                )}

                <Button
                  label={t('doctorForgotPassword.sendCode')}
                  onPress={() => handleSubmit(onSuccess)}
                  variant="filled"
                  size="large"
                  fullWidth
                  disabled={isLoading || !email.trim()}
                  iconLeft={
                    isLoading ? <ActivityIndicator size="small" color="#ffffff" /> : undefined
                  }
                />
              </View>
            </View>

            <View className="flex-row justify-center items-center">
              <Text className="text-b1 font-sans text-grey-900">
                {t('doctorForgotPassword.noCode')}{' '}
              </Text>
              <Pressable onPress={() => handleSubmit(onSuccess)} accessibilityRole="button">
                {({ pressed }) => (
                  <Text
                    className={[
                      'text-s2 font-sans text-primary-500',
                      pressed ? 'opacity-50' : '',
                    ].join(' ')}
                  >
                    {t('doctorForgotPassword.resendCode')}
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
