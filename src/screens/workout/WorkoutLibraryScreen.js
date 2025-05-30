import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getWorkoutsByBodyPart } from '../../services/database/database';
import WorkoutCard from './WorkoutCard';

export default function WorkoutLibraryScreen({ route, navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const bodyPart = route.params?.bodyPart || 'chest';

  useEffect(() => {
    loadWorkouts();
  }, [bodyPart]);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const workoutData = await getWorkoutsByBodyPart(bodyPart);
      setWorkouts(workoutData);
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutPress = (workout) => {
    navigation.navigate('WorkoutDetail', { workout });
  };

  const renderWorkout = ({ item }) => (
    <WorkoutCard workout={item} onPress={handleWorkoutPress} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1)} Workouts
      </Text>
      
      <FlatList
        data={workouts}
        renderItem={renderWorkout}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    padding: 20,
    paddingBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
});