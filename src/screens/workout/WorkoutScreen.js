import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import ExerciseModal from './ExerciseModal';
import styles from './WorkoutScreen.styles'; // Import styles
const { width } = Dimensions.get('window');

const WorkoutScreen = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedExercises, setCompletedExercises] = useState([]);
  
  // Refs for cleanup
  const timerRef = useRef(null);
  const workoutStartTimeRef = useRef(null);
  const isMountedRef = useRef(true);
  
  const navigation = useNavigation();
  const route = useRoute();

  // Get parameters from navigation
  const params = route?.params || {};
  const fitnessGoal = params?.fitnessGoal || 'General Fitness';
  const targetBodyParts = params?.targetBodyParts || [];
  const difficultyLevel = params?.difficultyLevel || 'Beginner';

  // Convert difficulty label to API format
  const getDifficultyApiValue = (difficulty) => {
    const difficultyMap = {
      'Beginner': 'beginner',
      'Intermediate': 'intermediate', 
      'Expert': 'expert'
    };
    return difficultyMap[difficulty] || 'beginner';
  };

  // FIXED: Improved timer effect with better cleanup
  // Your timer effect:
  useEffect(() => {
    if (isTimerRunning && isMountedRef.current) {
      timerRef.current = setInterval(() => {
        if (isMountedRef.current) {
          setWorkoutTimer(prev => prev + 1);
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isTimerRunning]);


  // Component cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Mapping fitness goals to API exercise types
  const mapGoalToType = (goal) => {
    const goalMap = {
      'Weight Loss': 'cardio',
      'Muscle Gain': 'strength',
      'Strength Building': 'powerlifting',
      'Endurance': 'cardio',
      'Flexibility': 'stretching',
      'General Fitness': 'strength',
      'Cardio': 'cardio',
      'Olympic Training': 'olympic_weightlifting',
      'Power Training': 'plyometrics',
      'Strongman': 'strongman'
    };
    return goalMap[goal] || 'strength';
  };

  // Mapping body parts to API muscle parameters
  const mapBodyPartToMuscle = (bodyPart) => {
    const muscleMap = {
      'Chest': 'chest',
      'Back': 'lats',
      'Shoulders': 'shoulders',
      'Arms': 'biceps',
      'Biceps': 'biceps',
      'Triceps': 'triceps',
      'Legs': 'quadriceps',
      'Quads': 'quadriceps',
      'Hamstrings': 'hamstrings',
      'Glutes': 'glutes',
      'Calves': 'calves',
      'Core': 'abdominals',
      'Abs': 'abdominals',
      'Forearms': 'forearms'
    };
    return muscleMap[bodyPart] || bodyPart.toLowerCase();
  };

  // FIXED: Memoized fetchExercises to prevent unnecessary re-calls
  const fetchExercises = useCallback(async () => {
    if (!fitnessGoal || fitnessGoal === 'General Fitness') {
      if (!params?.fitnessGoal && (!targetBodyParts || targetBodyParts.length === 0)) {
        console.log('No fitness goal selected, skipping exercise fetch');
        setExercises([]);
        setLoading(false);
        return;
      }
    }

    if (!isMountedRef.current) return;

    setLoading(true);
    setError(null);
    
    try {
      const apiDifficulty = getDifficultyApiValue(difficultyLevel);
      
      console.log('Fetching exercises with params:', { 
        fitnessGoal, 
        targetBodyParts, 
        difficultyLevel,
        apiDifficulty 
      });
      
      const exerciseType = mapGoalToType(fitnessGoal);
      let allExercises = [];

      if (targetBodyParts.length > 0) {
        for (const bodyPart of targetBodyParts) {
          const muscle = mapBodyPartToMuscle(bodyPart);
          const url = `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}&type=${exerciseType}&difficulty=${apiDifficulty}`;
          
          console.log(`Fetching from: ${url}`);
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'X-Api-Key': 'xDzK4Es7NP0bZzKHsd2Cgg==DWdfQQprD9OwIOhn',
              'Accept': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log(`Exercises for ${bodyPart} (${apiDifficulty}):`, data.length);
          
          const filteredData = data.filter(exercise => {
            if (!exercise.difficulty) return true;
            return exercise.difficulty.toLowerCase() === apiDifficulty.toLowerCase();
          });
          
          console.log(`Filtered exercises for ${bodyPart}:`, filteredData.length);
          
          const exercisesWithBodyPart = filteredData.slice(0, 3).map(exercise => ({
            ...exercise,
            targetBodyPart: bodyPart
          }));
          
          allExercises = [...allExercises, ...exercisesWithBodyPart];
        }
      } else {
        const url = `https://api.api-ninjas.com/v1/exercises?type=${exerciseType}&difficulty=${apiDifficulty}`;
        
        console.log(`Fetching general exercises: ${url}`);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'X-Api-Key': 'xDzK4Es7NP0bZzKHsd2Cgg==DWdfQQprD9OwIOhn',
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        const filteredData = data.filter(exercise => {
          if (!exercise.difficulty) return true;
          return exercise.difficulty.toLowerCase() === apiDifficulty.toLowerCase();
        });
        
        allExercises = filteredData.slice(0, 8);
      }

      console.log('Total exercises fetched:', allExercises.length);
      console.log('Sample exercise difficulties:', allExercises.slice(0, 3).map(ex => ex.difficulty));
      
      if (isMountedRef.current) {
        setExercises(allExercises);
        
        if (allExercises.length === 0) {
          setError(`No ${apiDifficulty} level exercises found for your selected criteria. Try adjusting your selections.`);
          const mockExercises = generateMockExercises(targetBodyParts, fitnessGoal, apiDifficulty);
          setExercises(mockExercises);
        }
      }
      
    } catch (err) {
      console.error('Error fetching exercises:', err);
      if (isMountedRef.current) {
        setError(`Failed to load exercises: ${err.message}`);
        
        const apiDifficulty = getDifficultyApiValue(difficultyLevel);
        const mockExercises = generateMockExercises(targetBodyParts, fitnessGoal, apiDifficulty);
        setExercises(mockExercises);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [fitnessGoal, targetBodyParts, difficultyLevel, params]);

  // Generate mock exercises for testing when API fails
  const generateMockExercises = (bodyParts, goal, difficulty = 'beginner') => {
    const mockData = {
      'Chest': [
        { name: 'Push-ups', muscle: 'chest', difficulty: 'beginner', type: 'strength', instructions: 'Start in plank position, lower chest to ground, push back up. Keep your body straight and core engaged.' },
        { name: 'Incline Push-ups', muscle: 'chest', difficulty: 'beginner', type: 'strength', instructions: 'Place hands on elevated surface, perform push-up motion. Great for beginners.' },
      ],
      'Back': [
        { name: 'Superman', muscle: 'lats', difficulty: 'beginner', type: 'strength', instructions: 'Lie face down, lift chest and legs off ground.' },
        { name: 'Bird-Dog', muscle: 'lats', difficulty: 'beginner', type: 'stability', instructions: 'Extend opposite arm and leg while on all fours, alternate sides.' },
      ],
      'Legs': [
        { name: 'Wall Sits', muscle: 'quadriceps', difficulty: 'beginner', type: 'isometric', instructions: 'Sit against wall with thighs parallel to ground. Hold for time.' },
        { name: 'Bodyweight Squats', muscle: 'quadriceps', difficulty: 'beginner', type: 'strength', instructions: 'Stand with feet shoulder-width apart, lower as if sitting in chair.' },
      ],
      'Core': [
        { name: 'Plank', muscle: 'abdominals', difficulty: 'beginner', type: 'isometric', instructions: 'Hold plank position keeping body straight.' },
      ],
    };

    let exercises = [];
    
    if (bodyParts.length > 0) {
      bodyParts.forEach(part => {
        if (mockData[part]) {
          const filteredExercises = mockData[part].filter(ex => 
            ex.difficulty.toLowerCase() === difficulty.toLowerCase()
          );
          
          exercises = exercises.concat(filteredExercises.map(ex => ({
            ...ex,
            targetBodyPart: part
          })));
        }
      });
    } else {
      Object.values(mockData).forEach(group => {
        const filteredExercises = group.filter(ex => 
          ex.difficulty.toLowerCase() === difficulty.toLowerCase()
        );
        if (filteredExercises.length > 0) {
          exercises = exercises.concat(filteredExercises.slice(0, 1));
        }
      });
    }

    return exercises;
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchExercises();
    setRefreshing(false);
  }, [fetchExercises]);

  // FIXED: Single, properly memoized useFocusEffect
  useFocusEffect(
    useCallback(() => {
      // Only fetch exercises if user has actually selected parameters and component is mounted
      if (isMountedRef.current && params && (params.fitnessGoal || params.targetBodyParts?.length > 0 || params.difficultyLevel)) {
        fetchExercises();
      }
    }, [fetchExercises, params])
  );

  // FIXED: Improved workout start logic with better state management
  const handleStartWorkout = useCallback(() => {
    if (exercises.length === 0) {
      Alert.alert('No Exercises', 'Please wait for exercises to load before starting.');
      return;
    }

    Alert.alert(
      'Start Your Workout! 🏋️‍♂️',
      `Ready to begin your ${difficultyLevel} ${fitnessGoal.toLowerCase()} workout${targetBodyParts.length > 0 ? ` focusing on ${targetBodyParts.join(', ')}` : ''}?\n\nYou have ${exercises.length} exercises to complete.`,
      [
        { text: 'Not Yet', style: 'cancel' },
        { 
          text: 'Let\'s Go!', 
          onPress: () => {
            // Reset workout states
            setWorkoutStarted(true);
            setCurrentExerciseIndex(0);
            setWorkoutTimer(0);
            setCompletedExercises([]);
            workoutStartTimeRef.current = new Date();
            
            // Start timer and show modal
            setIsTimerRunning(true);
            setShowExerciseModal(true);
          }
        }
      ]
    );
  }, [exercises.length, difficultyLevel, fitnessGoal, targetBodyParts]);

const handleNextExercise = useCallback(() => {
  const currentExercise = exercises[currentExerciseIndex];
  const newCompletedExercises = [...completedExercises, currentExercise];
  setCompletedExercises(newCompletedExercises);

  if (currentExerciseIndex < exercises.length - 1) {
    setCurrentExerciseIndex(prev => prev + 1);
  } else {
    // Pass the updated completed exercises count to handleWorkoutComplete
    handleWorkoutComplete(newCompletedExercises);
  }
}, [currentExerciseIndex, exercises, completedExercises]);

  const handleSkipExercise = useCallback(() => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      handleWorkoutComplete();
    }
  }, [currentExerciseIndex, exercises.length]);

  // ENHANCED: Workout completion with detailed data
  const handleWorkoutComplete = useCallback((finalCompletedExercises = completedExercises) => {
    const endTime = new Date();

    // Use the passed finalCompletedExercises or calculate it properly
    const actualCompletedCount = finalCompletedExercises ? 
    finalCompletedExercises.length : 
    completedExercises.length + 1; // +1 for the current exercise being completed
    
    const actualCompletedExercises = finalCompletedExercises || 
    [...completedExercises, exercises[currentExerciseIndex]];
    const workoutData = {
      id: Date.now().toString(),
      date: endTime.toISOString(),
      startTime: workoutStartTimeRef.current?.toISOString() || endTime.toISOString(),
      endTime: endTime.toISOString(),
      goal: fitnessGoal,
      bodyParts: targetBodyParts,
      difficulty: difficultyLevel,
      duration: workoutTimer,
      totalExercises: exercises.length,
      completedExercises: actualCompletedCount,
      completionRate: Math.round((actualCompletedCount / exercises.length) * 100),
      exercises: actualCompletedExercises,
      status: 'completed'
    };

    setIsTimerRunning(false);
    setShowExerciseModal(false);
    
    Alert.alert(
      'Workout Complete! 🎉',
      `Awesome job! You completed ${actualCompletedCount} out of ${exercises.length} exercises in ${formatTime(workoutTimer)}.\n\nCompletion Rate: ${workoutData.completionRate}%`,
      [
        {
          text: 'View Summary',
          onPress: () => showWorkoutSummary(workoutData)
        },
        {
          text: 'Save & Done',
          onPress: () => saveAndNavigateHome(workoutData)
        }
      ]
    );
  }, [fitnessGoal, targetBodyParts, difficultyLevel, workoutTimer, exercises, completedExercises, currentExerciseIndex]);

  // NEW: Finish workout early function
  const handleFinishWorkout = useCallback(() => {
    Alert.alert(
      'Finish Workout?',
      `You've completed ${completedExercises.length} out of ${exercises.length} exercises.\n\nAre you sure you want to finish this workout? Your progress will be saved.`,
      [
        { text: 'Continue Workout', style: 'cancel' },
        { 
          text: 'Finish Now', 
          onPress: () => handleWorkoutComplete()
        }
      ]
    );
  }, [completedExercises.length, exercises.length, handleWorkoutComplete]);

  const showWorkoutSummary = useCallback((workoutData) => {
    Alert.alert(
      'Workout Summary 📊',
      `Time: ${formatTime(workoutData.duration)}\nExercises Completed: ${workoutData.completedExercises}/${workoutData.totalExercises}\nCompletion Rate: ${workoutData.completionRate}%\nGoal: ${workoutData.goal}\n\nGreat work! Keep it up! 💪`,
      [{ 
        text: 'Save Workout', 
        onPress: () => saveAndNavigateHome(workoutData)
      }]
    );
  }, []);

  // NEW: Save workout and navigate to home
  const saveAndNavigateHome = useCallback((workoutData) => {
    resetWorkoutState();
    navigation.navigate('Home', { 
      completedWorkout: workoutData,
      refresh: true 
    });
  }, [navigation]);

  // Reset workout state function
  const resetWorkoutState = useCallback(() => {
    setWorkoutStarted(false);
    setCurrentExerciseIndex(0);
    setWorkoutTimer(0);
    setCompletedExercises([]);
    setIsTimerRunning(false);
    setShowExerciseModal(false);
    workoutStartTimeRef.current = null;
  }, []);

  const handleIndividualExercise = useCallback((exercise, index) => {
    setCurrentExerciseIndex(index);
    setShowExerciseModal(true);
  }, []);

  // FIXED: Improved modal close handler
  const handleModalClose = useCallback(() => {
    if (workoutStarted) {
      Alert.alert(
        'Close Workout?',
        'Are you sure you want to close the workout? You can resume it later.',
        [
          { text: 'Keep Open', style: 'cancel' },
          { 
            text: 'Close', 
            onPress: () => {
              setShowExerciseModal(false);
              setIsTimerRunning(false);
            }
          }
        ]
      );
    } else {
      setShowExerciseModal(false);
    }
  }, [workoutStarted]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return '#28a745';
      case 'intermediate':
        return '#ffc107';
      case 'expert':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const renderExercise = useCallback((exercise, index) => (
    <View key={index} style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
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
            {exercise.muscle || exercise.targetBodyPart || 'Not specified'}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Type:</Text>
          <Text style={styles.detailValue}>{exercise.type || 'Strength'}</Text>
        </View>
        
        {exercise.equipment && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Equipment:</Text>
            <Text style={styles.detailValue}>{exercise.equipment}</Text>
          </View>
        )}
        
        <View style={styles.instructionsContainer}>
          <Text style={styles.detailLabel}>Instructions:</Text>
          <Text style={styles.instructionsText} numberOfLines={3}>
            {exercise.instructions || 'No instructions available.'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => handleIndividualExercise(exercise, index)}
      >
        <Text style={styles.startButtonText}>View Exercise</Text>
      </TouchableOpacity>
    </View>
  ), [handleIndividualExercise]);

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Workout Plan</Text>
          
          {workoutStarted && (
            <View style={styles.workoutStatus}>
              <Text style={styles.statusText}>
                🔥 Workout in Progress - {formatTime(workoutTimer)}
              </Text>
              <Text style={styles.progressText}>
                Exercise {currentExerciseIndex + 1} of {exercises.length} • {completedExercises.length} completed
              </Text>
            </View>
          )}
          
          {params?.fitnessGoal || params?.targetBodyParts?.length > 0 ? (
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
              
              {!workoutStarted && (
                <TouchableOpacity 
                  style={styles.mainStartButton}
                  onPress={handleStartWorkout}
                  disabled={loading}
                >
                  <Text style={styles.mainStartButtonText}>
                    🚀 Start Full Workout ({exercises.length} exercises)
                  </Text>
                </TouchableOpacity>
              )}

              {workoutStarted && (
                <TouchableOpacity 
                  style={styles.pauseButton}
                  onPress={() => {
                    setIsTimerRunning(!isTimerRunning);
                    Alert.alert(
                      isTimerRunning ? 'Workout Paused' : 'Workout Resumed',
                      isTimerRunning ? 'Take your time!' : 'Let\'s continue!'
                    );
                  }}
                >
                  <Text style={styles.pauseButtonText}>
                    {isTimerRunning ? '⏸️ Pause Workout' : '▶️ Resume Workout'}
                  </Text>
                </TouchableOpacity>
              )}
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
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchExercises}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}


        {/* Exercises List */}
        {exercises.length > 0 ? (
          <View style={styles.exercisesContainer}>
            <Text style={styles.exercisesTitle}>
              {exercises.length} Exercise{exercises.length !== 1 ? 's' : ''} for You
            </Text>
            <Text style={styles.exercisesSubtitle}>
              Difficulty: {difficultyLevel} • Goal: {fitnessGoal}
            </Text>
            
            {exercises.map((exercise, index) => renderExercise(exercise, index))}
          </View>
        ) : (   
          !loading && !error && (params?.fitnessGoal || params?.targetBodyParts?.length > 0) && (
            <View style={styles.noExercisesContainer}>
              <Text style={styles.noExercisesText}>
                No exercises found for your criteria.
              </Text>
              <TouchableOpacity 
                style={styles.retryButton} 
                onPress={fetchExercises}
              >
                <Text style={styles.retryButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </ScrollView>

      {/* Exercise Modal */}
      <ExerciseModal
        visible={showExerciseModal}
        exercise={exercises[currentExerciseIndex]}
        currentIndex={currentExerciseIndex}
        totalExercises={exercises.length}
        workoutTimer={workoutTimer}
        workoutStarted={workoutStarted}
        onClose={handleModalClose}
        onSkip={handleSkipExercise}
        onComplete={handleNextExercise}
        onFinishWorkout={handleFinishWorkout}
        formatTime={formatTime}
        getDifficultyColor={getDifficultyColor}
        styles={styles}
      />
    </View>
  );
};

export default WorkoutScreen;