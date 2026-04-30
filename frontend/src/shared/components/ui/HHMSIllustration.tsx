import { Text, View } from 'react-native';

const COUNT = 8;
const W = 257;
const H = 206;
const SQUARE = 64;
const RADIUS = 86;

export function HHMSIllustration() {
  const cx = W / 2;
  const cy = H / 2;

  return (
    <View style={{ width: W, height: H }}>
      {Array.from({ length: COUNT }, (_, i) => {
        const rad = ((i * 45 - 90) * Math.PI) / 180;
        const left = cx + RADIUS * Math.cos(rad) - SQUARE / 2;
        const top = cy + RADIUS * Math.sin(rad) - SQUARE / 2;
        return (
          <View
            key={i}
            className="absolute bg-primary-500 rounded-2xl items-center justify-center"
            style={{ left, top, width: SQUARE, height: SQUARE, transform: [{ rotate: `${i * 45}deg` }] }}
          >
            <Text className="text-white font-bold text-2xl">H</Text>
          </View>
        );
      })}
    </View>
  );
}
