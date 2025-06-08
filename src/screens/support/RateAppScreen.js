import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, Image } from 'react-native';
import * as StoreReview from 'expo-store-review';

export default function RateAppScreen() {
  const handleRateApp = async () => {
    const supported = await StoreReview.isAvailableAsync();
    if (supported) {
      StoreReview.requestReview();
    } else {
      Linking.openURL('https://play.google.com/store/apps/details?id=your.app.id');
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/616/616489.png' }} 
        style={styles.image}
      />
      <Text style={styles.title}>Enjoying the App?</Text>
      <Text style={styles.subtitle}>We’d love to hear your feedback. Tap below to leave a rating!</Text>
      
      <TouchableOpacity onPress={handleRateApp} style={styles.button}>
        <Text style={styles.buttonText}>Rate Now ⭐</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
