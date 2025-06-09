import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import * as StoreReview from 'expo-store-review';

// Simple back icon component to match your ContactSupportScreen
const BackIcon = () => <Text style={styles.iconText}>←</Text>;

export default function RateAppScreen({ navigation }) {
  const handleBackPress = () => {
    // Replace with your navigation method
    if (navigation && navigation.goBack) {
      navigation.goBack();
    } else {
      // Alternative for testing or if navigation prop is not available
      console.log('Back button pressed');
    }
  };

  const handleRateApp = async () => {
    const supported = await StoreReview.isAvailableAsync();
    if (supported) {
      StoreReview.requestReview();
    } else {
      Linking.openURL('https://play.google.com/store/apps/details?id=your.app.id');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <BackIcon />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/616/616489.png' }} 
          style={styles.image}
        />
        <Text style={styles.title}>Enjoying the App?</Text>
        <Text style={styles.subtitle}>We'd love to hear your feedback. Tap below to leave a rating!</Text>
        
        <TouchableOpacity onPress={handleRateApp} style={styles.button}>
          <Text style={styles.buttonText}>Rate Now ⭐</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 8,
  },
  backText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
    marginLeft: 4,
  },
  iconText: {
    fontSize: 18,
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  content: {
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
    color: '#1F2937',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
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
    fontWeight: '600',
  },
});