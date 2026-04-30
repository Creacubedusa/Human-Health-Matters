import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';

export default function DoctorLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: primitiveColors['primary-500'],
        tabBarInactiveTintColor: primitiveColors['grey-400'],
        tabBarStyle: {
          backgroundColor: primitiveColors.white,
          borderTopColor: primitiveColors['grey-200'],
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="consultations"
        options={{
          title: t('tabs.consultations'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="patients"
        options={{
          title: t('tabs.patients'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen name="consultation" options={{ href: null }} />
    </Tabs>
  );
}
