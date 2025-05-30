import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import HomeScreen from '../screens/workout/HomeScreen';
import WorkoutLibraryScreen from '../screens/workout/WorkoutLibraryScreen';
import WorkoutDetailScreen from '../screens/workout/WorkoutDetailScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import HomePageScreen from '../screens/pages/HomePageScreen'; // Create this file
import MealTrackingScreen from '../screens/pages/MealTrackingScreen'; // Create this file

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

const WorkoutStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Home" 
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="WorkoutLibrary" 
      component={WorkoutLibraryScreen}
      options={{ title: 'Workouts' }}
    />
    <Stack.Screen 
      name="WorkoutDetail" 
      component={WorkoutDetailScreen}
      options={{ title: 'Workout Details' }}
    />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#666',
      headerShown: false,
    }}
  >
    <Tab.Screen 
      name="HomePage" 
      component={HomePageScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>{'🏠'}</Text>
      }}
    />
    <Tab.Screen 
      name="Workouts" 
      component={WorkoutStack}
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

export default function AppNavigator({ user }) {
  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
