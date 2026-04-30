import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export function SplashScreenView() {
  const { t } = useTranslation();
  const introOpacity = useRef(new Animated.Value(0)).current;
  const introTranslateY = useRef(new Animated.Value(18)).current;
  const introScale = useRef(new Animated.Value(0.96)).current;
  const haloScale = useRef(new Animated.Value(0.94)).current;
  const haloOpacity = useRef(new Animated.Value(0.22)).current;
  const dotOne = useRef(new Animated.Value(0.35)).current;
  const dotTwo = useRef(new Animated.Value(0.35)).current;
  const dotThree = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(introOpacity, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(introTranslateY, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(introScale, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const haloLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(haloScale, {
            toValue: 1.08,
            duration: 1800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(haloOpacity, {
            toValue: 0.36,
            duration: 1800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(haloScale, {
            toValue: 0.94,
            duration: 1800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(haloOpacity, {
            toValue: 0.22,
            duration: 1800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    const createDotLoop = (value: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0.35,
            duration: 300,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay(600),
        ]),
      );

    haloLoop.start();
    const dotLoopOne = createDotLoop(dotOne, 0);
    const dotLoopTwo = createDotLoop(dotTwo, 160);
    const dotLoopThree = createDotLoop(dotThree, 320);
    dotLoopOne.start();
    dotLoopTwo.start();
    dotLoopThree.start();

    return () => {
      haloLoop.stop();
      dotLoopOne.stop();
      dotLoopTwo.stop();
      dotLoopThree.stop();
    };
  }, [dotOne, dotThree, dotTwo, haloOpacity, haloScale, introOpacity, introScale, introTranslateY]);

  return (
    <View className="flex-1 bg-primary-50 items-center overflow-hidden">
      <View className="w-[283px] items-center pt-[261px]">
        <Animated.View
          style={{
            opacity: introOpacity,
            transform: [{ translateY: introTranslateY }, { scale: introScale }],
          }}
        >
          <View className="items-center gap-7 w-[183px]">
            <View className="w-[183px] h-[183px] items-center justify-center">
              <View className="absolute w-[156px] h-[156px] rounded-full bg-primary-50">
                <Animated.View
                  style={{
                    width: 156,
                    height: 156,
                    borderRadius: 78,
                    backgroundColor: '#ffffff',
                    opacity: haloOpacity,
                    transform: [{ scale: haloScale }],
                  }}
                />
              </View>
              <View className="w-[96px] h-[96px] rounded-[18px] bg-primary-500 items-center justify-center shadow-700">
                <Text className="text-[52px] leading-[60px] font-normal text-white font-sans">H</Text>
              </View>
            </View>

            <View className="items-center gap-1 w-[173px]">
              <Text className="text-[40px] leading-[48px] font-semibold text-grey-900 font-sans">HHMS</Text>
              <Text className="text-b2 text-grey-500 font-sans">{t('splash.subtitle')}</Text>
              <View className="mt-2 bg-white rounded-full px-4 py-2">
                <Text className="text-c3 font-medium text-primary-400 font-sans">
                  {t('splash.tagline')}
                </Text>
              </View>
            </View>
          </View>

          <View className="h-[152px]" />

          <View className="items-center gap-4">
            <View className="flex-row bg-grey-50 rounded-xl px-3 py-2 gap-2 items-center">
              <Animated.View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: '#5463F2',
                  opacity: dotOne,
                  transform: [
                    {
                      scale: dotOne.interpolate({
                        inputRange: [0.35, 1],
                        outputRange: [0.88, 1.08],
                      }),
                    },
                  ],
                }}
              />
              <Animated.View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: '#E4E7EC',
                  opacity: dotTwo,
                  transform: [
                    {
                      scale: dotTwo.interpolate({
                        inputRange: [0.35, 1],
                        outputRange: [0.88, 1.08],
                      }),
                    },
                  ],
                }}
              />
              <Animated.View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: '#E4E7EC',
                  opacity: dotThree,
                  transform: [
                    {
                      scale: dotThree.interpolate({
                        inputRange: [0.35, 1],
                        outputRange: [0.88, 1.08],
                      }),
                    },
                  ],
                }}
              />
            </View>

            <Text className="text-c3 text-grey-500 font-sans text-center">
              {t('splash.loading')}
            </Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
