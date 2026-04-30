import { Feather } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { primitiveColors } from '@design/tokens';

export interface HeaderBackButtonProps {
  onPress?: () => void;
  accessibilityLabel: string;
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
}

export function HeaderBackButton({
  onPress,
  accessibilityLabel,
  disabled = false,
  hidden = false,
  className,
}: HeaderBackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className={[
        'h-[29px] w-[29px] items-center justify-center rounded-[6px] border border-grey-900/10 bg-white',
        hidden ? 'opacity-0' : '',
        className ?? '',
      ].join(' ')}
    >
      <Feather name="chevron-left" size={18} color={primitiveColors['primary-500']} />
    </Pressable>
  );
}
