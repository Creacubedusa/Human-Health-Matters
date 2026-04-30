import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { primitiveColors } from '@design/tokens';
import { useToastStore, type ToastType } from '@shared/store/toast.store';

const BG: Record<ToastType, string> = {
  success: primitiveColors['green-500'],
  info: primitiveColors['blue-500'],
  warning: primitiveColors['yellow-500'],
  error: primitiveColors['red-500'],
};

const TEXT: Record<ToastType, string> = {
  success: primitiveColors.white,
  info: primitiveColors.white,
  warning: primitiveColors['grey-900'],
  error: primitiveColors.white,
};

export function ToastHost() {
  const insets = useSafeAreaInsets();
  const toast = useToastStore((s) => s.current);
  const hide = useToastStore((s) => s.hide);

  const [rendered, setRendered] = useState<typeof toast>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;

  const style = useMemo(() => {
    return {
      opacity,
      transform: [{ translateY }],
    };
  }, [opacity, translateY]);

  useEffect(() => {
    if (!toast) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -12, duration: 150, useNativeDriver: true }),
      ]).start(() => {
        setRendered(null);
      });
      return;
    }

    setRendered(toast);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 170, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 170, useNativeDriver: true }),
    ]).start();

    const t = setTimeout(() => {
      hide();
    }, toast.durationMs);

    return () => clearTimeout(t);
  }, [toast, hide, opacity, translateY]);

  if (!rendered) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: insets.top + 10,
        left: 16,
        right: 16,
        zIndex: 9999,
      }}
    >
      <Animated.View style={style}>
        <Pressable
          onPress={hide}
          accessibilityRole="button"
          style={{
            backgroundColor: BG[rendered.type],
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 12,
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 6 },
            elevation: 3,
          }}
        >
          {rendered.title ? (
            <Text
              style={{
                color: TEXT[rendered.type],
                fontWeight: '600',
                fontSize: 14,
                marginBottom: 2,
              }}
            >
              {rendered.title}
            </Text>
          ) : null}
          <Text
            style={{
              color: TEXT[rendered.type],
              fontSize: 13,
              lineHeight: 18,
            }}
          >
            {rendered.message}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

