import { useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ComponentProps } from 'react';
import { Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTranslation } from 'react-i18next';

export interface InAppCallWebViewProps {
  url: string;
  onBack: () => void;
}

export function InAppCallWebView({ url, onBack }: InAppCallWebViewProps) {
  const { t } = useTranslation();
  const webviewRef = useRef<WebView>(null);
  const mediaCapturePermissionGrantType: ComponentProps<
    typeof WebView
  >['mediaCapturePermissionGrantType'] =
    Platform.OS === 'android' ? 'grant' : undefined;

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      <View className="px-4 pt-3 pb-3 flex-row items-center justify-between bg-black">
        <Pressable onPress={onBack} accessibilityRole="button">
          <Text className="text-white font-sans">{t('common.back')}</Text>
        </Pressable>
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => webviewRef.current?.reload()}
            accessibilityRole="button"
          >
            <Text className="text-white font-sans">{t('common.retry', { defaultValue: 'Reload' })}</Text>
          </Pressable>
        </View>
      </View>

      <WebView
        ref={webviewRef}
        source={{ uri: url }}
        style={{ flex: 1, backgroundColor: 'black' }}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        mediaCapturePermissionGrantType={mediaCapturePermissionGrantType}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
      />
    </SafeAreaView>
  );
}

