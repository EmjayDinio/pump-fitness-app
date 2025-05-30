import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { insertProgress } from '../../services/database/database';
import { getCurrentUser } from '../../services/firebase/authService';

export default function ProgressTracker({ exercise, onProgressSaved }) {
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');

  const saveProgress = async () => {
    const user = getCurrentUser();
    if (!user) {
      Alert.alert('Error', 'Please login to track progress');
      return;
    }

    try {
      await insertProgress(
        user.uid,
        exercise.id,
        parseInt(sets) || 0,
        parseInt(reps) || 0,
        parseFloat(weight) || 0,
        parseInt(duration) || 0
      );
      
      Alert.alert('Success', 'Progress saved!');
      onProgressSaved && onProgressSaved();
      
      // Reset fields
      setSets('');
      setReps('');
      setWeight('');
      setDuration('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save progress');
      console.error('Error saving progress:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Your Progress</Text>
      
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Sets</Text>
          <TextInput
            style={styles.input}
            value={sets}
            onChangeText={setSets}
            placeholder="0"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Reps</Text>
          <TextInput
            style={styles.input}
            value={reps}
            onChangeText={setReps}
            placeholder="0"
            keyboardType="numeric"
          />
        </View>
      </View>
      
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Weight (lbs)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="0"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Duration (sec)</Text>
          <TextInput
            style={styles.input}
            value={duration}
            onChangeText={setDuration}
            placeholder="0"
            keyboardType="numeric"
          />
        </View>
      </View>
      
      <TouchableOpacity style={styles.saveButton} onPress={saveProgress}>
        <Text style={styles.saveButtonText}>Save Progress</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});