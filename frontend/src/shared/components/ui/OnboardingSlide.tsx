import React from 'react';
import { Image, type ImageSourcePropType, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@shared/components/ui/Button';
import { PaginationDots } from '@shared/components/ui/PaginationDots';

export interface OnboardingSlideProps {
  image: ImageSourcePropType;
  imagePositionClassName?: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  activeIndex: number;
  totalSlides: number;
  onGetStarted: () => void;
}

const PANEL_GRADIENT_COLORS = ['rgba(250,250,250,0.04)', 'rgba(255,255,255,0.9)'] as const;
const PANEL_GRADIENT_LOCATIONS = [0, 0.13942] as const;

export function OnboardingSlide({
  image,
  imagePositionClassName = 'top-12',
  title,
  subtitle,
  buttonLabel,
  activeIndex,
  totalSlides,
  onGetStarted,
}: OnboardingSlideProps) {
  return (
    <View className="relative w-screen flex-1 overflow-hidden bg-white">
      <View className={`absolute left-0 right-0 h-[460px] ${imagePositionClassName}`}>
        <Image
          source={image}
          resizeMode="contain"
          className="h-full w-full"
          accessibilityRole="image"
          accessibilityLabel={title}
        />
      </View>

      <View className="absolute bottom-0 left-0 right-0 h-[438px] overflow-hidden shadow-100">
        <LinearGradient
          colors={PANEL_GRADIENT_COLORS}
          locations={PANEL_GRADIENT_LOCATIONS}
          className="flex-1"
        >
          <View className="w-full items-center px-4 pt-[94px]">
            <View className="w-[360px] max-w-full items-center gap-14">
              <View className="w-full items-center gap-8">
                <View className="w-full items-center gap-2">
                  <Text className="w-[349px] max-w-full text-center font-sans text-h4 font-semibold text-grey-900">
                    {title}
                  </Text>
                  <Text className="w-[349px] max-w-full text-center font-sans text-b2 text-grey-500">
                    {subtitle}
                  </Text>
                </View>
                <PaginationDots count={totalSlides} activeIndex={activeIndex} />
              </View>

              <View className="w-[349px] max-w-full">
                <Button
                  label={buttonLabel}
                  variant="filled"
                  size="giant"
                  fullWidth
                  onPress={onGetStarted}
                />
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}
