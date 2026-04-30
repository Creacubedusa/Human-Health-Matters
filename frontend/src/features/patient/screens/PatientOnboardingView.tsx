import React, { useCallback } from 'react';
import { Dimensions, FlatList, type ImageSourcePropType, type ListRenderItemInfo, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePatientOnboarding } from '@features/patient/hooks/usePatientOnboarding';
import { OnboardingSlide } from '@shared/components/ui/OnboardingSlide';

const SW = Dimensions.get('window').width;

interface SlideData {
  key: string;
  image: ImageSourcePropType;
  titleKey: string;
  subtitleKey: string;
}

const SLIDES: SlideData[] = [
  {
    key: 'slide1',
    image: require('../../../../assets/images/onboarding-slide-1.png'),
    titleKey: 'patientOnboarding.slide1Title',
    subtitleKey: 'patientOnboarding.slide1Subtitle',
  },
  {
    key: 'slide2',
    image: require('../../../../assets/images/onboarding-slide-2.png'),
    titleKey: 'patientOnboarding.slide2Title',
    subtitleKey: 'patientOnboarding.slide2Subtitle',
  },
  {
    key: 'slide3',
    image: require('../../../../assets/images/onboarding-slide-3.png'),
    titleKey: 'patientOnboarding.slide3Title',
    subtitleKey: 'patientOnboarding.slide3Subtitle',
  },
];

interface PatientOnboardingViewProps {
  onGetStarted: () => void;
}

export function PatientOnboardingView({ onGetStarted }: PatientOnboardingViewProps) {
  const { t } = useTranslation();
  const { activeIndex, flatListRef, onMomentumScrollEnd } = usePatientOnboarding(SLIDES.length);
  const buttonLabel = t('patientOnboarding.getStarted');

  const renderSlide = useCallback(
    ({ item }: ListRenderItemInfo<SlideData>) => (
      <OnboardingSlide
        image={item.image}
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
