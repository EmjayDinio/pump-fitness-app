import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert, RefreshControl,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExerciseModal from './ExerciseModal';
import styles from './WorkoutScreen.styles';

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
  
  const timerRef = useRef(null);
  const workoutStartTimeRef = useRef(null);
  const isMountedRef = useRef(true);
  
  const navigation = useNavigation();
  const route = useRoute();

  const params = route?.params || {};
  const fitnessGoal = params?.fitnessGoal || 'General Fitness';
  const targetBodyParts = params?.targetBodyParts || [];
  const difficultyLevel = params?.difficultyLevel || 'Beginner';

  // Storage key for workout history
  const WORKOUT_HISTORY_KEY = '@workout_history';

  const getDifficultyApiValue = (difficulty) => {
    const difficultyMap = {
      'Beginner': 'beginner',
      'Intermediate': 'intermediate', 
      'Expert': 'expert'
    };
    return difficultyMap[difficulty] || 'beginner';
  };

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && isMountedRef.current) {
      timerRef.current = setInterval(() => {
        if (isMountedRef.current) {
          setWorkoutTimer(prev => prev + 1);
        }
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isTimerRunning]);

  // Component cleanup
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

const generateMockExercises = (bodyParts, goal, difficulty = 'beginner') => {
  const mockData = {
    "Chest": [
      {
        "name": "Push-ups",
        "muscle": "chest",
        "difficulty": "beginner",
        "type": "strength",
        "instructions": "Start in plank position, lower chest to ground, push back up."
      },
      {
        "name": "Incline Push-ups",
        "muscle": "chest",
        "difficulty": "beginner",
        "type": "strength",
        "instructions": "Place hands on elevated surface, perform push-up motion."
      },
      {
        "name": "Bench Press",
        "muscle": "chest",
        "difficulty": "intermediate",
        "type": "strength",
        "instructions": "Lie on bench and press barbell upwards."
      },
      {
        "name": "Chest Dips",
        "muscle": "chest",
        "difficulty": "intermediate",
        "type": "strength",
        "instructions": "Lower and raise your body between dip bars."
      },
      {
        "name": "Clap Push-ups",
        "muscle": "chest",
        "difficulty": "advanced",
        "type": "plyometrics",
        "instructions": "Push explosively from floor and clap mid-air."
      },
      {
        "name": "Weighted Dips",
        "muscle": "chest",
        "difficulty": "advanced",
        "type": "strength",
        "instructions": "Perform dips with added weight."
      }
    ],
    "Back": [
      {
        "name": "Superman",
        "muscle": "lats",
        "difficulty": "beginner",
        "type": "strength",
        "instructions": "Lie face down, lift chest and legs off ground."
      },
      {
        "name": "Bird-Dog",
        "muscle": "lats",
        "difficulty": "beginner",
        "type": "stability",
        "instructions": "Extend opposite arm and leg while on all fours."
      },
      {
        "name": "Pull-ups",
        "muscle": "lats",
        "difficulty": "intermediate",
        "type": "strength",
        "instructions": "Hang from bar and pull chin above it."
      },
      {
        "name": "Bent-over Rows",
        "muscle": "lats",
        "difficulty": "intermediate",
        "type": "strength",
        "instructions": "Bend at hips, pull weights towards torso."
      },
      {
        "name": "Deadlifts",
        "muscle": "lats",
        "difficulty": "advanced",
        "type": "powerlifting",
        "instructions": "Lift barbell from floor to hips."
      },
      {
        "name": "Weighted Pull-ups",
        "muscle": "lats",
        "difficulty": "advanced",
        "type": "strength",
        "instructions": "Pull-ups with added weight."
      }
    ],
    "Shoulders": [
      {
        "name": "Arm Circles",
        "muscle": "shoulders",
        "difficulty": "beginner",
        "type": "cardio",
        "instructions": "Extend arms and make circular motions."
      },
      {
        "name": "Wall Push-ups",
        "muscle": "shoulders",
        "difficulty": "beginner",
        "type": "strength",
        "instructions": "Push against wall with arms extended."
      },
      {
        "name": "Shoulder Press",
        "muscle": "shoulders",
        "difficulty": "intermediate",
        "type": "strength",
        "instructions": "Press weights overhead from shoulder height."
      },
      {
        "name": "Lateral Raises",
        "muscle": "shoulders",
        "difficulty": "intermediate",
        "type": "strength",
        "instructions": "Raise arms to sides until parallel to floor."
      },
      {
        "name": "Handstand Push-ups",
        "muscle": "shoulders",
        "difficulty": "advanced",
        "type": "strength",
        "instructions": "Perform push-ups while in handstand position."
      },
      {
        "name": "Arnold Press",
        "muscle": "shoulders",
        "difficulty": "advanced",
        "type": "strength",
        "instructions": "Rotate dumbbells while pressing overhead."
      }
    ],
    "Arms": [
      {
        "name": "Wall Push-ups",
        "muscle": "biceps",
        "difficulty": "beginner",
        "type": "strength",
        "instructions": "Push against wall focusing on arm muscles."
      },
      {
        "name": "Tricep Dips on Chair",
        "muscle": "triceps",
        "difficulty": "beginner",
        "type": "strength",
        "instructions": "Lower and raise body using chair for support."
      },
      {
        "name": "Bicep Curls",
        "muscle": "biceps",
        "difficulty": "intermediate",
        "type": "strength",
        "instructions": "Curl weights from extended to flexed position."
      },
      {
        "name": "Close-Grip Push-ups",
        "muscle": "triceps",
        "difficulty": "intermediate",
        "type": "strength",
        "instructions": "Push-ups with hands close together."
      },
      {
        "name": "Muscle-ups",
        "muscle": "biceps",
        "difficulty": "advanced",
        "type": "strength",
        "instructions": "Pull-up transitioning to dip above bar."
      },
      {
        "name": "Diamond Push-ups",
        "muscle": "triceps",
        "difficulty": "advanced",
        "type": "strength",
        "instructions": "Push-ups with hands forming diamond shape."
      }
    ],
    "Biceps": [
      {
        "name": "Isometric Holds",
        "muscle": "biceps",
        "difficulty": "beginner",
        "type": "isometric",
        "instructions": "Hold bent arm position without moving."
      },
      {
        "name": "Resistance Band Curls",
        "muscle": "biceps",
        "difficulty": "beginner",
        "type": "strength",
        "instructions": "Curl resistance band from extended position."
      },
      {
        "name": "Hammer Curls",
        "muscle": "biceps",
        "difficulty": "intermediate",
        "type": "strength",
        "instructions": "Curl weights with neutral grip."
      },
      {
        "name": "Concentration Curls",
        "muscle": "biceps",
        "difficulty": "intermediate",
        "type": "strength",
        "instructions": "Seated curls with elbow braced on thigh."
      },
      {
        "name": "21s Bicep Curls",
        "muscle": "biceps",
        "difficulty": "advanced",
        "type": "strength",
        "instructions": "7 half reps bottom, 7 half reps top, 7 full reps."
      },
      {
        "name": "Preacher Curls",
        "muscle": "biceps",
        "difficulty": "advanced",
        "type": "strength",
        "instructions": "Curls performed on preacher bench."
      }
    ],
    "Triceps": [
      {
        "name": "Tricep Wall Push",
        "muscle": "triceps",
        "difficulty": "beginner",
        "type": "strength",
        "instructions": "Push against wall with focus on triceps."
      },
      {
        "name": "Overhead Tricep Stretch",
        "muscle": "triceps",
        "difficulty": "beginner",
        "type": "stretching",
        "instructions": "Stretch tricep by pulling elbow behind head."
      },
      {
        "name": "Tricep Extensions",
        "muscle": "triceps",
        "difficulty": "intermediate",
        "type": "strength",
        "instructions": "Extend weight from behind head to overhead."
      },
      {
        "name": "Tricep Kickbacks",
        "muscle": "triceps",
        "difficulty": "intermediate",
        "type": "strength",
        "instructions": "Extend arm backward while bent over."
      },
      {
        "name": "Close-Grip Bench Press",
        "muscle": "triceps",
        "difficulty": "advanced",
        "type": "powerlifting",
        "instructions": "Bench press with narrow hand placement."
      },
      {
        "name": "Overhead Tricep Press",
        "muscle": "triceps",
        "difficulty": "advanced",
        "type": "strength",
        "instructions": "Press heavy weight from behind head."
      }
    ],
    "Legs": [
      {
        "name": "Wall Sits",
        "muscle": "quadriceps",
        "difficulty": "beginner",
        "type": "isometric",
        "instructions": "Sit against wall with thighs parallel to ground."
      },
      {
        "name": "Bodyweight Squats",
        "muscle": "quadriceps",
        "difficulty": "beginner",
        "type": "strength",
        "instructions": "Stand, squat down and return."
      },
      {
        "name": "Lunges",
        "muscle": "quadriceps",
        "difficulty": "intermediate",
        "type": "strength",
        "instructions": "Step forward, lower back knee to ground."
      },
      {
        "name": "Bulgarian Split Squats",
        "muscle": "quadriceps",
        "difficulty": "intermediate",
        "type": "strength",
        "instructions": "Rear foot elevated while squatting with front leg."
      },
      {
        "name": "Pistol Squats",
        "muscle": "quadriceps",
        "difficulty": "advanced",
        "type": "strength",
        "instructions": "One-legged squats with other leg extended."
      },
      {
        "name": "Barbell Back Squat",
        "muscle": "quadriceps",
        "difficulty": "advanced",
        "type": "powerlifting",
        "instructions": "Squat with barbell across shoulders."
      }
    ],
    "Quads": [
      {
        "name": "Quad Stretch",
        "muscle": "quadriceps",
        "difficulty": "beginner",
        "type": "stretching",
        "instructions": "Pull heel to glutes while standing."
      },
      {
        "name": "Step-ups",
        "muscle": "quadriceps",
        "difficulty": "beginner",
        "type": "cardio",
        "instructions": "Step up and down on elevated surface."
      },
      {
        "name": "Leg Extensions",
        "muscle": "quadriceps",
        "difficulty": "intermediate",
        "type": "strength",
        "instructions": "Extend legs from seated position."
      },
      {
        "name": "Jump Squats",
        "muscle": "quadriceps",
        "difficulty": "intermediate",
        "type": "plyometrics",
        "instructions": "Squat and jump explosively upward."
      },
      {
        "name": "Front Squats",
        "muscle": "quadriceps",
        "difficulty": "advanced",
        "type": "olympic_weightlifting",
        "instructions": "Squat with barbell held at chest level."
      },
      {
        "name": "Sissy Squats",
        "muscle": "quadriceps",
        "difficulty": "advanced",
        "type": "strength",
        "instructions": "Lean back while squatting, knees forward."
      }
    ],
    "Hamstrings": [
      {
        "name": "Hamstring Stretch",
        "muscle": "hamstrings",
        "difficulty": "beginner",
        "type": "stretching",
        "instructions": "Reach for toes while seated or standing."
      },
      {
        "name": "Glute Bridges",
        "muscle": "hamstrings",
        "difficulty": "beginner",
        "type": "strength",
        "instructions": "Lift hips while lying on back."
      },
      {
        "name": "Romanian Deadlifts",
        "muscle": "hamstrings",
        "difficulty": "intermediate",
        "type": "strength",
        "instructions": "Hinge at hips with slight knee bend."
      },
      {
        "name": "Walking Lunges",
        "muscle": "hamstrings",
        "difficulty": "intermediate",
        "type": "cardio",
        "instructions": "Alternate lunges while walking forward."
      },
      {
        "name": "Nordic Curls",
        "muscle": "hamstrings",
        "difficulty": "advanced",
        "type": "strength",
        "instructions": "Lower body forward from kneeling position."
      },
      {
        "name": "Stiff Leg Deadlifts",
        "muscle": "hamstrings",
        "difficulty": "advanced",
        "type": "powerlifting",
        "instructions": "Deadlift with minimal knee bend."
      }
    ],
    "Glutes": [
      {
        "name": "Glute Squeezes",
        "muscle": "glutes",
        "difficulty": "beginner",
        "type": "isometric",
        "instructions": "Contract glutes while lying or standing."
      },
      {
        "name": "Clamshells",
        "muscle": "glutes",
        "difficulty": "beginner",
        "type": "strength",
        "instructions": "Open and close legs while lying on side."
      },
      {
        "name": "Hip Thrusts",
        "muscle": "glutes",
        "difficulty": "intermediate",
        "type": "strength",
        "instructions": "Thrust hips upward with shoulders on bench."
      },
      {
        "name": "Single-Leg Glute Bridges",
        "muscle": "glutes",
        "difficulty": "intermediate",
        "type": "strength",
        "instructions": "Glute bridge with one leg extended."
      },
      {
        "name": "Weighted Hip Thrusts",
        "muscle": "glutes",
        "difficulty": "advanced",
        "type": "powerlifting",
        "instructions": "Hip thrusts with barbell across hips."
      },
      {
        "name": "Bulgarian Split Squats",
        "muscle": "glutes",
        "difficulty": "advanced",
        "type": "strength",
        "instructions": "Single leg squats with rear foot elevated."
      }
    ],
    "Calves": [
      {
        "name": "Calf Stretch",
        "muscle": "calves",
        "difficulty": "beginner",
        "type": "stretching",
        "instructions": "Push against wall with heel on ground."
      },
      {
        "name": "Calf Raises",
        "muscle": "calves",
        "difficulty": "beginner",
        "type": "strength",
        "instructions": "Rise up on toes and lower slowly."
      },
      {
        "name": "Single Calf Raises",
        "muscle": "calves",
        "difficulty": "intermediate",
        "type": "strength",
        "instructions": "Calf raises performed on one foot."
      },
      {
        "name": "Jump Rope",
        "muscle": "calves",
        "difficulty": "intermediate",
        "type": "cardio",
        "instructions": "Jump continuously over rotating rope."
      },
      {
        "name": "Weighted Calf Raises",
        "muscle": "calves",
        "difficulty": "advanced",
        "type": "strength",
        "instructions": "Calf raises with added weight."
      },
      {
        "name": "Donkey Calf Raises",
        "muscle": "calves",
        "difficulty": "advanced",
        "type": "strength",
        "instructions": "Calf raises in bent-over position."
      }
    ],
    "Core": [
      {
        "name": "Plank",
        "muscle": "abdominals",
        "difficulty": "beginner",
        "type": "isometric",
        "instructions": "Hold plank position keeping body straight."
      },
      {
        "name": "Dead Bug",
        "muscle": "abdominals",
        "difficulty": "beginner",
        "type": "stability",
        "instructions": "Lie on back, move opposite limbs simultaneously."
      },
      {
        "name": "Russian Twists",
        "muscle": "abdominals",
        "difficulty": "intermediate",
        "type": "strength",
        "instructions": "Twist torso side to side while seated."
      },
      {
        "name": "Leg Raises",
        "muscle": "abdominals",
        "difficulty": "intermediate",
        "type": "strength",
        "instructions": "Lift legs while lying flat."
      },
      {
        "name": "Dragon Flags",
        "muscle": "abdominals",
        "difficulty": "advanced",
        "type": "strength",
        "instructions": "Lower and raise body while hanging on a bench."
      },
      {
        "name": "Hanging Leg Raises",
        "muscle": "abdominals",
        "difficulty": "advanced",
        "type": "strength",
        "instructions": "Raise legs while hanging from bar."
      }
    ],
    "Abs": [
      {
        "name": "Crunches",
        "muscle": "abdominals",
        "difficulty": "beginner",
        "type": "strength",
        "instructions": "Lift shoulders toward knees while lying down."
      },
      {
        "name": "Modified Plank",
        "muscle": "abdominals",
        "difficulty": "beginner",
        "type": "isometric",
        "instructions": "Hold plank position on knees."
      },
      {
        "name": "Bicycle Crunches",
        "muscle": "abdominals",
        "difficulty": "intermediate",
        "type": "cardio",
        "instructions": "Alternate knee to elbow while cycling motion."
      },
      {
        "name": "Mountain Climbers",
        "muscle": "abdominals",
        "difficulty": "intermediate",
        "type": "cardio",
        "instructions": "Alternate bringing knees to chest in plank."
      },
      {
        "name": "V-Ups",
        "muscle": "abdominals",
        "difficulty": "advanced",
        "type": "strength",
        "instructions": "Simultaneously lift torso and legs forming V."
      },
      {
        "name": "Ab Wheel Rollouts",
        "muscle": "abdominals",
        "difficulty": "advanced",
        "type": "strength",
        "instructions": "Roll ab wheel forward and back."
      }
    ],
    "Forearms": [
      {
        "name": "Wrist Circles",
        "muscle": "forearms",
        "difficulty": "beginner",
        "type": "stretching",
        "instructions": "Rotate wrists in circular motions."
      },
      {
        "name": "Finger Extensions",
        "muscle": "forearms",
        "difficulty": "beginner",
        "type": "strength",
        "instructions": "Open and close fingers against resistance."
      },
      {
        "name": "Wrist Curls",
        "muscle": "forearms",
        "difficulty": "intermediate",
        "type": "strength",
        "instructions": "Curl wrists up and down with weights."
      },
      {
        "name": "Farmer's Walk",
        "muscle": "forearms",
        "difficulty": "intermediate",
        "type": "strongman",
        "instructions": "Walk while carrying heavy weights in each hand."
      },
      {
        "name": "Plate Pinches",
        "muscle": "forearms",
        "difficulty": "advanced",
        "type": "strength",
        "instructions": "Pinch weight plates together and hold."
      },
      {
        "name": "Dead Hangs",
        "muscle": "forearms",
        "difficulty": "advanced",
        "type": "isometric",
        "instructions": "Hang from bar for time."
      }
    ]
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

  const fetchExercises = useCallback(async () => {
    if (!fitnessGoal || fitnessGoal === 'General Fitness') {
      if (!params?.fitnessGoal && (!targetBodyParts || targetBodyParts.length === 0)) {
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
      const exerciseType = mapGoalToType(fitnessGoal);
      let allExercises = [];

      if (targetBodyParts.length > 0) {
        for (const bodyPart of targetBodyParts) {
          const muscle = mapBodyPartToMuscle(bodyPart);
          const url = `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}&type=${exerciseType}&difficulty=${apiDifficulty}`;
          
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
          
          const exercisesWithBodyPart = filteredData.slice(0, 3).map(exercise => ({
            ...exercise,
            targetBodyPart: bodyPart
          }));
          
          allExercises = [...allExercises, ...exercisesWithBodyPart];
        }
      } else {
        const url = `https://api.api-ninjas.com/v1/exercises?type=${exerciseType}&difficulty=${apiDifficulty}`;
        
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
      
      if (isMountedRef.current) {
        setExercises(allExercises);
        
        if (allExercises.length === 0) {
          setError(`No ${apiDifficulty} level exercises found for your selected criteria. Try adjusting your selections.`);
          const mockExercises = generateMockExercises(targetBodyParts, fitnessGoal, apiDifficulty);
          setExercises(mockExercises);
        }
      }
      
    } catch (err) {
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchExercises();
    setRefreshing(false);
  }, [fetchExercises]);

  useFocusEffect(
    useCallback(() => {
      if (isMountedRef.current && params && (params.fitnessGoal || params.targetBodyParts?.length > 0 || params.difficultyLevel)) {
        fetchExercises();
      }
    }, [fetchExercises, params])
  );

  const resetWorkoutState = useCallback(() => {
    setWorkoutStarted(false);
    setCurrentExerciseIndex(0);
    setWorkoutTimer(0);
    setCompletedExercises([]);
    setIsTimerRunning(false);
    setShowExerciseModal(false);
    workoutStartTimeRef.current = null;
  }, []);

  // FIXED: Save workout to AsyncStorage and navigate to Home
  const saveWorkoutToStorage = async (workoutData) => {
    try {
      console.log('💾 Saving workout to storage:', workoutData);
      
      // Get existing workout history
      const existingHistory = await AsyncStorage.getItem(WORKOUT_HISTORY_KEY);
      let workoutHistory = existingHistory ? JSON.parse(existingHistory) : [];
      
      // Check for duplicates (prevent saving the same workout multiple times)
      const isDuplicate = workoutHistory.some(workout => workout.id === workoutData.id);
      
      if (!isDuplicate) {
        // Add new workout to the beginning of the array
        workoutHistory = [workoutData, ...workoutHistory].slice(0, 50); // Keep only last 50 workouts
        
        // Save back to storage
        await AsyncStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify(workoutHistory));
        
        console.log('✅ Workout saved successfully. Total workouts:', workoutHistory.length);
        
        return true;
      } else {
        console.log('⚠️ Duplicate workout detected, not saving');
        return false;
      }
    } catch (error) {
      console.error('❌ Error saving workout to storage:', error);
      return false;
    }
  };

  const saveAndNavigateHome = useCallback(async (workoutData) => {
    console.log('🔄 Starting save and navigate process:', workoutData);
    
    try {
      // Save workout to storage first
      const saved = await saveWorkoutToStorage(workoutData);
      
      if (saved) {
        // Reset workout state
        resetWorkoutState();
        
        // Simple navigation back to Home - let HomePageScreen handle the refresh
        navigation.navigate('Home', { 
          workoutCompleted: true,
          refreshTrigger: Date.now() // Use timestamp to ensure params change
        });
        
        console.log('✅ Navigation completed successfully');
      } else {
        // Even if save failed, still navigate back
        resetWorkoutState();
        navigation.navigate('Home');
      }
      
    } catch (error) {
      console.error('❌ Error in saveAndNavigateHome:', error);
      // Fallback - still navigate back even if save failed
      resetWorkoutState();
      navigation.navigate('Home');
    }
  }, [navigation, resetWorkoutState]);

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
            setWorkoutStarted(true);
            setCurrentExerciseIndex(0);
            setWorkoutTimer(0);
            setCompletedExercises([]);
            workoutStartTimeRef.current = new Date();
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

  const handleWorkoutComplete = useCallback((finalCompletedExercises = completedExercises) => {
    const endTime = new Date();
    const actualCompletedCount = finalCompletedExercises ? 
      finalCompletedExercises.length : 
      completedExercises.length + 1;
    
    const actualCompletedExercises = finalCompletedExercises || 
      [...completedExercises, exercises[currentExerciseIndex]];
      
    const workoutData = {
      id: `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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

    console.log('🎉 Workout completed:', workoutData);

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
  }, [fitnessGoal, targetBodyParts, difficultyLevel, workoutTimer, exercises, completedExercises, currentExerciseIndex, saveAndNavigateHome]);

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
  }, [saveAndNavigateHome]);

  const handleIndividualExercise = useCallback((exercise, index) => {
    setCurrentExerciseIndex(index);
    setShowExerciseModal(true);
  }, []);

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

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchExercises}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

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