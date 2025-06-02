import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

const workoutPlans = [
  {
    id: 1,
    name: 'Upper Body Strength',
    duration: '45 min',
    difficulty: 'Intermediate',
    description: 'Focus on building upper body strength with compound movements',
    exercises: ['Push-ups', 'Pull-ups', 'Bench Press', 'Rows'],
  },
  {
    id: 2,
    name: 'Lower Body Power',
    duration: '50 min',
    difficulty: 'Advanced',
    description: 'Explosive lower body exercises for power and strength',
    exercises: ['Squats', 'Deadlifts', 'Lunges', 'Box Jumps'],
  },
  {
    id: 3,
    name: 'Full Body HIIT',
    duration: '30 min',
    difficulty: 'Intermediate',
    description: 'High-intensity interval training for full body conditioning',
    exercises: ['Burpees', 'Mountain Climbers', 'Jump Squats', 'Plank'],
  },
  {
    id: 4,
    name: 'Core & Abs',
    duration: '25 min',
    difficulty: 'Beginner',
    description: 'Targeted core strengthening and abdominal exercises',
    exercises: ['Crunches', 'Russian Twists', 'Dead Bug', 'Bicycle Crunches'],
  },
  {
    id: 5,
    name: 'Cardio Blast',
    duration: '35 min',
    difficulty: 'Intermediate',
    description: 'High-energy cardio workout to boost endurance',
    exercises: ['Jump Rope', 'High Knees', 'Jumping Jacks', 'Sprint Intervals'],
  },
  {
    id: 6,
    name: 'Flexibility & Mobility',
    duration: '40 min',
    difficulty: 'Beginner',
    description: 'Improve flexibility and joint mobility with stretching',
    exercises: ['Dynamic Stretches', 'Yoga Poses', 'Foam Rolling', 'Joint Circles'],
  },
];

export default function WorkoutSelection({ navigation, route }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { onSelectWorkout } = route.params || {};

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return '#4CAF50';
      case 'Intermediate':
        return '#FF9800';
      case 'Advanced':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan.id);
    // Call the callback function to update the home screen
    if (onSelectWorkout) {
      onSelectWorkout(plan.name);
    }
    // Navigate back to home screen
    setTimeout(() => {
      navigation.goBack();
    }, 300);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Choose Workout Plan</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {workoutPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.selectedCard
            ]}
            onPress={() => handleSelectPlan(plan)}
            activeOpacity={0.8}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <View style={styles.planMeta}>
                <Text style={styles.duration}>{plan.duration}</Text>
                <View 
                  style={[
                    styles.difficultyBadge, 
                    { backgroundColor: getDifficultyColor(plan.difficulty) }
                  ]}
                >
                  <Text style={styles.difficultyText}>{plan.difficulty}</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.description}>{plan.description}</Text>
            
            <View style={styles.exerciseContainer}>
              <Text style={styles.exerciseLabel}>Key Exercises:</Text>
              <View style={styles.exerciseList}>
                {plan.exercises.map((exercise, index) => (
                  <View key={index} style={styles.exerciseTag}>
                    <Text style={styles.exerciseText}>{exercise}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  placeholder: {
    width: 60,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  planHeader: {
    marginBottom: 12,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  planMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  duration: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 16,
  },
  exerciseContainer: {
    marginTop: 8,
  },
  exerciseLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  exerciseList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  exerciseTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  exerciseText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});