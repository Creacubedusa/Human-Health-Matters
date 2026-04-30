import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { primitiveColors } from '@design/tokens';

function Dot({ delay }: { delay: number }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 300, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={{
        opacity,
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: primitiveColors['grey-400'],
      }}
    />
  );
}

export function TypingIndicator() {
  return (
    <View className="items-start">
      <View className="bg-white border border-grey-200 rounded-2xl rounded-tl-sm px-4 py-3 flex-row gap-1.5 items-center">
        <Dot delay={0} />
        <Dot delay={200} />
        <Dot delay={400} />
      </View>
    </View>
  );
}
