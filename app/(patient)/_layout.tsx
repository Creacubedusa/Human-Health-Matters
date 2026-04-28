import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { primitiveColors } from '@design/tokens';

// Figma bottom nav: active tab has bg-primary-100 rounded-lg pill around icon+label
export default function PatientLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: primitiveColors['primary-500'],
        tabBarInactiveTintColor: primitiveColors['grey-600'],
        tabBarStyle: {
          backgroundColor: primitiveColors.white,
          borderTopColor: primitiveColors['primary-50'],
          borderTopWidth: 1,
          paddingBottom: 24,
          paddingTop: 12,
          paddingHorizontal: 24,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '400',
          fontFamily: 'Inter',
          marginTop: 4,
        },
        tabBarItemStyle: {
          borderRadius: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused ? primitiveColors['primary-100'] : 'transparent',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 4,
              }}
            >
              <Ionicons name="home" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="appointment"
        options={{
          title: t('tabs.appointment'),
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="care"
        options={{
          title: t('tabs.care'),
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
      {/* Hidden tabs — accessed via navigation only, not bottom nav */}
      <Tabs.Screen name="triage"          options={{ href: null }} />
      <Tabs.Screen name="triage-history"  options={{ href: null }} />
      <Tabs.Screen name="triage-summary"  options={{ href: null }} />
      <Tabs.Screen name="triage-result"   options={{ href: null }} />
      <Tabs.Screen name="appointment-booking" options={{ href: null }} />
      <Tabs.Screen name="consultations"   options={{ href: null }} />
      <Tabs.Screen name="notifications"   options={{ href: null }} />
      <Tabs.Screen name="insurance"                        options={{ href: null }} />
      <Tabs.Screen name="appointment-policy"             options={{ href: null }} />
      <Tabs.Screen name="appointment-reason"             options={{ href: null }} />
      <Tabs.Screen name="appointment-reschedule-datetime" options={{ href: null }} />
    </Tabs>
  );
}
