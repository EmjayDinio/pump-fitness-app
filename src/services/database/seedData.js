import { insertWorkout, insertExercise } from './database';

export const seedDatabase = async () => {
  try {
    // Seed chest workouts
    const chestWorkoutId = await insertWorkout(
      'Chest Blast',
      'chest',
      'Complete chest workout for building strength and size',
      'https://example.com/chest-workout.jpg'
    );

    await insertExercise(
      chestWorkoutId,
      'Push-ups',
      'Classic bodyweight exercise for chest development',
      3,
      15,
      null,
      'https://example.com/pushups.jpg',
      'https://example.com/pushups.gif'
    );

    await insertExercise(
      chestWorkoutId,
      'Chest Press',
      'Dumbbell chest press for upper body strength',
      3,
      12,
      null,
      'https://example.com/chest-press.jpg',
      'https://example.com/chest-press.gif'
    );

    // Seed leg workouts
    const legWorkoutId = await insertWorkout(
      'Leg Power',
      'legs',
      'Lower body strength and endurance workout',
      'https://example.com/leg-workout.jpg'
    );

    await insertExercise(
      legWorkoutId,
      'Squats',
      'Fundamental lower body exercise',
      3,
      20,
      null,
      'https://example.com/squats.jpg',
      'https://example.com/squats.gif'
    );

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};