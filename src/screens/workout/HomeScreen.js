import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { initDatabase, seedDatabase } from '../../services/database/database';

const BODY_PARTS = [
  { id: 'chest', name: 'Chest', icon: '💪' },
  { id: 'back', name: 'Back', icon: '🔥' },
  { id: 'legs', name: 'Legs', icon: '🦵' },
  { id: 'arms', name: 'Arms', icon: '💪' },
  { id: 'shoulders', name: 'Shoulders', icon: '🏋️' },
  { id: 'abs', name: 'Abs', icon: '⚡' },
];

export default function HomeScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await initDatabase();
      await seedDatabase(); // Remove this in production
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing app:', error);
      setIsLoading(false);
    }
  };

  const navigateToBodyPart = (bodyPart) => {
    navigation.navigate('Workouts', { bodyPart: bodyPart.id });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workout Library</Text>
        <Text style={styles.subtitle}>Choose your target muscle group</Text>
      </View>

      <View style={styles.bodyPartsGrid}>
        {BODY_PARTS.map((bodyPart) => (
          <TouchableOpacity
            key={bodyPart.id}
            style={styles.bodyPartCard}
            onPress={() => navigateToBodyPart(bodyPart)}
          >
            <Text style={styles.bodyPartIcon}>{bodyPart.icon}</Text>
            <Text style={styles.bodyPartName}>{bodyPart.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  bodyPartsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  bodyPartCard: {
    width: '45%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bodyPartIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  bodyPartName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});