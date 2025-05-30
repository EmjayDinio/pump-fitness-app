// src/database/databaseSeeder.js
import { insertWorkout, insertExercise, getWorkoutsByBodyPart } from './database';

export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Check if data already exists
    const existingWorkouts = await getWorkoutsByBodyPart('Chest');
    if (existingWorkouts.length > 0) {
      console.log('Database already seeded');
      return;
    }

    // Seed Chest Workouts
    const chestWorkoutId = await insertWorkout(
      'Upper Body Strength',
      'Chest',
      'A comprehensive chest workout focusing on building strength and muscle mass.',
      null
    );

    await insertExercise(
      chestWorkoutId,
      'Push-ups',
      'Classic bodyweight exercise targeting chest, shoulders, and triceps. Keep your body in a straight line.',
      3,
      12,
      null,
      null,
      null
    );

    await insertExercise(
      chestWorkoutId,
      'Chest Press',
      'Lie on bench, grip bar slightly wider than shoulders, lower to chest, press up.',
      4,
      10,
      null,
      null,
      null
    );

    await insertExercise(
      chestWorkoutId,
      'Chest Flyes',
      'Lie on bench with dumbbells, lower weights in wide arc, squeeze chest to bring weights together.',
      3,
      12,
      null,
      null,
      null
    );

    // Seed Back Workouts
    const backWorkoutId = await insertWorkout(
      'Back Builder',
      'Back',
      'Strengthen your back muscles with these effective exercises.',
      null
    );

    await insertExercise(
      backWorkoutId,
      'Pull-ups',
      'Hang from bar, pull body up until chin over bar, lower with control.',
      3,
      8,
      null,
      null,
      null
    );

    await insertExercise(
      backWorkoutId,
      'Bent-Over Rows',
      'Hinge at hips, pull bar to lower chest, squeeze shoulder blades together.',
      4,
      10,
      null,
      null,
      null
    );

    await insertExercise(
      backWorkoutId,
      'Lat Pulldowns',
      'Pull bar down to chest, focus on using back muscles, control the weight.',
      3,
      12,
      null,
      null,
      null
    );

    // Seed Legs Workouts
    const legsWorkoutId = await insertWorkout(
      'Leg Power',
      'Legs',
      'Build strong legs with these compound and isolation exercises.',
      null
    );

    await insertExercise(
      legsWorkoutId,
      'Squats',
      'Stand with feet shoulder-width apart, lower hips back and down, return to standing.',
      4,
      12,
      null,
      null,
      null
    );

    await insertExercise(
      legsWorkoutId,
      'Lunges',
      'Step forward into lunge position, lower back knee toward ground, return to start.',
      3,
      10,
      null,
      null,
      null
    );

    await insertExercise(
      legsWorkoutId,
      'Leg Press',
      'Sit in leg press machine, lower weight by bending knees, press through heels.',
      3,
      15,
      null,
      null,
      null
    );

    // Seed Shoulders Workouts
    const shouldersWorkoutId = await insertWorkout(
      'Shoulder Sculptor',
      'Shoulders',
      'Develop strong, well-rounded shoulders with these targeted exercises.',
      null
    );

    await insertExercise(
      shouldersWorkoutId,
      'Overhead Press',
      'Press weight overhead, keep core tight, lower with control.',
      4,
      8,
      null,
      null,
      null
    );

    await insertExercise(
      shouldersWorkoutId,
      'Lateral Raises',
      'Raise dumbbells to sides until arms parallel to floor, lower slowly.',
      3,
      12,
      null,
      null,
      null
    );

    await insertExercise(
      shouldersWorkoutId,
      'Front Raises',
      'Raise dumbbell in front of body to shoulder height, lower slowly.',
      3,
      12,
      null,
      null,
      null
    );

    // Seed Arms Workouts
    const armsWorkoutId = await insertWorkout(
      'Arm Annihilator',
      'Arms',
      'Target your biceps and triceps for stronger, more defined arms.',
      null
    );

    await insertExercise(
      armsWorkoutId,
      'Bicep Curls',
      'Hold dumbbells at sides, curl weights toward shoulders, lower slowly.',
      3,
      12,
      null,
      null,
      null
    );

    await insertExercise(
      armsWorkoutId,
      'Tricep Dips',
      'Support body on parallel bars, lower until shoulders below elbows, push up.',
      3,
      10,
      null,
      null,
      null
    );

    await insertExercise(
      armsWorkoutId,
      'Hammer Curls',
      'Hold dumbbells with neutral grip, curl toward shoulders, keep elbows stationary.',
      3,
      12,
      null,
      null,
      null
    );

    // Seed Core Workouts
    const coreWorkoutId = await insertWorkout(
      'Core Crusher',
      'Core',
      'Strengthen your core with these effective abdominal and stability exercises.',
      null
    );

    await insertExercise(
      coreWorkoutId,
      'Plank',
      'Hold body in straight line from head to heels, engage core muscles.',
      3,
      null,
      60,
      null,
      null
    );

    await insertExercise(
      coreWorkoutId,
      'Crunches',
      'Lie on back, lift shoulders off ground by contracting abs, lower slowly.',
      3,
      20,
      null,
      null,
      null
    );

    await insertExercise(
      coreWorkoutId,
      'Russian Twists',
      'Sit with knees bent, lean back slightly, rotate torso side to side.',
      3,
      15,
      null,
      null,
      null
    );

    // Seed Cardio Workouts
    const cardioWorkoutId = await insertWorkout(
      'Cardio Blast',
      'Cardio',
      'High-intensity cardio workout to boost your cardiovascular fitness.',
      null
    );

    await insertExercise(
      cardioWorkoutId,
      'Jumping Jacks',
      'Jump while spreading legs and raising arms overhead, return to start.',
      3,
      20,
      null,
      null,
      null
    );

    await insertExercise(
      cardioWorkoutId,
      'Burpees',
      'Squat down, jump back to plank, do push-up, jump feet forward, jump up.',
      3,
      10,
      null,
      null,
      null
    );

    await insertExercise(
      cardioWorkoutId,
      'Mountain Climbers',
      'In plank position, alternate bringing knees toward chest rapidly.',
      3,
      null,
      30,
      null,
      null
    );

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};