import React, { useState, useEffect, useRef } from 'react';
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
  
  // FIXED: Simplified modal state management
  const timerRef = useRef(null);
  const workoutStartTimeRef = useRef(null);
  
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

  // FIXED: Simplified timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
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

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
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

  const fetchExercises = async () => {
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
      
      setExercises(allExercises);
      
      if (allExercises.length === 0) {
        setError(`No ${apiDifficulty} level exercises found for your selected criteria. Try adjusting your selections.`);
        const mockExercises = generateMockExercises(targetBodyParts, fitnessGoal, apiDifficulty);
        setExercises(mockExercises);
      }
      
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError(`Failed to load exercises: ${err.message}`);
      
      const apiDifficulty = getDifficultyApiValue(difficultyLevel);
      const mockExercises = generateMockExercises(targetBodyParts, fitnessGoal, apiDifficulty);
      setExercises(mockExercises);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock exercises for testing when API fails
  const generateMockExercises = (bodyParts, goal, difficulty = 'beginner') => {
    const mockData = {
      'Chest': [
        { name: 'Push-ups', muscle: 'chest', difficulty: 'beginner', type: 'strength', instructions: 'Start in plank position, lower chest to ground, push back up. Keep your body straight and core engaged.' },
        { name: 'Incline Push-ups', muscle: 'chest', difficulty: 'beginner', type: 'strength', instructions: 'Place hands on elevated surface, perform push-up motion. Great for beginners.' },
        { name: 'Chest Squeeze', muscle: 'chest', difficulty: 'beginner', type: 'isometric', instructions: 'Hold a ball or towel between palms, press hands together to activate chest muscles.' },
        { name: 'Decline Push-ups', muscle: 'chest', difficulty: 'intermediate', type: 'strength', instructions: 'Place feet on elevated surface, perform push-up motion. More challenging variation.' },
        { name: 'Dumbbell Bench Press', muscle: 'chest', difficulty: 'intermediate', type: 'strength', instructions: 'Lie on a bench, press dumbbells from chest level up until arms are extended.' },
        { name: 'Clap Push-ups', muscle: 'chest', difficulty: 'expert', type: 'plyometric', instructions: 'Perform a push-up and explode up to clap hands mid-air.' },
        { name: 'One-arm Push-ups', muscle: 'chest', difficulty: 'expert', type: 'strength', instructions: 'Perform push-ups using one arm. Maintain balance and control.' },
      ],
      'Back': [
        { name: 'Superman', muscle: 'lats', difficulty: 'beginner', type: 'strength', instructions: 'Lie face down, lift chest and legs off ground.' },
        { name: 'Bird-Dog', muscle: 'lats', difficulty: 'beginner', type: 'stability', instructions: 'Extend opposite arm and leg while on all fours, alternate sides.' },
        { name: 'Reverse Fly', muscle: 'lats', difficulty: 'intermediate', type: 'strength', instructions: 'Bend forward, lift arms to sides squeezing shoulder blades.' },
        { name: 'Bent-over Rows', muscle: 'lats', difficulty: 'intermediate', type: 'strength', instructions: 'Hold weights, bend forward, pull elbows back like rowing.' },
        { name: 'Pull-ups', muscle: 'lats', difficulty: 'expert', type: 'strength', instructions: 'Hang from bar, pull body up until chin clears bar.' },
        { name: 'Deadlifts', muscle: 'lats', difficulty: 'expert', type: 'strength', instructions: 'Lift barbell from ground while keeping back straight.' },
      ],
      'Legs': [
        { name: 'Wall Sits', muscle: 'quadriceps', difficulty: 'beginner', type: 'isometric', instructions: 'Sit against wall with thighs parallel to ground. Hold for time.' },
        { name: 'Bodyweight Squats', muscle: 'quadriceps', difficulty: 'beginner', type: 'strength', instructions: 'Stand with feet shoulder-width apart, lower as if sitting in chair.' },
        { name: 'Lunges', muscle: 'quadriceps', difficulty: 'intermediate', type: 'strength', instructions: 'Step forward into lunge position, lower and return. Alternate legs.' },
        { name: 'Jump Squats', muscle: 'quadriceps', difficulty: 'expert', type: 'plyometric', instructions: 'Perform squats with explosive jump at top.' },
        { name: 'Pistol Squats', muscle: 'quadriceps', difficulty: 'expert', type: 'strength', instructions: 'Perform one-legged squats while keeping other leg extended forward.' },
      ],
      'Core': [
        { name: 'Plank', muscle: 'abdominals', difficulty: 'beginner', type: 'isometric', instructions: 'Hold plank position keeping body straight.' },
        { name: 'Leg Raises', muscle: 'abdominals', difficulty: 'beginner', type: 'strength', instructions: 'Lie flat, lift legs off ground keeping them straight.' },
        { name: 'Russian Twists', muscle: 'obliques', difficulty: 'intermediate', type: 'strength', instructions: 'Twist torso side to side while seated and feet raised.' },
        { name: 'Bicycle Crunches', muscle: 'abdominals', difficulty: 'intermediate', type: 'strength', instructions: 'Lie on back, bring opposite elbow to knee.' },
        { name: 'V-Ups', muscle: 'abdominals', difficulty: 'expert', type: 'strength', instructions: 'Raise arms and legs to meet at top, forming a V shape.' },
        { name: 'Dragon Flag', muscle: 'abdominals', difficulty: 'expert', type: 'strength', instructions: 'Hold bench behind head, lift entire body straight up. Lower under control.' },
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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExercises();
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (params && (params.fitnessGoal || params.targetBodyParts || params.difficultyLevel)) {
        fetchExercises();
      }
    }, [params])
  );

  useEffect(() => {
    if (!route?.params) {
      fetchExercises();
    }
  }, []);

  // FIXED: Simplified workout start logic
  const handleStartWorkout = () => {
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
  };

  const handleNextExercise = () => {
    const currentExercise = exercises[currentExerciseIndex];
    setCompletedExercises(prev => [...prev, currentExercise]);

    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      handleWorkoutComplete();
    }
  };

  const handleSkipExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      handleWorkoutComplete();
    }
  };

  // ENHANCED: Workout completion with detailed data
  const handleWorkoutComplete = () => {
    const endTime = new Date();
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
      completedExercises: completedExercises.length,
      completionRate: Math.round((completedExercises.length / exercises.length) * 100),
      exercises: completedExercises,
      status: 'completed'
    };

    setIsTimerRunning(false);
    setShowExerciseModal(false);
    
    Alert.alert(
      'Workout Complete! 🎉',
      `Awesome job! You completed ${completedExercises.length} out of ${exercises.length} exercises in ${formatTime(workoutTimer)}.\n\nCompletion Rate: ${workoutData.completionRate}%`,
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
  };

  // NEW: Finish workout early function
  const handleFinishWorkout = () => {
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
  };

  const showWorkoutSummary = (workoutData) => {
    Alert.alert(
      'Workout Summary 📊',
      `Time: ${formatTime(workoutData.duration)}\nExercises Completed: ${workoutData.completedExercises}/${workoutData.totalExercises}\nCompletion Rate: ${workoutData.completionRate}%\nGoal: ${workoutData.goal}\n\nGreat work! Keep it up! 💪`,
      [{ 
        text: 'Save Workout', 
        onPress: () => saveAndNavigateHome(workoutData)
      }]
    );
  };

  // NEW: Save workout and navigate to home
  const saveAndNavigateHome = (workoutData) => {
    resetWorkoutState();
    navigation.navigate('Home', { 
      completedWorkout: workoutData,
      refresh: true 
    });
  };

  // Reset workout state function
  const resetWorkoutState = () => {
    setWorkoutStarted(false);
    setCurrentExerciseIndex(0);
    setWorkoutTimer(0);
    setCompletedExercises([]);
    setIsTimerRunning(false);
    setShowExerciseModal(false);
    workoutStartTimeRef.current = null;
  };

  const handleIndividualExercise = (exercise, index) => {
    setCurrentExerciseIndex(index);
    setShowExerciseModal(true);
  };

  // FIXED: Simplified modal close handler
  const handleModalClose = () => {
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
  };

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

  const renderExercise = (exercise, index) => (
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
  );

  // FIXED: Stable Exercise Modal Component
  const ExerciseModal = () => {
    const currentExercise = exercises[currentExerciseIndex];
    if (!currentExercise) return null;

    return (
      <Modal
        visible={showExerciseModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>⏱️ {formatTime(workoutTimer)}</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleModalClose}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.exerciseCounter}>
              <Text style={styles.counterText}>
                Exercise {currentExerciseIndex + 1} of {exercises.length}
              </Text>
            </View>

            <Text style={styles.modalExerciseName}>{currentExercise.name}</Text>
            
            <View style={styles.modalExerciseInfo}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Target Muscle</Text>
                <Text style={styles.infoValue}>
                  {currentExercise.muscle || currentExercise.targetBodyPart}
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Difficulty</Text>
                <View style={[
                  styles.difficultyBadge,
                  { backgroundColor: getDifficultyColor(currentExercise.difficulty) }
                ]}>
                  <Text style={styles.difficultyText}>
                    {currentExercise.difficulty || 'N/A'}
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Type</Text>
                <Text style={styles.infoValue}>{currentExercise.type}</Text>
              </View>
            </View>

            <View style={styles.instructionsSection}>
              <Text style={styles.instructionsTitle}>Instructions</Text>
              <Text style={styles.modalInstructions}>
                {currentExercise.instructions || 'No instructions available for this exercise.'}
              </Text>
            </View>

            {workoutStarted && (
              <>
                <View style={styles.workoutControls}>
                  <TouchableOpacity
                    style={styles.skipButton}
                    onPress={handleSkipExercise}
                  >
                    <Text style={styles.skipButtonText}>Skip</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={handleNextExercise}
                  >
                    <Text style={styles.completeButtonText}>
                      {currentExerciseIndex === exercises.length - 1 ? 'Complete Workout' : 'Mark Complete & Next'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* NEW: Finish Workout Early Button */}
                <TouchableOpacity
                  style={styles.finishWorkoutButton}
                  onPress={handleFinishWorkout}
                >
                  <Text style={styles.finishWorkoutButtonText}>
                    🏁 Finish Workout Early
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    );
  };

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
          !loading && !error && (
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
      <ExerciseModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
  },
  workoutStatus: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#856404',
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginRight: 8,
  },
  goalValue: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  bodyPartsContainer: {
    marginBottom: 20,
  },
  bodyPartsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  bodyPartsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bodyPartChip: {
    backgroundColor: '#e7f3ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  bodyPartText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  mainStartButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainStartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pauseButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  pauseButtonText: {
    color: '#212529',
    fontSize: 16,
    fontWeight: '600',
  },
  noSelectionContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  noSelectionText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 12,
  },
  selectGoalButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  selectGoalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  errorText: {
    fontSize: 16,
    color: '#721c24',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  exercisesContainer: {
    padding: 20,
  },
  exercisesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  exercisesSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 20,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    flex: 1,
    marginRight: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  exerciseDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: '#212529',
    flex: 1,
    textTransform: 'capitalize',
  },
  instructionsContainer: {
    marginTop: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
    marginTop: 4,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noExercisesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 50,
  },
  noExercisesText: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  timerContainer: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6c757d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  exerciseCounter: {
    backgroundColor: '#e7f3ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  counterText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalExerciseName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalExerciseInfo: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  infoValue: {
    fontSize: 16,
    color: '#212529',
    textTransform: 'capitalize',
  },
  instructionsSection: {
    marginBottom: 30,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 12,
  },
  modalInstructions: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
  },
  workoutControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  skipButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.3,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.65,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  finishWorkoutButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#e0a800',
  },
  finishWorkoutButtonText: {
    color: '#212529',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WorkoutScreen;