import { Image, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';

const medixboter   = require('../../../../../assets/images/medixboter.png');

export interface CallControlsProps {
  muted: boolean;
  videoOn: boolean;
  onPressAudio: () => void;
  onPressVideo: () => void;
  onPressDoctorChat: () => void;
  onPressAiChat: () => void;
  onPressEndCall: () => void;
}

const BTN = 'w-10 h-10 rounded-full items-center justify-center';

export function CallControls({
  muted,
  videoOn,
  onPressAudio,
  onPressVideo,
  onPressDoctorChat,
  onPressAiChat,
  onPressEndCall,
}: CallControlsProps) {
  return (
    <View className="flex-row items-center justify-center gap-4">
      <Pressable className={`${BTN} bg-white`} onPress={onPressAudio} accessibilityRole="button" accessibilityLabel="Audio settings">
        <Ionicons
          name={muted ? 'mic-off-outline' : 'mic-outline'}
          size={20}
          color={primitiveColors['grey-900']}
        />
      </Pressable>

      <Pressable className={`${BTN} bg-white`} onPress={onPressVideo} accessibilityRole="button" accessibilityLabel="Toggle video">
        <Ionicons
          name={videoOn ? 'videocam-outline' : 'videocam-off-outline'}
          size={20}
          color={primitiveColors['grey-900']}
        />
      </Pressable>

      <Pressable className={`${BTN} bg-primary-500`} onPress={onPressDoctorChat} accessibilityRole="button" accessibilityLabel="Open doctor chat">
        <Ionicons name="chatbubble-outline" size={20} color={primitiveColors.white} />
      </Pressable>

      <Pressable className={`${BTN} bg-primary-100`} onPress={onPressAiChat} accessibilityRole="button" accessibilityLabel="Open AI assistant">
        <View className="scale-y-[-1] rotate-180">
          <Image source={medixboter} className="w-6 h-6" resizeMode="contain" accessibilityElementsHidden importantForAccessibility="no" />
        </View>
      </Pressable>

      <Pressable className={`${BTN} bg-red-500`} onPress={onPressEndCall} accessibilityRole="button" accessibilityLabel="End call">
        <View className="rotate-[136deg]">
          <Ionicons name="call" size={16} color={primitiveColors.white} />
        </View>
      </Pressable>
    </View>
  );
}
