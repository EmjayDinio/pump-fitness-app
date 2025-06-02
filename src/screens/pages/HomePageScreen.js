import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './HomePageScreen.styles'; // Import styles

const HomePageScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome to Your Fitness Journey</Text>
          <Text style={styles.headerSubtitle}>Ready to crush your goals today?</Text>
        </View>

        <TouchableOpacity style={styles.mainButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.mainButtonText}>🎯 Create Custom Workout</Text>
          <Text style={styles.mainButtonSubtext}>Set goals, select muscles & difficulty</Text>
        </TouchableOpacity>

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

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Workouts This Week</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Goals Completed</Text>
          </View>
        </View>
      </ScrollView>

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
const videoStyles = {
  // Video section in exercise card
  videoSection: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B6B',
  },
  videoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  videoButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  videoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Exercise button container (for side-by-side buttons)
  exerciseButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    gap: 10,
  },
  startButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  videoQuickButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 50,
  },
  videoQuickButtonText: {
    fontSize: 18,
  },
  
  // Video Modal Styles
  videoModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  videoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
    paddingTop: 50, // Account for status bar
  },
  videoModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  
  // Video container
  videoContainer: {
    height: 220,
    backgroundColor: '#000',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  webView: {
    flex: 1,
  },
  
  // Video info section
  videoInfo: {
    padding: 16,
    flex: 1,
  },
  videoInstructions: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
  },
  videoDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  videoDetailText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
};


export default HomePageScreen;
