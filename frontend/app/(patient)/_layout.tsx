import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { primitiveColors } from '@design/tokens';

interface TabItemProps {
  focused: boolean;
  label: string;
  renderIcon: (focused: boolean) => React.ReactNode;
  width: number;
}

function TabItem({ focused, label, renderIcon, width }: TabItemProps) {
  return (
    <View
      style={{
        backgroundColor: focused ? primitiveColors['primary-100'] : 'transparent',
        borderRadius: focused ? 8 : 0,
        height: 52,
        alignItems: 'center',
        gap: 4,
        justifyContent: 'center',
        width,
        overflow: 'hidden',
      }}
    >
      {renderIcon(focused)}
      <Text
        numberOfLines={1}
        style={{
          fontSize: 12,
          lineHeight: 16,
          fontWeight: focused ? '500' : '400',
          fontFamily: 'Inter',
          color: primitiveColors['grey-900'],
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function PatientTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { t } = useTranslation();

  const tabs = [
    {
      name: 'index',
      label: t('tabs.home'),
      width: 58,
      renderIcon: (focused: boolean) => (
        <MaterialIcons
          name={focused ? 'home' : 'home-filled'}
          size={24}
          color={primitiveColors['grey-900']}
        />
      ),
    },
    {
      name: 'appointment',
      label: t('tabs.appointment'),
      width: 101,
      renderIcon: (focused: boolean) => (
        <MaterialIcons
          name={focused ? 'event' : 'event-available'}
          size={24}
          color={primitiveColors['grey-900']}
        />
      ),
    },
    {
      name: 'care',
      label: t('tabs.care'),
      width: 57,
      renderIcon: (focused: boolean) => (
        <Ionicons
          name={focused ? 'heart' : 'heart-outline'}
          size={24}
          color={primitiveColors['grey-900']}
        />
      ),
    },
    {
      name: 'profile',
      label: t('tabs.profile'),
      width: 63,
      renderIcon: (focused: boolean) => (
        <MaterialIcons
          name={focused ? 'person' : 'person-outline'}
          size={24}
          color={primitiveColors['grey-900']}
        />
      ),
    },
  ] as const;

  return (
    <View
      style={{
        backgroundColor: primitiveColors.white,
        borderTopColor: primitiveColors['primary-50'],
        borderTopWidth: 1,
        paddingTop: 12,
        paddingBottom: 24,
        paddingHorizontal: 24,
        height: 119,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {tabs.map((tab) => {
          const routeIndex = state.routes.findIndex((route) => route.name === tab.name);
          if (routeIndex === -1) {
            return null;
          }

          const route = state.routes[routeIndex];
          const focused = state.index === routeIndex;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={descriptors[route.key]?.options.tabBarAccessibilityLabel}
              testID={descriptors[route.key]?.options.tabBarButtonTestID}
              onLongPress={onLongPress}
              onPress={onPress}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TabItem
                focused={focused}
                label={tab.label}
                renderIcon={tab.renderIcon}
                width={tab.width}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function PatientLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      tabBar={(props: BottomTabBarProps) => <PatientTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      {/* ── Visible tabs ── */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ focused }) => (
            <TabItem
              focused={focused}
              label={t('tabs.home')}
              width={58}
              renderIcon={(isFocused) => (
                <MaterialIcons
                  name={isFocused ? 'home' : 'home-filled'}
                  size={24}
                  color={primitiveColors['grey-900']}
                />
              )}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="appointment"
        options={{
          title: t('tabs.appointment'),
          tabBarIcon: ({ focused }) => (
            <TabItem
              focused={focused}
              label={t('tabs.appointment')}
              width={101}
              renderIcon={(isFocused) => (
                <MaterialIcons
                  name={isFocused ? 'event' : 'event-available'}
                  size={24}
                  color={primitiveColors['grey-900']}
                />
              )}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="care"
        options={{
          title: t('tabs.care'),
          tabBarIcon: ({ focused }) => (
            <TabItem
              focused={focused}
              label={t('tabs.care')}
              width={57}
              renderIcon={(isFocused) => (
                <Ionicons
                  name={isFocused ? 'heart' : 'heart-outline'}
                  size={24}
                  color={primitiveColors['grey-900']}
                />
              )}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ focused }) => (
            <TabItem
              focused={focused}
              label={t('tabs.profile')}
              width={63}
              renderIcon={(isFocused) => (
                <MaterialIcons
                  name={isFocused ? 'person' : 'person-outline'}
                  size={24}
                  color={primitiveColors['grey-900']}
                />
              )}
            />
          ),
        }}
      />

      {/* ── Hidden tabs — navigated to programmatically ── */}
      <Tabs.Screen name="book-appointment"               options={{ href: null }} />
      <Tabs.Screen name="triage"                         options={{ href: null }} />
      <Tabs.Screen name="triage-history"                 options={{ href: null }} />
      <Tabs.Screen name="triage-summary"                 options={{ href: null }} />
      <Tabs.Screen name="triage-result"                  options={{ href: null }} />
      <Tabs.Screen name="appointment-booking"            options={{ href: null }} />
      <Tabs.Screen name="appointment-policy"             options={{ href: null }} />
      <Tabs.Screen name="appointment-reason"             options={{ href: null }} />
      <Tabs.Screen name="appointment-reschedule-datetime" options={{ href: null }} />
      <Tabs.Screen name="calendar"                       options={{ href: null }} />
      <Tabs.Screen name="insurance"                      options={{ href: null }} />
      <Tabs.Screen name="consultations"                  options={{ href: null }} />
      <Tabs.Screen name="consultation-review"            options={{ href: null }} />
      <Tabs.Screen name="notifications"                  options={{ href: null }} />
      <Tabs.Screen name="prescriptions"                  options={{ href: null }} />
      <Tabs.Screen name="prescription-detail"            options={{ href: null }} />
      <Tabs.Screen name="prescription-preview"           options={{ href: null }} />
      <Tabs.Screen name="tests"                          options={{ href: null }} />
      <Tabs.Screen name="orders"                         options={{ href: null }} />
      <Tabs.Screen name="order-detail"                   options={{ href: null }} />
      <Tabs.Screen name="care-plan-detail"               options={{ href: null }} />
      <Tabs.Screen name="profile-edit"                   options={{ href: null }} />
      <Tabs.Screen name="profile-record-detail"          options={{ href: null }} />
      <Tabs.Screen name="privacy-policy"                 options={{ href: null }} />
    </Tabs>
  );
}
