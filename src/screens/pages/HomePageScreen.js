import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  FlatList,
} from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './HomePageScreen.styles';
import { Dimensions, Platform } from 'react-native';

const HomePageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  
  // Workout tracking state
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState({
    thisWeek: 0,
    totalWorkouts: 0,
    totalTime: 0,
    avgCompletion: 0,
  });
  const [weeklyProgress, setWeeklyProgress] = useState(Array(7).fill(false));

  const fitnessGoals = [
    { label: 'Cardio', apiType: 'cardio' },
    { label: 'Muscle Gain', apiType: 'strength' },
    { label: 'Strength Building', apiType: 'powerlifting' },
    { label: 'Flexibility', apiType: 'stretching' },
    { label: 'Olympic Training', apiType: 'olympic_weightlifting' },
    { label: 'Power Training', apiType: 'plyometrics' },
    { label: 'Strongman', apiType: 'strongman' }
  ];

  const bodyParts = [
    { label: 'Chest', apiMuscle: 'chest' },
    { label: 'Back', apiMuscle: 'lats' },
    { label: 'Shoulders', apiMuscle: 'shoulders' },
    { label: 'Biceps', apiMuscle: 'biceps' },
    { label: 'Triceps', apiMuscle: 'triceps' },
    { label: 'Legs', apiMuscle: 'quadriceps' },
    { label: 'Glutes', apiMuscle: 'glutes' },
    { label: 'Core', apiMuscle: 'abdominals' },
    { label: 'Calves', apiMuscle: 'calves' },
    { label: 'Forearms', apiMuscle: 'forearms' }
  ];

  const difficultyLevels = [
    { label: 'Beginner', apiDifficulty: 'beginner' },
    { label: 'Intermediate', apiDifficulty: 'intermediate' },
    { label: 'Expert', apiDifficulty: 'expert' }
  ];

  // Storage keys
  const WORKOUT_HISTORY_KEY = '@workout_history';

  // Utility functions
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDayOfWeek = (dateString) => {
    return new Date(dateString).getDay(); // 0 = Sunday, 1 = Monday, etc.
  };

  const isThisWeek = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return date >= startOfWeek && date <= endOfWeek;
  };

  // Load workout history from storage
  const loadWorkoutHistory = useCallback(async () => {
    try {
      console.log('📚 Loading workout history from storage...');
      const storedHistory = await AsyncStorage.getItem(WORKOUT_HISTORY_KEY);
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        console.log('✅ Loaded workout history:', parsedHistory.length, 'workouts');
        setWorkoutHistory(parsedHistory);
        return parsedHistory;
      } else {
        console.log('📭 No workout history found in storage');
        setWorkoutHistory([]);
        return [];
      }
    } catch (error) {
      console.error('❌ Error loading workout history:', error);
      setWorkoutHistory([]);
      return [];
    }
  }, []);

  // Save workout history to storage
  const saveWorkoutHistory = useCallback(async (history) => {
    try {
      await AsyncStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify(history));
      console.log('💾 Saved workout history:', history.length, 'workouts');
    } catch (error) {
      console.error('❌ Error saving workout history:', error);
    }
  }, []);

  // Calculate and update workout stats
  const updateWorkoutStats = useCallback((history) => {
    console.log('📊 Updating workout stats with', history.length, 'workouts');
    
    const thisWeekWorkouts = history.filter(workout => isThisWeek(workout.date));
    const totalTime = history.reduce((sum, workout) => sum + (workout.duration || 0), 0);
    const avgCompletion = history.length > 0 
      ? history.reduce((sum, workout) => sum + (workout.completionRate || 0), 0) / history.length
      : 0;

    // Update weekly progress grid
    const newWeeklyProgress = Array(7).fill(false);
    thisWeekWorkouts.forEach(workout => {
      const dayIndex = getDayOfWeek(workout.date);
      newWeeklyProgress[dayIndex] = true;
    });

    const newStats = {
      thisWeek: thisWeekWorkouts.length,
      totalWorkouts: history.length,
      totalTime: totalTime,
      avgCompletion: Math.round(avgCompletion),
    };

    console.log('📈 Updated stats:', newStats);
    
    setWeeklyStats(newStats);
    setWeeklyProgress(newWeeklyProgress);
  }, []);

  // Force refresh all data from storage
  const refreshAllData = useCallback(async () => {
    console.log('🔄 Force refreshing all data...');
    try {
      const freshHistory = await loadWorkoutHistory();
      updateWorkoutStats(freshHistory);
      console.log('✅ Data refresh completed');
    } catch (error) {
      console.error('❌ Error during data refresh:', error);
    }
  }, [loadWorkoutHistory, updateWorkoutStats]);

  // Handle screen focus and route params
  useFocusEffect(
    useCallback(() => {
      console.log('👁️ HomePageScreen focused with params:', route.params);
      
      // Check if we need to refresh due to workout completion
      const shouldRefresh = route.params?.workoutCompleted || route.params?.refreshTrigger;
      
      if (shouldRefresh) {
        console.log('🔄 Workout completed detected, refreshing data...');
        
        // Add a small delay to ensure WorkoutScreen has finished saving
        setTimeout(() => {
          refreshAllData();
        }, 100);
        
        // Clear the params to prevent unnecessary refreshes
        navigation.setParams({ 
          workoutCompleted: undefined,
          refreshTrigger: undefined
        });
      } else {
        // Normal focus, just load data
        console.log('👁️ Normal focus, loading data...');
        refreshAllData();
      }
    }, [route.params?.workoutCompleted, route.params?.refreshTrigger, refreshAllData, navigation])
  );

  // Initial load on component mount
  useEffect(() => {
    console.log('🏠 HomePageScreen mounted, initial data load...');
    refreshAllData();
  }, [refreshAllData]);

  const handleBodyPartToggle = (bodyPart) => {
    setSelectedBodyParts(prev =>
      prev.includes(bodyPart)
        ? prev.filter(part => part !== bodyPart)
        : [...prev, bodyPart]
    );
  };

  const handleStartWorkout = () => {
    if (!selectedGoal || !selectedDifficulty || selectedBodyParts.length === 0) {
      Alert.alert('Missing Selection', 'Please complete all selections');
      return;
    }

    const goalMapping = fitnessGoals.find(g => g.label === selectedGoal);
    const bodyPartMappings = selectedBodyParts.map(part =>
      bodyParts.find(bp => bp.label === part)
    );
    const difficultyMapping = difficultyLevels.find(d => d.label === selectedDifficulty);

    setModalVisible(false);

    navigation.navigate('Workouts', {
      fitnessGoal: selectedGoal,
      targetBodyParts: selectedBodyParts,
      difficultyLevel: selectedDifficulty,
      apiParams: {
        type: goalMapping?.apiType,
        muscles: bodyPartMappings.map(bp => bp?.apiMuscle).filter(Boolean),
        difficulty: difficultyMapping?.apiDifficulty
      }
    });
  };

  const resetSelections = () => {
    setSelectedGoal('');
    setSelectedBodyParts([]);
    setSelectedDifficulty('');
  };

  const clearWorkoutHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all workout history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            try {
              setWorkoutHistory([]);
              await AsyncStorage.removeItem(WORKOUT_HISTORY_KEY);
              updateWorkoutStats([]);
              console.log('🗑️ Workout history cleared');
            } catch (error) {
              console.error('❌ Error clearing workout history:', error);
            }
          }
        }
      ]
    );
  };

  const renderWorkoutHistoryItem = ({ item, index }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyGoal}>{item.goal}</Text>
        <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
      </View>
      
      <View style={styles.historyDetails}>
        <View style={styles.historyDetailRow}>
          <Text style={styles.historyLabel}>Duration:</Text>
          <Text style={styles.historyValue}>{formatTime(item.duration || 0)}</Text>
        </View>
        
        <View style={styles.historyDetailRow}>
          <Text style={styles.historyLabel}>Exercises:</Text>
          <Text style={styles.historyValue}>
            {item.completedExercises || 0}/{item.totalExercises || 0}
          </Text>
        </View>
        
        <View style={styles.historyDetailRow}>
          <Text style={styles.historyLabel}>Completion:</Text>
          <Text style={[
            styles.historyValue,
            { color: (item.completionRate || 0) >= 80 ? '#28a745' : (item.completionRate || 0) >= 60 ? '#ffc107' : '#dc3545' }
          ]}>
            {item.completionRate || 0}%
          </Text>
        </View>
      </View>

      {item.bodyParts && item.bodyParts.length > 0 && (
        <View style={styles.historyBodyParts}>
          {item.bodyParts.map((part, idx) => (
            <View key={idx} style={styles.historyBodyPartChip}>
              <Text style={styles.historyBodyPartText}>{part}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome to Your Fitness Journey</Text>
          <Text style={styles.headerSubtitle}>Ready to crush your goals today?</Text>
        </View>

        {/* Progress Tracker Section */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>📊 Your Progress</Text>
          
          {/* Weekly Stats */}
<View style={styles.statsContainer}>
  <View style={styles.statCard}>
    <Text style={styles.statNumber}>{weeklyStats.thisWeek}</Text>
    <Text style={styles.statLabel}>This Week</Text>
  </View>
  <View style={styles.statCard}>
    <Text style={styles.statNumber}>{weeklyStats.totalWorkouts}</Text>
    <Text style={styles.statLabel}>Total Workouts</Text>
  </View>
  <View style={styles.statCard}>
    <Text style={styles.statNumber}>{formatTime(weeklyStats.totalTime)}</Text>
    <Text style={styles.statLabel}>Total Time</Text>
  </View>
  <View style={styles.statCard}>
    <Text style={styles.statNumber}>{weeklyStats.avgCompletion}%</Text>
    <Text style={styles.statLabel}>Avg Completion</Text>
  </View>
</View>

          {/* Weekly Progress Grid */}
          <View style={styles.weeklyTrackerContainer}>
            <Text style={styles.weeklyTrackerTitle}>This Week's Activity</Text>
            <View style={styles.weeklyRow}>
              {dayLabels.map((day, index) => (
                <View key={index} style={styles.dayContainer}>
                  <View style={[
                    styles.dayButton,
                    weeklyProgress[index] && styles.dayButtonActive
                  ]}>
                    <Text style={[
                      styles.dayText,
                      weeklyProgress[index] && styles.dayTextActive
                    ]}>
                      {day}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Create Workout Button */}
        <TouchableOpacity style={styles.mainButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.mainButtonText}>🎯 Create Custom Workout</Text>
          <Text style={styles.mainButtonSubtext}>Set goals, select muscles & difficulty</Text>
        </TouchableOpacity>

        {/* Current Selections Preview */}
        {(selectedGoal || selectedBodyParts.length > 0 || selectedDifficulty) && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Current Selections:</Text>
            {selectedGoal && <Text style={styles.previewText}>Goal: {selectedGoal}</Text>}
            {selectedDifficulty && <Text style={styles.previewText}>Level: {selectedDifficulty}</Text>}
            {selectedBodyParts.length > 0 && (
              <Text style={styles.previewText}>
                Focus: {selectedBodyParts.join(', ')}
              </Text>
            )}
          </View>
        )}

        {/* Workout History Section */}
        {workoutHistory.length > 0 && (
          <View style={styles.historySection}>
            <View style={styles.historySectionHeader}>
              <Text style={styles.sectionTitle}>📈 Workout History</Text>
              <TouchableOpacity onPress={clearWorkoutHistory} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={workoutHistory.slice(0, 10)} // Show only recent 10
              renderItem={renderWorkoutHistoryItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
            
            {workoutHistory.length > 10 && (
              <Text style={styles.moreHistoryText}>
                Showing 10 most recent workouts of {workoutHistory.length} total
              </Text>
            )}
          </View>
        )}

        {/* Motivational Message for No History */}
        {workoutHistory.length === 0 && (
          <View style={styles.motivationCard}>
            <Text style={styles.motivationText}>
              "Your fitness journey starts with a single workout. Let's make it happen! 💪"
            </Text>
          </View>
        )}
        
      </ScrollView>

      {/* Workout Creation Modal */}
      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Create Your Workout</Text>

              <Text style={styles.sectionTitle}>Choose Your Primary Goal:</Text>
              <View style={styles.optionsContainer}>
                {fitnessGoals.map(goal => (
                  <TouchableOpacity
                    key={goal.label}
                    style={[
                      styles.optionButton,
                      selectedGoal === goal.label && styles.selectedOption
                    ]}
                    onPress={() => setSelectedGoal(goal.label)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedGoal === goal.label && styles.selectedOptionText
                      ]}
                    >
                      {goal.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Select Difficulty Level:</Text>
              <View style={styles.optionsContainer}>
                {difficultyLevels.map(level => (
                  <TouchableOpacity
                    key={level.label}
                    style={[
                      styles.optionButton,
                      selectedDifficulty === level.label && styles.selectedOption
                    ]}
                    onPress={() => setSelectedDifficulty(level.label)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedDifficulty === level.label && styles.selectedOptionText
                      ]}
                    >
                      {level.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Select Target Muscles:</Text>
              <Text style={styles.sectionSubtitle}>Choose one or more muscle groups</Text>
              <View style={styles.optionsContainer}>
                {bodyParts.map(bodyPart => (
                  <TouchableOpacity
                    key={bodyPart.label}
                    style={[
                      styles.optionButton,
                      selectedBodyParts.includes(bodyPart.label) && styles.selectedOption
                    ]}
                    onPress={() => handleBodyPartToggle(bodyPart.label)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedBodyParts.includes(bodyPart.label) && styles.selectedOptionText
                      ]}
                    >
                      {bodyPart.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity style={styles.resetButton} onPress={resetSelections}>
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
                  <Text style={styles.startButtonText}>Create Workout</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomePageScreen;