import { Image, View } from 'react-native';

const medixboter = require('../../../../assets/images/medixboter.png');

export interface NuraMarkProps {
  size?: number;
}

export function NuraMark({ size = 24 }: NuraMarkProps) {
  return (
    <View className="scale-y-[-1] rotate-180">
      <Image
        source={medixboter}
        style={{ width: size, height: size }}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
    </View>
  );
}
