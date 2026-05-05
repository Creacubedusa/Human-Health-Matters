import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/components/ui/Button';
import { HHMSIllustration } from '@shared/components/ui/HHMSIllustration';

export interface DonorGetStartedViewProps {
  onSignUp: () => void;
  onLogin: () => void;
  onGuestDonate: () => void;
}

export function DonorGetStartedView({ onSignUp, onLogin, onGuestDonate }: DonorGetStartedViewProps) {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-4 gap-12">
        <View className="opacity-25 py-14">
          <HHMSIllustration />
        </View>
        <View className="w-full items-center gap-2">
          <Text className="text-h4 font-semibold text-grey-900 text-center">
            {t('donorGetStarted.title')}
          </Text>
          <Text className="text-b2 text-grey-400 text-center">
            {t('donorGetStarted.subtitle')}
          </Text>
        </View>
        <View className="w-full gap-[15px]">
          <Button
            label={t('donorGetStarted.signUp')}
            variant="filled"
            size="large"
            fullWidth
            onPress={onSignUp}
            testID="btn-sign-up"
          />
          <Button
            label={t('donorGetStarted.logIn')}
            variant="outline"
            size="large"
            fullWidth
            onPress={onLogin}
            testID="btn-log-in"
          />
          <Button
            label={t('donorGetStarted.donateAsGuest')}
            variant="outline"
            size="large"
            fullWidth
            onPress={onGuestDonate}
            testID="btn-donate-as-guest"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
