import SQLite from 'react-native-sqlite-storage';

// Enable promise-based API
SQLite.enablePromise(true);

const openDatabase = () => {
  return SQLite.openDatabase(
    {
      name: 'fitness.db',
      location: 'default',
    },
    () => console.log('Database opened successfully'),
    error => console.log('Error opening database: ', error)
  );
};

const db = openDatabase();

export const initDatabase = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const database = await db;
      
      // Create workouts table
      await database.executeSql(
        `CREATE TABLE IF NOT EXISTS workouts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          body_part TEXT NOT NULL,
          description TEXT,
          image_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`
      );
      console.log('Workouts table created');

      // Create exercises table
      await database.executeSql(
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
        );`
      );
      console.log('Exercises table created');

      // Create user_progress table
      await database.executeSql(
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
        );`
      );
      console.log('User progress table created');
      resolve();
    } catch (error) {
      console.log('Error creating tables:', error);
      reject(error);
    }
  });
};

// Workout operations
export const insertWorkout = async (name, bodyPart, description, imageUrl) => {
  try {
    const database = await db;
    const result = await database.executeSql(
      'INSERT INTO workouts (name, body_part, description, image_url) VALUES (?, ?, ?, ?)',
      [name, bodyPart, description, imageUrl]
    );
    return result[0].insertId;
  } catch (error) {
    throw error;
  }
};

export const getWorkoutsByBodyPart = async (bodyPart) => {
  try {
    const database = await db;
    const result = await database.executeSql(
      'SELECT * FROM workouts WHERE body_part = ?',
      [bodyPart]
    );
    return result[0].rows.raw();
  } catch (error) {
    throw error;
  }
};

// Exercise operations
export const insertExercise = async (workoutId, name, description, sets, reps, duration, imageUrl, animationUrl) => {
  try {
    const database = await db;
    const result = await database.executeSql(
      'INSERT INTO exercises (workout_id, name, description, sets, reps, duration, image_url, animation_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [workoutId, name, description, sets, reps, duration, imageUrl, animationUrl]
    );
    return result[0].insertId;
  } catch (error) {
    throw error;
  }
};

export const getExercisesByWorkout = async (workoutId) => {
  try {
    const database = await db;
    const result = await database.executeSql(
      'SELECT * FROM exercises WHERE workout_id = ?',
      [workoutId]
    );
    return result[0].rows.raw();
  } catch (error) {
    throw error;
  }
};

// Progress tracking operations
export const insertProgress = async (userId, exerciseId, setsCompleted, repsCompleted, weightUsed, durationCompleted) => {
  try {
    const database = await db;
    const result = await database.executeSql(
      'INSERT INTO user_progress (user_id, exercise_id, sets_completed, reps_completed, weight_used, duration_completed) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, exerciseId, setsCompleted, repsCompleted, weightUsed, durationCompleted]
    );
    return result[0].insertId;
  } catch (error) {
    throw error;
  }
};

export const getUserProgress = async (userId, exerciseId) => {
  try {
    const database = await db;
    const result = await database.executeSql(
      'SELECT * FROM user_progress WHERE user_id = ? AND exercise_id = ? ORDER BY date_completed DESC',
      [userId, exerciseId]
    );
    return result[0].rows.raw();
  } catch (error) {
    throw error;
  }
};