import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomePageScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  // Fitness goals mapped to API types
  const fitnessGoals = [
    { label: 'Cardio', apiType: 'cardio' },
    { label: 'Muscle Gain', apiType: 'strength' },
    { label: 'Strength Building', apiType: 'powerlifting' },
    { label: 'Flexibility', apiType: 'stretching' },
    { label: 'Olympic Training', apiType: 'olympic_weightlifting' },
    { label: 'Power Training', apiType: 'plyometrics' },
    { label: 'Strongman', apiType: 'strongman' }
  ];

  // Body parts mapped to API muscle groups
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

  // Difficulty levels
  const difficultyLevels = [
    { label: 'Beginner', apiDifficulty: 'beginner' },
    { label: 'Intermediate', apiDifficulty: 'intermediate' },
    { label: 'Expert', apiDifficulty: 'expert' }
  ];

  const handleBodyPartToggle = (bodyPart) => {
    setSelectedBodyParts(prev => {
      if (prev.includes(bodyPart)) {
        return prev.filter(part => part !== bodyPart);
      } else {
        return [...prev, bodyPart];
      }
    });
  };

  const handleStartWorkout = () => {
    if (!selectedGoal) {
      Alert.alert('Missing Selection', 'Please select a fitness goal');
      return;
    }
    if (selectedBodyParts.length === 0) {
      Alert.alert('Missing Selection', 'Please select at least one body part to focus on');
      return;
    }
    if (!selectedDifficulty) {
      Alert.alert('Missing Selection', 'Please select a difficulty level');
      return;
    }

    setModalVisible(false);
    
    // Find the selected goal and body parts with their API mappings
    const goalMapping = fitnessGoals.find(g => g.label === selectedGoal);
    const bodyPartMappings = selectedBodyParts.map(part => 
      bodyParts.find(bp => bp.label === part)
    );
    const difficultyMapping = difficultyLevels.find(d => d.label === selectedDifficulty);

    // Navigate to WorkoutScreen with consistent parameter names
    navigation.navigate('Workouts', {
      fitnessGoal: selectedGoal,
      targetBodyParts: selectedBodyParts,
      difficultyLevel: selectedDifficulty, // Changed: Pass the label directly
      apiParams: {
        type: goalMapping?.apiType,
        muscles: bodyPartMappings.map(bp => bp?.apiMuscle).filter(Boolean),
        difficulty: difficultyMapping?.apiDifficulty // Keep API mapping for reference
      }
    });

    // Debug log to verify what's being passed
    console.log('Navigation params:', {
      fitnessGoal: selectedGoal,
      targetBodyParts: selectedBodyParts,
      difficultyLevel: selectedDifficulty,
      apiDifficulty: difficultyMapping?.apiDifficulty
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome to Your Fitness Journey</Text>
          <Text style={styles.headerSubtitle}>Ready to crush your goals today?</Text>
        </View>

        {/* Main Action Button */}
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.mainButtonText}>🎯 Create Custom Workout</Text>
          <Text style={styles.mainButtonSubtext}>Set goals, select muscles & difficulty</Text>
        </TouchableOpacity>

        {/* Current Selections Preview */}
        {(selectedGoal || selectedBodyParts.length > 0 || selectedDifficulty) && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Current Selections:</Text>
            {selectedGoal && (
              <Text style={styles.previewText}>Goal: {selectedGoal}</Text>
            )}
            {selectedDifficulty && (
              <Text style={styles.previewText}>Level: {selectedDifficulty}</Text>
            )}
            {selectedBodyParts.length > 0 && (
              <Text style={styles.previewText}>
                Focus: {selectedBodyParts.join(', ')}
              </Text>
            )}
          </View>
        )}

        {/* Quick Stats */}
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

      {/* Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Create Your Workout</Text>
              
              {/* Fitness Goals Section */}
              <Text style={styles.sectionTitle}>Choose Your Primary Goal:</Text>
              <View style={styles.optionsContainer}>
                {fitnessGoals.map((goal) => (
                  <TouchableOpacity
                    key={goal.label}
                    style={[
                      styles.optionButton,
                      selectedGoal === goal.label && styles.selectedOption
                    ]}
                    onPress={() => setSelectedGoal(goal.label)}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedGoal === goal.label && styles.selectedOptionText
                    ]}>
                      {goal.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Difficulty Section */}
              <Text style={styles.sectionTitle}>Select Difficulty Level:</Text>
              <View style={styles.optionsContainer}>
                {difficultyLevels.map((level) => (
                  <TouchableOpacity
                    key={level.label}
                    style={[
                      styles.optionButton,
                      selectedDifficulty === level.label && styles.selectedOption
                    ]}
                    onPress={() => setSelectedDifficulty(level.label)}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedDifficulty === level.label && styles.selectedOptionText
                    ]}>
                      {level.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Body Parts Section */}
              <Text style={styles.sectionTitle}>Select Target Muscles:</Text>
              <Text style={styles.sectionSubtitle}>Choose one or more muscle groups</Text>
              <View style={styles.optionsContainer}>
                {bodyParts.map((bodyPart) => (
                  <TouchableOpacity
                    key={bodyPart.label}
                    style={[
                      styles.optionButton,
                      selectedBodyParts.includes(bodyPart.label) && styles.selectedOption
                    ]}
                    onPress={() => handleBodyPartToggle(bodyPart.label)}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedBodyParts.includes(bodyPart.label) && styles.selectedOptionText
                    ]}>
                      {bodyPart.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Action Buttons */}
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={resetSelections}
                >
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={handleStartWorkout}
                >
                  <Text style={styles.startButtonText}>Create Workout</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  mainButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  mainButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  mainButtonSubtext: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  previewContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    marginTop: 15,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: 'white',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
    marginBottom: 15,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#dee2e6',
  },
  resetButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
  },
  startButton: {
    flex: 2,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#28a745',
  },
  startButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
});

export default HomePageScreen;