import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Alert } from '@shared/components/ui/Alert';
import { Button } from '@shared/components/ui/Button';
import { CodeInput } from '@shared/components/ui/CodeInput';
import { useAuthStore } from '@shared/store/auth.store';
import { useDonorVerify } from '../hooks/useDonorVerify';
import { TabletContainer } from '@shared/components/ui/TabletContainer';

const CODE_LENGTH = 6;

export interface DonorVerifyViewProps {
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

export function DonorVerifyView({ onSuccess }: DonorVerifyViewProps) {
  const { t } = useTranslation();
  const pendingEmail = useAuthStore((s) => s.pendingEmail);

  const {
    code,
    status,
    errorKey,
    timerLabel,
    canResend,
    isResending,
    handleChange,
    handleSubmit,
    handleResend,
  } = useDonorVerify();

  const isLoading = status === 'loading';
  const isComplete = code.length === CODE_LENGTH;

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
            contentContainerClassName="flex-1 items-center justify-between px-4 pt-16 pb-12"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Top: title + OTP + timer */}
            <View className="items-center gap-14 w-full">
              <View className="gap-2 w-full">
                <Text className="text-h4 font-semibold font-sans text-grey-900 text-center">
                  {t('patientVerify.title')}
                </Text>
                <View className="flex-row flex-wrap justify-center">
                  <Text className="text-b1 font-sans text-grey-900">
                    {t('patientVerify.subtitlePrefix')}{' '}
                  </Text>
                  <Text className="text-s2 font-sans text-primary-500">
                    {pendingEmail ?? ''}
                  </Text>
                </View>
              </View>

              <CodeInput
                length={CODE_LENGTH}
                value={code}
                onChangeText={handleChange}
                status={status === 'error' ? 'error' : 'default'}
                disabled={isLoading}
                testID="otp-input"
              />

              <Text className="text-h5 font-semibold font-sans text-primary-500">
                {timerLabel}
              </Text>
            </View>

            {/* Bottom: error + button + resend */}
            <View className="items-center gap-6 w-full">
              {errorKey != null && (
                <Alert status="error" variant="outline" description={t(errorKey)} />
              )}

              <Button
                label={t('patientVerify.verify')}
                onPress={() => handleSubmit(onSuccess)}
                variant="filled"
                size="large"
                fullWidth
                disabled={!isComplete || isLoading}
                iconLeft={isLoading ? <ActivityIndicator size="small" color="#ffffff" /> : undefined}
              />

              <Pressable
                onPress={handleResend}
                disabled={!canResend || isResending}
                accessibilityRole="button"
                accessibilityState={{ disabled: !canResend || isResending }}
              >
                {({ pressed }) => (
                  <View className="flex-row items-center gap-2">
                    {isResending && <ActivityIndicator size="small" color="#9ea2ae" />}
                    <Text
                      className={[
                        'text-b1 font-sans',
                        canResend && !isResending
                          ? pressed ? 'text-primary-500 opacity-50' : 'text-primary-500'
                          : 'text-grey-400',
                      ].join(' ')}
                    >
                      {t('patientVerify.resendCode')}
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TabletContainer>
    </SafeAreaView>
  );
}
