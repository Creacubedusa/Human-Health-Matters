import React, { useCallback } from 'react';
import { Dimensions, FlatList, type ImageSourcePropType, type ListRenderItemInfo, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { OnboardingSlide } from '@shared/components/ui/OnboardingSlide';
import { useOnboardingCarousel } from '@shared/hooks/useOnboardingCarousel';

const SW = Dimensions.get('window').width;

interface SlideData {
  key: string;
  image: ImageSourcePropType;
  imagePositionClassName: string;
  titleKey: string;
  subtitleKey: string;
}

const SLIDES: SlideData[] = [
  {
    key: 'slide1',
    image: require('../../../../assets/images/doctor-onboarding-slide-1.png'),
    imagePositionClassName: 'top-[71px]',
    titleKey: 'doctorOnboarding.slide1Title',
    subtitleKey: 'doctorOnboarding.slide1Subtitle',
  },
  {
    key: 'slide2',
    image: require('../../../../assets/images/doctor-onboarding-slide-2.png'),
    imagePositionClassName: 'top-[92px]',
    titleKey: 'doctorOnboarding.slide2Title',
    subtitleKey: 'doctorOnboarding.slide2Subtitle',
  },
  {
    key: 'slide3',
    image: require('../../../../assets/images/doctor-onboarding-slide-3.png'),
    imagePositionClassName: 'top-[92px]',
    titleKey: 'doctorOnboarding.slide3Title',
    subtitleKey: 'doctorOnboarding.slide3Subtitle',
  },
];

export interface DoctorOnboardingViewProps {
  onGetStarted: () => void;
}

export function DoctorOnboardingView({ onGetStarted }: DoctorOnboardingViewProps) {
  const { t } = useTranslation();
  const { activeIndex, flatListRef, onMomentumScrollEnd } = useOnboardingCarousel(SLIDES.length);
  const buttonLabel = t('doctorOnboarding.getStarted');

  const renderSlide = useCallback(
    ({ item }: ListRenderItemInfo<SlideData>) => (
      <OnboardingSlide
        image={item.image}
        imagePositionClassName={item.imagePositionClassName}
        title={t(item.titleKey)}
        subtitle={t(item.subtitleKey)}
        buttonLabel={buttonLabel}
        activeIndex={activeIndex}
        totalSlides={SLIDES.length}
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
        getItemLayout={(_, index) => ({ length: SW, offset: SW * index, index })}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        bounces={false}
        className="flex-1"
      />
    </View>
  );
}

