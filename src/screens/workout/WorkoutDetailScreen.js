// src/screens/workout/WorkoutDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

const WorkoutDetailScreen = ({ route, navigation }) => {
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  // Get workout ID from navigation params
  const { workoutId } = route.params;

  useEffect(() => {
    fetchWorkoutDetails();
  }, [workoutId]);

  const fetchWorkoutDetails = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock workout data - replace with actual API response
      const mockWorkout = {
        id: workoutId,
        name: 'Upper Body Strength',
        description: 'A comprehensive upper body workout focusing on building strength and muscle mass.',
        duration: '45-60 minutes',
        difficulty: 'Intermediate',
        equipment: ['Dumbbells', 'Barbell', 'Bench'],
        exercises: [
          {
            id: 1,
            name: 'Bench Press',
            sets: 4,
            reps: '8-10',
            restTime: '2-3 minutes',
            instructions: 'Lie on bench, grip bar slightly wider than shoulders, lower to chest, press up.',
            targetMuscles: ['Chest', 'Shoulders', 'Triceps']
          },
          {
            id: 2,
            name: 'Bent-Over Row',
            sets: 4,
            reps: '8-10',
            restTime: '2-3 minutes',
            instructions: 'Hinge at hips, pull bar to lower chest, squeeze shoulder blades.',
            targetMuscles: ['Back', 'Biceps']
          },
          {
            id: 3,
            name: 'Overhead Press',
            sets: 3,
            reps: '10-12',
            restTime: '90 seconds',
            instructions: 'Press weight overhead, keep core tight, lower with control.',
            targetMuscles: ['Shoulders', 'Triceps', 'Core']
          },
          {
            id: 4,
            name: 'Pull-ups',
            sets: 3,
            reps: '6-10',
            restTime: '2 minutes',
            instructions: 'Hang from bar, pull body up until chin over bar, lower with control.',
            targetMuscles: ['Back', 'Biceps']
          },
          {
            id: 5,
            name: 'Dips',
            sets: 3,
            reps: '8-12',
            restTime: '90 seconds',
            instructions: 'Support body on parallel bars, lower until shoulders below elbows, push up.',
            targetMuscles: ['Triceps', 'Chest', 'Shoulders']
          }
        ]
      };
      
      setWorkout(mockWorkout);
    } catch (error) {
      console.error('Error fetching workout details:', error);
      Alert.alert('Error', 'Failed to load workout details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartWorkout = async () => {
    try {
      setIsStarting(true);
      
      Alert.alert(
        'Start Workout',
        `Are you ready to start "${workout.name}"?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Start',
            onPress: () => {
              // Navigate to workout session screen (to be implemented)
              // navigation.navigate('WorkoutSession', { workoutId: workout.id });
              Alert.alert('Success', 'Workout started! (Session screen to be implemented)');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error starting workout:', error);
      Alert.alert('Error', 'Failed to start workout. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return '#4CAF50';
      case 'intermediate':
        return '#FF9800';
      case 'advanced':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const renderExerciseCard = (exercise, index) => (
    <View key={exercise.id} style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseNumber}>{index + 1}</Text>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
      </View>
      
      <View style={styles.exerciseDetails}>
        <View style={styles.exerciseStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Sets</Text>
            <Text style={styles.statValue}>{exercise.sets}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Reps</Text>
            <Text style={styles.statValue}>{exercise.reps}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Rest</Text>
            <Text style={styles.statValue}>{exercise.restTime}</Text>
          </View>
        </View>
        
        <Text style={styles.exerciseInstructions}>{exercise.instructions}</Text>
        
        <View style={styles.targetMuscles}>
          <Text style={styles.musclesLabel}>Target Muscles:</Text>
          <View style={styles.musclesList}>
            {exercise.targetMuscles.map((muscle, idx) => (
              <View key={idx} style={styles.muscleTag}>
                <Text style={styles.muscleText}>{muscle}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading workout details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!workout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Workout not found</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchWorkoutDetails}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Workout Header */}
        <View style={styles.header}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <Text style={styles.workoutDescription}>{workout.description}</Text>
          
          <View style={styles.workoutMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Duration</Text>
              <Text style={styles.metaValue}>{workout.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Difficulty</Text>
              <Text style={[styles.metaValue, { color: getDifficultyColor(workout.difficulty) }]}>
                {workout.difficulty}
              </Text>
            </View>
          </View>
          
          {workout.equipment && workout.equipment.length > 0 && (
            <View style={styles.equipment}>
              <Text style={styles.equipmentLabel}>Equipment Needed:</Text>
              <View style={styles.equipmentList}>
                {workout.equipment.map((item, index) => (
                  <View key={index} style={styles.equipmentTag}>
                    <Text style={styles.equipmentText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Exercises List */}
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Exercises ({workout.exercises.length})</Text>
          {workout.exercises.map((exercise, index) => renderExerciseCard(exercise, index))}
        </View>

        {/* Bottom spacing for button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Start Workout Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.startButton, isStarting && styles.startButtonDisabled]}
          onPress={handleStartWorkout}
          disabled={isStarting}
        >
          {isStarting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.startButtonText}>Start Workout</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  workoutName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  workoutDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  workoutMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  equipment: {
    marginTop: 16,
  },
  equipmentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  equipmentText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
  },
  exercisesSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    backgroundColor: '#E3F2FD',
    width: 32,
    height: 32,
    borderRadius: 16,
    textAlign: 'center',
    lineHeight: 32,
    marginRight: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  exerciseDetails: {
    marginTop: 8,
  },
  exerciseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  exerciseInstructions: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  targetMuscles: {
    marginTop: 8,
  },
  musclesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  musclesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  muscleTag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  muscleText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  startButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WorkoutDetailScreen;