import React from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export function SplashScreenView() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-primary-50 items-center overflow-hidden">

      {/* Main content column — starts at y=261 matching Figma */}
      <View className="w-[283px] items-center pt-[261px]">

        {/* Logo block */}
        <View className="items-center gap-4 w-[183px]">

          {/* Circular frame — light green border ring */}
          <View className="w-[183px] h-[183px] rounded-full border-2 border-green-50 items-center justify-center">
            {/* Icon tile — shadow-700 matches Figma drop shadow */}
            <View className="w-[100px] h-[100px] rounded-2xl bg-green-50 items-center justify-center shadow-700">
              {/* Brand blue square */}
              <View className="w-[90px] h-[90px] rounded-xl bg-primary-500 items-center justify-center shadow-700">
                <Text className="text-h1 font-semibold text-white">H</Text>
              </View>
            </View>
          </View>

          {/* Typography block */}
          <View className="items-center gap-1 w-[173px]">
            <Text className="text-h2 font-semibold text-grey-900 font-sans">HHMS</Text>
            <Text className="text-b2 text-grey-500 font-sans">{t('splash.subtitle')}</Text>

            {/* Tagline chip — white bg; Badge outline variant invisible on primary-50 background */}
            <View className="bg-bg-surface rounded-lg px-2 py-1.5 w-full items-center">
              <Text className="text-c3 font-semibold text-primary-500 font-sans">
                {t('splash.tagline')}
              </Text>
            </View>
          </View>
        </View>

        {/* Gap between logo block and bottom controls — 152px from Figma */}
        <View className="h-[152px]" />

        {/* Bottom controls */}
        <View className="items-center gap-4">

          {/* Page dots pill */}
          <View className="flex-row bg-grey-50 rounded-xl px-3 py-2 gap-2 items-center">
            <View className="w-2 h-2 rounded-full bg-primary-500" />
            <View className="w-2 h-2 rounded-full bg-grey-200" />
            <View className="w-2 h-2 rounded-full bg-grey-200" />
          </View>

          {/* Loading caption */}
          <Text className="text-c3 text-grey-500 font-sans text-center">
            {t('splash.loading')}
          </Text>
        </View>

      </View>
    </View>
  );
}
