import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/components/ui/Button';
import { HHMSIllustration } from '@shared/components/ui/HHMSIllustration';
import { TabletContainer } from '@shared/components/ui/TabletContainer';

interface PatientGetStartedViewProps {
  onSignUp: () => void;
  onLogin: () => void;
}

export function PatientGetStartedView({ onSignUp, onLogin }: PatientGetStartedViewProps) {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <TabletContainer>
        <View className="flex-1 items-center justify-center px-4 gap-12">
          <View className="opacity-25 py-14">
            <HHMSIllustration />
          </View>
          <View className="w-full items-center gap-2">
            <Text className="text-h4 font-semibold text-grey-900 text-center">
              {t('patientGetStarted.title')}
            </Text>
            <Text className="text-b2 text-grey-400 text-center">
              {t('patientGetStarted.subtitle')}
            </Text>
          </View>
          <View className="w-full gap-[15px]">
            <Button
              label={t('patientGetStarted.signUp')}
              variant="filled"
              size="large"
              fullWidth
              onPress={onSignUp}
              testID="btn-sign-up"
            />
            <Button
              label={t('patientGetStarted.logIn')}
              variant="outline"
              size="large"
              fullWidth
              onPress={onLogin}
              testID="btn-log-in"
            />
          </View>
        </View>
      </TabletContainer>
    </SafeAreaView>
  );
}
