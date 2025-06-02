import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

const WorkoutScreen = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  
  const navigation = useNavigation();
  const route = useRoute();

  // Get parameters from navigation - handle both direct params and nested params
  const fitnessGoal = route?.params?.fitnessGoal || 
                     route?.params?.screen?.params?.fitnessGoal || 
                     'General Fitness';
  const targetBodyParts = route?.params?.targetBodyParts || 
                         route?.params?.screen?.params?.targetBodyParts || 
                         [];

  // Debug logging to check what params we're receiving
  console.log('WorkoutScreen params:', route?.params);
  console.log('Fitness goal:', fitnessGoal);
  console.log('Target body parts:', targetBodyParts);

  const fetchExercises = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        'https://gym-fit.p.rapidapi.com/v1/exercises/c2b6fccf-2c2c-43e1-aca3-a3cb73caa78b',
        {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'gym-fit.p.rapidapi.com',
            'x-rapidapi-key': '8a1d3b8e81msh8d09a95cf8d0c85p1a801fjsne3e999c35f38',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Filter exercises based on selected body parts if available
      let filteredExercises = data;
      if (targetBodyParts.length > 0 && Array.isArray(data)) {
        filteredExercises = data.filter(exercise => {
          const exerciseTarget = exercise.target_muscle?.toLowerCase() || '';
          return targetBodyParts.some(bodyPart => 
            exerciseTarget.includes(bodyPart.toLowerCase()) ||
            bodyPart.toLowerCase().includes(exerciseTarget)
          );
        });
      }

      setExercises(Array.isArray(filteredExercises) ? filteredExercises : []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExercises();
    setRefreshing(false);
  };

  // Use useFocusEffect to handle navigation and param changes
  useFocusEffect(
    React.useCallback(() => {
      // Only fetch exercises if we have valid parameters
      if (route?.params && (route.params.fitnessGoal || route.params.targetBodyParts)) {
        fetchExercises();
      }
    }, [route?.params])
  );

  useEffect(() => {
    // Initial load if no params (default workout)
    if (!route?.params) {
      fetchExercises();
    }
  }, []);

  const handleStartWorkout = () => {
    if (exercises.length === 0) {
      Alert.alert('No Exercises', 'Please wait for exercises to load before starting.');
      return;
    }

    Alert.alert(
      'Start Your Workout!',
      `Ready to begin your ${fitnessGoal.toLowerCase()} workout focusing on ${targetBodyParts.join(', ')}?`,
      [
        { text: 'Not Yet', style: 'cancel' },
        { 
          text: 'Let\'s Go!', 
          onPress: () => {
            setWorkoutStarted(true);
            // Here you could navigate to a detailed workout screen
            // or start a timer, etc.
            Alert.alert(
              '🔥 Workout Started!', 
              'Good luck! Remember to stay hydrated and listen to your body.',
              [
                {
                  text: 'Got it!',
                  onPress: () => {
                    // You could start a workout timer here
                    console.log('Workout session started');
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleIndividualExercise = (exercise) => {
    Alert.alert(
      'Start Exercise',
      `Ready to start "${exercise.name || 'this exercise'}"?`,
      [
        { text: 'Skip', style: 'cancel' },
        { 
          text: 'Start', 
          onPress: () => {
            Alert.alert('Exercise Started!', `Good luck with your ${exercise.name}!`);
          }
        }
      ]
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
      case 'easy':
        return '#28a745';
      case 'intermediate':
      case 'medium':
        return '#ffc107';
      case 'advanced':
      case 'hard':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const renderExercise = (exercise, index) => (
    <View key={index} style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>
          {exercise.name || exercise.exercise_name || `Exercise ${index + 1}`}
        </Text>
        <View style={[
          styles.difficultyBadge,
          { backgroundColor: getDifficultyColor(exercise.difficulty) }
        ]}>
          <Text style={styles.difficultyText}>
            {exercise.difficulty || 'N/A'}
          </Text>
        </View>
      </View>
      
      <View style={styles.exerciseDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Target Muscle:</Text>
          <Text style={styles.detailValue}>
            {exercise.target_muscle || exercise.target || 'Not specified'}
          </Text>
        </View>
        
        {exercise.equipment && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Equipment:</Text>
            <Text style={styles.detailValue}>{exercise.equipment}</Text>
          </View>
        )}
        
        {exercise.instructions && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.detailLabel}>Instructions:</Text>
            <Text style={styles.instructionsText} numberOfLines={3}>
              {exercise.instructions}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => handleIndividualExercise(exercise)}
      >
        <Text style={styles.startButtonText}>Start Exercise</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your personalized workout...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with user selections */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Workout Plan</Text>
          
          {/* Display selected parameters or default message */}
          {route?.params?.fitnessGoal || route?.params?.targetBodyParts ? (
            <>
              <View style={styles.goalContainer}>
                <Text style={styles.goalLabel}>Goal:</Text>
                <Text style={styles.goalValue}>{fitnessGoal}</Text>
              </View>
              {targetBodyParts.length > 0 && (
                <View style={styles.bodyPartsContainer}>
                  <Text style={styles.bodyPartsLabel}>Focus Areas:</Text>
                  <View style={styles.bodyPartsList}>
                    {targetBodyParts.map((part, index) => (
                      <View key={index} style={styles.bodyPartChip}>
                        <Text style={styles.bodyPartText}>{part}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              
              {/* Main Start Workout Button */}
              <TouchableOpacity 
                style={[styles.mainStartButton, workoutStarted && styles.workoutStartedButton]}
                onPress={handleStartWorkout}
                disabled={loading}
              >
                <Text style={styles.mainStartButtonText}>
                  {workoutStarted ? '🔥 Workout In Progress' : '🚀 Start Full Workout'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.noSelectionContainer}>
              <Text style={styles.noSelectionText}>
                No specific workout selected. Showing general exercises.
              </Text>
              <TouchableOpacity 
                style={styles.selectGoalButton}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.selectGoalButtonText}>Select Fitness Goal</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Error State */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchExercises}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Exercises List */}
        {!error && exercises.length > 0 && (
          <View style={styles.exercisesContainer}>
            <Text style={styles.sectionTitle}>
              Recommended Exercises ({exercises.length})
            </Text>
            {exercises.map((exercise, index) => renderExercise(exercise, index))}
          </View>
        )}

        {/* No Exercises State */}
        {!error && !loading && exercises.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No exercises found</Text>
            <Text style={styles.emptyMessage}>
              Try selecting different body parts or check your connection.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchExercises}>
              <Text style={styles.retryButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  header: {
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalLabel: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '600',
  },
  goalValue: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bodyPartsContainer: {
    marginTop: 5,
  },
  bodyPartsLabel: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '600',
    marginBottom: 8,
  },
  bodyPartsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bodyPartChip: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  bodyPartText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  exercisesContainer: {
    gap: 15,
  },
  exerciseCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 10,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  exerciseDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
    width: 120,
  },
  detailValue: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
    textTransform: 'capitalize',
  },
  instructionsContainer: {
    marginTop: 10,
  },
  instructionsText: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    marginTop: 5,
  },
  mainStartButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  workoutStartedButton: {
    backgroundColor: '#ff6b35',
  },
  mainStartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noSelectionContainer: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    marginTop: 10,
  },
  noSelectionText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 10,
  },
  selectGoalButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  selectGoalButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 15,
  },
  emptyContainer: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6c757d',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default WorkoutScreen;