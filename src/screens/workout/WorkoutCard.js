import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function WorkoutCard({ workout, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(workout)}>
      <Image source={{ uri: workout.image_url }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{workout.name}</Text>
        <Text style={styles.bodyPart}>{workout.body_part.toUpperCase()}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {workout.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  bodyPart: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});