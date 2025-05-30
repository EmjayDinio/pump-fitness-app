import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('fitness.db');

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Create workouts table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS workouts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          body_part TEXT NOT NULL,
          description TEXT,
          image_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`,
        [],
        () => console.log('Workouts table created'),
        (_, error) => console.log('Error creating workouts table:', error)
      );

      // Create exercises table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS exercises (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          workout_id INTEGER,
          name TEXT NOT NULL,
          description TEXT,
          sets INTEGER,
          reps INTEGER,
          duration INTEGER,
          image_url TEXT,
          animation_url TEXT,
          FOREIGN KEY (workout_id) REFERENCES workouts (id)
        );`,
        [],
        () => console.log('Exercises table created'),
        (_, error) => console.log('Error creating exercises table:', error)
      );

      // Create user_progress table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS user_progress (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          exercise_id INTEGER,
          sets_completed INTEGER,
          reps_completed INTEGER,
          weight_used REAL,
          duration_completed INTEGER,
          date_completed DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (exercise_id) REFERENCES exercises (id)
        );`,
        [],
        () => {
          console.log('User progress table created');
          resolve();
        },
        (_, error) => {
          console.log('Error creating user progress table:', error);
          reject(error);
        }
      );
    });
  });
};

// Workout operations
export const insertWorkout = (name, bodyPart, description, imageUrl) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO workouts (name, body_part, description, image_url) VALUES (?, ?, ?, ?)',
        [name, bodyPart, description, imageUrl],
        (_, result) => resolve(result.insertId),
        (_, error) => reject(error)
      );
    });
  });
};

export const getWorkoutsByBodyPart = (bodyPart) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM workouts WHERE body_part = ?',
        [bodyPart],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

// Exercise operations
export const insertExercise = (workoutId, name, description, sets, reps, duration, imageUrl, animationUrl) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO exercises (workout_id, name, description, sets, reps, duration, image_url, animation_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [workoutId, name, description, sets, reps, duration, imageUrl, animationUrl],
        (_, result) => resolve(result.insertId),
        (_, error) => reject(error)
      );
    });
  });
};

export const getExercisesByWorkout = (workoutId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM exercises WHERE workout_id = ?',
        [workoutId],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

// Progress tracking operations
export const insertProgress = (userId, exerciseId, setsCompleted, repsCompleted, weightUsed, durationCompleted) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO user_progress (user_id, exercise_id, sets_completed, reps_completed, weight_used, duration_completed) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, exerciseId, setsCompleted, repsCompleted, weightUsed, durationCompleted],
        (_, result) => resolve(result.insertId),
        (_, error) => reject(error)
      );
    });
  });
};

export const getUserProgress = (userId, exerciseId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM user_progress WHERE user_id = ? AND exercise_id = ? ORDER BY date_completed DESC',
        [userId, exerciseId],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};