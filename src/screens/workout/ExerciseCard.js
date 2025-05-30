import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function ExerciseCard({ exercise }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: exercise.image_url }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Text style={styles.description}>{exercise.description}</Text>
        <View style={styles.metrics}>
          {exercise.sets && (
            <Text style={styles.metric}>Sets: {exercise.sets}</Text>
          )}
          {exercise.reps && (
            <Text style={styles.metric}>Reps: {exercise.reps}</Text>
          )}
          {exercise.duration && (
            <Text style={styles.metric}>Duration: {exercise.duration}s</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
});