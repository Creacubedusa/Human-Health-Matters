import { useRef, useState, useCallback, useEffect } from 'react';
import { FlatList, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';

const AUTO_ADVANCE_MS = 5000;

export function usePatientOnboarding(slideCount: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToSlide = useCallback((index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
  }, []);

  const startAutoAdvance = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev < slideCount - 1 ? prev + 1 : 0;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, AUTO_ADVANCE_MS);
  }, [slideCount]);

  useEffect(() => {
    startAutoAdvance();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoAdvance]);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const width = e.nativeEvent.layoutMeasurement.width;
      const index = Math.round(offsetX / width);
      setActiveIndex(index);
      startAutoAdvance();
    },
    [startAutoAdvance],
  );

  return { activeIndex, flatListRef, onMomentumScrollEnd, goToSlide };
}
