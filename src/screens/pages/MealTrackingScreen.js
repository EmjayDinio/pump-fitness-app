import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MealTrackingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Meal Tracking Page</Text>
      <Text style={styles.subtext}>Track your meals and calories here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: '#666',
  },
});
