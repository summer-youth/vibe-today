import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { SplashScreen, LoginScreen, OnboardingScreen, HomeScreen, GalleryScreen, ProfileScreen } from '@pages';
import { colors } from '@constants/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * 메인 탭 네비게이터
 */
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 90,
          paddingTop: 8,
          paddingBottom: 24,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons
              name="create"
              size={size || 26}
              color={focused ? colors.primary.main : color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          tabBarLabel: '기록',
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons
              name="collections"
              size={size || 26}
              color={focused ? colors.primary.main : color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '프로필',
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons
              name="person"
              size={size || 26}
              color={focused ? colors.primary.main : color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * 앱 네비게이터
 */
export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName="Splash"
      >
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
