import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, Text, View } from 'react-native';

export interface AppBottomTabDefinition {
  routeName: string;
  label: string;
  itemWidthClassName: string;
  iconWidthClassName: string;
  renderIcon: (focused: boolean) => React.ReactNode;
}

export interface AppBottomTabBarProps extends BottomTabBarProps {
  tabs: AppBottomTabDefinition[];
  activeTabClassName?: string;
}

export function AppBottomTabBar({
  state,
  descriptors,
  navigation,
  tabs,
  activeTabClassName = 'rounded-[2px]',
}: AppBottomTabBarProps) {
  const activeRoute = state.routes[state.index];
  const activeRouteOptions = activeRoute ? descriptors[activeRoute.key]?.options : undefined;
  const resolvedTabBarStyle = activeRouteOptions?.tabBarStyle;
  const hideTabBar =
    !activeRoute ||
    (Array.isArray(resolvedTabBarStyle)
      ? resolvedTabBarStyle.some((style) => style && 'display' in style && style.display === 'none')
      : Boolean(resolvedTabBarStyle && 'display' in resolvedTabBarStyle && resolvedTabBarStyle.display === 'none'));

  if (hideTabBar) {
    return null;
  }

  return (
    <View className="bg-white border-t border-primary-50 h-[119px] px-6 pt-3 pb-6">
      <View className="flex-row items-center justify-between">
        {tabs.map((tab) => {
          const routeIndex = state.routes.findIndex((route) => route.name === tab.routeName);
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
              className="items-center justify-center"
            >
              <View
                className={[
                  'items-center justify-center',
                  focused ? 'bg-primary-100 px-3 py-1' : '',
                  focused ? activeTabClassName : '',
                ].join(' ')}
              >
                <View
                  className={['items-center gap-1', tab.itemWidthClassName].join(' ')}
                >
                  <View className={['items-center justify-center h-6', tab.iconWidthClassName].join(' ')}>
                    {tab.renderIcon(focused)}
                  </View>
                  <Text
                    numberOfLines={1}
                    className={[
                      focused ? 'text-c2 font-medium' : 'text-c1 font-normal',
                      'font-sans text-grey-900 text-center',
                    ].join(' ')}
                  >
                    {tab.label}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
