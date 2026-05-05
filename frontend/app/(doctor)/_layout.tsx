import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import {
  AppBottomTabBar,
  type AppBottomTabDefinition,
} from '@shared/components/ui/AppBottomTabBar';

export default function DoctorLayout() {
  const { t } = useTranslation();
  const tabs: AppBottomTabDefinition[] = [
    {
      routeName: 'index',
      label: t('doctorBottomNav.home'),
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
      routeName: 'consultations',
      label: t('doctorBottomNav.appointment'),
      itemWidthClassName: 'w-[75px]',
      iconWidthClassName: 'w-6',
      renderIcon: (focused) => (
        <MaterialCommunityIcons
          name={focused ? 'calendar-plus' : 'calendar-plus-outline'}
          size={22}
          color={primitiveColors['grey-900']}
        />
      ),
    },
    {
      routeName: 'patients',
      label: t('doctorBottomNav.patient'),
      itemWidthClassName: 'w-[47px]',
      iconWidthClassName: 'w-6',
      renderIcon: (focused) => (
        <MaterialCommunityIcons
          name={focused ? 'account-injury' : 'account-injury-outline'}
          size={22}
          color={primitiveColors['grey-900']}
        />
      ),
    },
    {
      routeName: 'profile',
      label: t('doctorBottomNav.profile'),
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
      <Tabs.Screen
        name="index"
        options={{
          title: t('doctorBottomNav.home'),
        }}
      />
      <Tabs.Screen
        name="consultations"
        options={{
          title: t('doctorBottomNav.appointment'),
        }}
      />
      <Tabs.Screen
        name="patients"
        options={{
          title: t('doctorBottomNav.patient'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('doctorBottomNav.profile'),
        }}
      />

      <Tabs.Screen
        name="consultation"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen name="nura-ai" options={{ href: null }} />
      <Tabs.Screen name="nura-ai-chat" options={{ href: null }} />
      <Tabs.Screen name="nura-ai-history" options={{ href: null }} />
      <Tabs.Screen name="nura-ai-summary" options={{ href: null }} />
      <Tabs.Screen name="calendar" options={{ href: null }} />
      <Tabs.Screen name="appointment-create" options={{ href: null }} />
      <Tabs.Screen name="availability" options={{ href: null }} />
      <Tabs.Screen name="earning" options={{ href: null }} />
      <Tabs.Screen name="earning-transactions" options={{ href: null }} />
      <Tabs.Screen name="earning-withdraw" options={{ href: null }} />
      <Tabs.Screen name="earning-claims-tracker" options={{ href: null }} />
      <Tabs.Screen name="earning-payout-history" options={{ href: null }} />
      <Tabs.Screen name="earning-receipt/[transactionId]" options={{ href: null }} />
      <Tabs.Screen name="earning-transaction/[transactionId]" options={{ href: null }} />
      <Tabs.Screen name="language" options={{ href: null }} />
      <Tabs.Screen name="privacy-policy" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="create-order-wizard" options={{ href: null }} />
      <Tabs.Screen name="appointment-policy" options={{ href: null }} />
      <Tabs.Screen name="appointment-reason" options={{ href: null }} />
      <Tabs.Screen name="appointment-reschedule-datetime" options={{ href: null }} />
      <Tabs.Screen name="soap-note" options={{ href: null }} />
      <Tabs.Screen name="post-session-care-plan" options={{ href: null }} />
      <Tabs.Screen name="post-session-care-plan-soap-edit" options={{ href: null }} />
      <Tabs.Screen name="post-session-care-plan-diagnoses-edit" options={{ href: null }} />
      <Tabs.Screen name="post-session-care-plan-recommended-tests-edit" options={{ href: null }} />
      <Tabs.Screen name="post-session-care-plan-prescriptions-edit" options={{ href: null }} />
    </Tabs>
  );
}
