import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const ExerciseModal = ({ 
  visible, 
  exercise, 
  currentIndex, 
  totalExercises, 
  workoutTimer, 
  workoutStarted,
  onClose,
  onSkip,
  onComplete,
  onFinishWorkout,
  formatTime,
  getDifficultyColor,
  styles 
}) => {
  if (!exercise) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>⏱️ {formatTime(workoutTimer)}</Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.exerciseCounter}>
            <Text style={styles.counterText}>
              Exercise {currentIndex + 1} of {totalExercises}
            </Text>
          </View>

          <Text style={styles.modalExerciseName}>{exercise.name}</Text>
          
          <View style={styles.modalExerciseInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Target Muscle</Text>
              <Text style={styles.infoValue}>
                {exercise.muscle || exercise.targetBodyPart}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Difficulty</Text>
              <View style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(exercise.difficulty) }
              ]}>
                <Text style={styles.difficultyText}>
                  {exercise.difficulty || 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Type</Text>
              <Text style={styles.infoValue}>{exercise.type}</Text>
            </View>
          </View>

          <View style={styles.instructionsSection}>
            <Text style={styles.instructionsTitle}>Instructions</Text>
            <Text style={styles.modalInstructions}>
              {exercise.instructions || 'No instructions available for this exercise.'}
            </Text>
          </View>

          {workoutStarted && (
            <>
              <View style={styles.workoutControls}>
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={onSkip}
                >
                  <Text style={styles.skipButtonText}>Skip</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={onComplete}
                >
                  <Text style={styles.completeButtonText}>
                    {currentIndex === totalExercises - 1 ? 'Complete Workout' : 'Mark Complete & Next'}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.finishWorkoutButton}
                onPress={onFinishWorkout}
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

export default ExerciseModal;