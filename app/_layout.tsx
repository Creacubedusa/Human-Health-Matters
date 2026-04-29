import '../global.css';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from '@shared/i18n/config';
import { kvGet } from '@shared/storage/kv';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    async function prepare() {
      const stored = await kvGet('app_language');
      if (stored && stored !== i18n.language) {
        await i18n.changeLanguage(stored);
      }
      SplashScreen.hideAsync();
    }
    prepare();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <Stack screenOptions={{ headerShown: false }} />
    </I18nextProvider>
  );
}
