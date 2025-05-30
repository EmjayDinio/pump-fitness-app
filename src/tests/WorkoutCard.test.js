import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WorkoutCard from '../components/workout/WorkoutCard';

const mockWorkout = {
  id: 1,
  name: 'Test Workout',
  body_part: 'chest',
  description: 'Test description',
  image_url: 'https://test.com/image.jpg',
};

describe('WorkoutCard', () => {
  it('renders workout information correctly', () => {
    const { getByText } = render(
      <WorkoutCard workout={mockWorkout} onPress={() => {}} />
    );
    
    expect(getByText('Test Workout')).toBeTruthy();
    expect(getByText('CHEST')).toBeTruthy();
    expect(getByText('Test description')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <WorkoutCard workout={mockWorkout} onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Test Workout'));
    expect(mockOnPress).toHaveBeenCalledWith(mockWorkout);
  });
});