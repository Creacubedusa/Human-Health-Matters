import React, { useCallback } from 'react';
import { Dimensions, FlatList, Image, type ImageSourcePropType, type ListRenderItemInfo, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/components/ui/Button';
import { PaginationDots } from '@shared/components/ui/PaginationDots';
import { useOnboardingCarousel } from '@shared/hooks/useOnboardingCarousel';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PANEL_GRADIENT_COLORS = ['rgba(250,250,250,0.04)', 'rgba(255,255,255,0.9)'] as const;
const PANEL_GRADIENT_LOCATIONS = [0, 0.13942] as const;

interface SlideData {
  key: string;
  image: ImageSourcePropType;
  imageContainerClassName: string;
  imageClassName: string;
  titleKey: string;
  subtitleKey: string;
  decoration: 'none' | 'orbit' | 'dashboard';
}

const SLIDES: SlideData[] = [
  {
    key: 'slide1',
    image: require('../../../../assets/images/donor-onboarding-slide-1.png'),
    imageContainerClassName: 'absolute left-0 top-[88px] h-[436px] w-[403px]',
    imageClassName: 'h-full w-full',
    titleKey: 'donorOnboarding.slide1Title',
    subtitleKey: 'donorOnboarding.slide1Subtitle',
    decoration: 'none',
  },
  {
    key: 'slide2',
    image: require('../../../../assets/images/donor-onboarding-slide-2.png'),
    imageContainerClassName: 'absolute left-0 top-[106px] h-[375px] w-screen items-center',
    imageClassName: 'h-[375px] w-screen',
    titleKey: 'donorOnboarding.slide2Title',
    subtitleKey: 'donorOnboarding.slide2Subtitle',
    decoration: 'orbit',
  },
  {
    key: 'slide3',
    image: require('../../../../assets/images/donor-onboarding-slide-3.png'),
    imageContainerClassName: 'absolute left-0 top-[102px] h-[533px] w-screen items-center',
    imageClassName: 'h-[533px] w-[359px]',
    titleKey: 'donorOnboarding.slide3Title',
    subtitleKey: 'donorOnboarding.slide3Subtitle',
    decoration: 'dashboard',
  },
];

interface DonorOnboardingSlideProps {
  image: ImageSourcePropType;
  imageContainerClassName: string;
  imageClassName: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  activeIndex: number;
  totalSlides: number;
  decoration: SlideData['decoration'];
  onGetStarted: () => void;
}

function DonorOnboardingArtwork({
  image,
  imageContainerClassName,
  imageClassName,
  decoration,
  title,
}: Pick<
  DonorOnboardingSlideProps,
  'image' | 'imageContainerClassName' | 'imageClassName' | 'decoration' | 'title'
>) {
  return (
    <>
      {decoration === 'orbit' ? (
        <>
          <View className="absolute left-[-205px] top-[106px] h-[320px] w-[303px] rounded-full border-[4px] border-primary-500" />
          <View className="absolute left-[173px] top-[-75px] h-[510px] w-[303px] rounded-full border-[4px] border-primary-500 -rotate-[52deg]" />
        </>
      ) : null}

      {decoration === 'dashboard' ? (
        <>
          <View className="absolute left-[-200px] top-[46px] h-[320px] w-[303px] rounded-full border-[4px] border-primary-500" />
          <View className="absolute left-[166px] top-[-96px] h-[442px] w-[303px] rounded-full border-[4px] border-primary-500 -rotate-[52deg]" />
        </>
      ) : null}

      <View className={imageContainerClassName}>
        <Image
          source={image}
          resizeMode="contain"
          className={imageClassName}
          accessibilityRole="image"
          accessibilityLabel={title}
        />
      </View>
    </>
  );
}

function DonorOnboardingSlide({
  image,
  imageContainerClassName,
  imageClassName,
  title,
  subtitle,
  buttonLabel,
  activeIndex,
  totalSlides,
  decoration,
  onGetStarted,
}: DonorOnboardingSlideProps) {
  return (
    <View className="relative w-screen flex-1 overflow-hidden bg-white">
      <DonorOnboardingArtwork
        image={image}
        imageContainerClassName={imageContainerClassName}
        imageClassName={imageClassName}
        decoration={decoration}
        title={title}
      />

      <View className="absolute bottom-0 left-0 right-0 h-[438px] overflow-hidden shadow-100">
        <LinearGradient
          colors={PANEL_GRADIENT_COLORS}
          locations={PANEL_GRADIENT_LOCATIONS}
          className="flex-1"
        >
          <View className="w-full items-center px-4 pt-[95px]">
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

export interface DonorOnboardingViewProps {
  onGetStarted: () => void;
}

export function DonorOnboardingView({ onGetStarted }: DonorOnboardingViewProps) {
  const { t } = useTranslation();
  const { activeIndex, flatListRef, onMomentumScrollEnd } = useOnboardingCarousel(SLIDES.length);
  const buttonLabel = t('donorOnboarding.getStarted');

  const renderSlide = useCallback(
    ({ item }: ListRenderItemInfo<SlideData>) => (
      <DonorOnboardingSlide
        image={item.image}
        imageContainerClassName={item.imageContainerClassName}
        imageClassName={item.imageClassName}
        title={t(item.titleKey)}
        subtitle={t(item.subtitleKey)}
        buttonLabel={buttonLabel}
        activeIndex={activeIndex}
        totalSlides={SLIDES.length}
        decoration={item.decoration}
        onGetStarted={onGetStarted}
      />
    ),
    [activeIndex, buttonLabel, onGetStarted, t],
  );

  return (
    <View className="flex-1 bg-white">
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        renderItem={renderSlide}
        keyExtractor={(item) => item.key}
        getItemLayout={(_, index) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index })}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        bounces={false}
        className="flex-1"
      />
    </View>
  );
}
