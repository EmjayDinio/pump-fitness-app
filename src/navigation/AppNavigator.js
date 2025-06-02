import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import HomePageScreen from '../screens/pages/HomePageScreen';
import MealTrackingScreen from '../screens/pages/MealTrackingScreen';
import WorkoutSelection from '../screens/workout/WorkoutSelection'; // ✅ Import added
import WorkoutScreen from '../screens/workout/WorkoutScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth stack for login/signup
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

// ✅ Home stack for HomePage and WorkoutSelection
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomePageScreen" component={HomePageScreen} />
    <Stack.Screen name="WorkoutSelection" component={WorkoutSelection} />
  </Stack.Navigator>
);

// Main tab navigator for the app
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

// Root navigator
export default function AppNavigator({ user }) {
  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
