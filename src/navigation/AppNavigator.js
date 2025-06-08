import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import HomePageScreen from '../screens/pages/HomePageScreen';
import MealTrackingScreen from '../screens/pages/MealTrackingScreen';
import WorkoutSelection from '../screens/workout/WorkoutSelection';
import WorkoutScreen from '../screens/workout/WorkoutScreen';

// Support Screens
import HelpFAQScreen from '../screens/support/HelpFAQScreen';
import ContactSupportScreen from '../screens/support/ContactSupportScreen';
import RateAppScreen from '../screens/support/RateAppScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth stack for login/signup
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

// Home stack for HomePage and WorkoutSelection
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomePageScreen" component={HomePageScreen} />
    <Stack.Screen name="WorkoutSelection" component={WorkoutSelection} />
  </Stack.Navigator>
);

// Tab navigator for the main app
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#666',
      headerShown: false,
    }}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeStack}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>{'🏠'}</Text>
      }}
    />
    <Tab.Screen 
      name="Workouts" 
      component={WorkoutScreen}
      options={{
        tabBarLabel: 'Workout',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>{'🏋️'}</Text>
      }}
    />
    <Tab.Screen 
      name="MealTracking" 
      component={MealTrackingScreen}
      options={{
        tabBarLabel: 'Meals',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>{'🍽️'}</Text>
      }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>{'👤'}</Text>
      }}
    />
  </Tab.Navigator>
);

// App stack with support screens
const MainAppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen name="HelpFAQ" component={HelpFAQScreen} />
    <Stack.Screen name="ContactSupport" component={ContactSupportScreen} />
    <Stack.Screen name="RateApp" component={RateAppScreen} />
  </Stack.Navigator>
);

// Root navigator
export default function AppNavigator({ user }) {
  return (
    <NavigationContainer>
      {user ? <MainAppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
