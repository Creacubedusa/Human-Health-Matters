import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { RoleCard, type UserRole } from '../ui/RoleCard';

export interface RoleOption {
  role: UserRole;
  title: string;
  description: string;
}

export interface SelectRoleViewProps {
  options: RoleOption[];
  selectedRole: UserRole | null;
  onSelectRole: (role: UserRole) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function SelectRoleView({
  options,
  selectedRole,
  onSelectRole,
  onContinue,
  onBack,
}: SelectRoleViewProps) {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-primary-50 flex-row items-center justify-center px-4 py-5 relative">
        <Pressable
          onPress={onBack}
          className="absolute left-4 w-[29px] h-[29px] rounded-md border border-grey-200 bg-white items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <Text className="text-s2 text-grey-900 leading-none">‹</Text>
        </Pressable>
        <Text className="text-s2 font-sans font-semibold text-grey-900">
          {t('selectRole.headerTitle')}
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[17px] pt-10 pb-6"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-h4 font-sans font-semibold text-grey-900">
          {t('selectRole.title')}
        </Text>
        <View className="h-6" />
        <View className="gap-4">
          {options.map((opt) => (
            <RoleCard
              key={opt.role}
              role={opt.role}
              title={opt.title}
              description={opt.description}
              selected={selectedRole === opt.role}
              onPress={() => onSelectRole(opt.role)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Sticky bottom bar */}
      <View className="bg-white px-[17px] py-4">
        <Button
          label={t('common.continue')}
          variant="filled"
          size="large"
          fullWidth
          disabled={selectedRole === null}
          onPress={onContinue}
          testID="select-role-continue"
        />
      </View>
    </SafeAreaView>
  );
}
