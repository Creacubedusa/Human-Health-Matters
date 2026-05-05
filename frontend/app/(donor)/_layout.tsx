import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import {
  AppBottomTabBar,
  type AppBottomTabDefinition,
} from '@shared/components/ui/AppBottomTabBar';

export default function DonorLayout() {
  const { t } = useTranslation();

  const tabs: AppBottomTabDefinition[] = [
    {
      routeName: 'index',
      label: t('donorBottomNav.home'),
      itemWidthClassName: 'w-[34px]',
      iconWidthClassName: 'w-6',
      renderIcon: (focused) => (
        <MaterialIcons
          name={focused ? 'home-filled' : 'home'}
          size={24}
          color={primitiveColors['grey-900']}
        />
      ),
    },
    {
      routeName: 'impact',
      label: t('donorBottomNav.impact'),
      itemWidthClassName: 'w-[50px]',
      iconWidthClassName: 'w-6',
      renderIcon: () => (
        <Ionicons name="trending-up-outline" size={22} color={primitiveColors['grey-900']} />
      ),
    },
    {
      routeName: 'history',
      label: t('donorBottomNav.history'),
      itemWidthClassName: 'w-[50px]',
      iconWidthClassName: 'w-6',
      renderIcon: () => (
        <Ionicons name="time-outline" size={22} color={primitiveColors['grey-900']} />
      ),
    },
    {
      routeName: 'profile',
      label: t('donorBottomNav.profile'),
      itemWidthClassName: 'w-[39px]',
      iconWidthClassName: 'w-6',
      renderIcon: (focused) => (
        <Ionicons
          name={focused ? 'person' : 'person-outline'}
          size={22}
          color={primitiveColors['grey-900']}
        />
      ),
    },
  ];

  return (
    <Tabs
      tabBar={(props: BottomTabBarProps) => <AppBottomTabBar {...props} tabs={tabs} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('donorBottomNav.home') }} />
      <Tabs.Screen name="impact" options={{ title: t('donorBottomNav.impact') }} />
      <Tabs.Screen name="history" options={{ title: t('donorBottomNav.history') }} />
      <Tabs.Screen name="profile" options={{ title: t('donorBottomNav.profile') }} />
      <Tabs.Screen name="donate" options={{ href: null }} />
      <Tabs.Screen name="donate-payment" options={{ href: null }} />
      <Tabs.Screen name="donate-add-card" options={{ href: null }} />
      <Tabs.Screen name="donate-review" options={{ href: null }} />
      <Tabs.Screen name="profile-edit-card" options={{ href: null }} />
      <Tabs.Screen name="profile-frequency" options={{ href: null }} />
      <Tabs.Screen name="profile-add-method" options={{ href: null }} />
      <Tabs.Screen name="profile-add-card" options={{ href: null }} />
    </Tabs>
  );
}
