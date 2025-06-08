// database/DatabaseManager.js
import SQLite from 'react-native-sqlite-storage';

// Enable debugging
SQLite.DEBUG(true);
SQLite.enablePromise(true);

class DatabaseManager {
  constructor() {
    this.database = null;
  }

  // Initialize database connection
  async initDB() {
    try {
      this.database = await SQLite.openDatabase(
        {
          name: 'FitnessApp.db',
          location: 'default',
        }
      );
      console.log('Database opened successfully');
      await this.createTables();
      return this.database;
    } catch (error) {
      console.log('Error opening database:', error);
      throw error;
    }
  }

  // Create necessary tables
  async createTables() {
    try {
      // Workouts table
      await this.database.executeSql(`
        CREATE TABLE IF NOT EXISTS workouts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL,
          start_time TEXT NOT NULL,
          end_time TEXT NOT NULL,
          goal TEXT NOT NULL,
          body_parts TEXT,
          difficulty TEXT NOT NULL,
          duration INTEGER NOT NULL,
          total_exercises INTEGER NOT NULL,
          completed_exercises INTEGER NOT NULL,
          completion_rate INTEGER NOT NULL,
          calories_burned INTEGER DEFAULT 0,
          status TEXT DEFAULT 'completed',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Exercises table (for detailed tracking)
      await this.database.executeSql(`
        CREATE TABLE IF NOT EXISTS workout_exercises (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          workout_id INTEGER,
          exercise_name TEXT NOT NULL,
          muscle TEXT,
          type TEXT,
          difficulty TEXT,
          completed BOOLEAN DEFAULT 0,
          duration INTEGER DEFAULT 0,
          FOREIGN KEY (workout_id) REFERENCES workouts (id)
        )
      `);

      // User stats table (for overall progress tracking)
      await this.database.executeSql(`
        CREATE TABLE IF NOT EXISTS user_stats (
          id INTEGER PRIMARY KEY,
          total_workouts INTEGER DEFAULT 0,
          total_time INTEGER DEFAULT 0,
          total_calories INTEGER DEFAULT 0,
          current_streak INTEGER DEFAULT 0,
          best_streak INTEGER DEFAULT 0,
          last_workout_date TEXT,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Initialize user stats if not exists
      await this.database.executeSql(`
        INSERT OR IGNORE INTO user_stats (id, total_workouts, total_time, total_calories, current_streak, best_streak)
        VALUES (1, 0, 0, 0, 0, 0)
      `);

      console.log('Tables created successfully');
    } catch (error) {
      console.log('Error creating tables:', error);
      throw error;
    }
  }

  // Save workout data
  async saveWorkout(workoutData) {
    try {
      const {
        date,
        startTime,
        endTime,
        goal,
        bodyParts,
        difficulty,
        duration,
        totalExercises,
        completedExercises,
        completionRate,
        exercises = [],
        status = 'completed'
      } = workoutData;

      // Calculate estimated calories burned (basic formula)
      const caloriesBurned = this.calculateCalories(duration, difficulty, completedExercises);

      // Insert workout
      const [workoutResult] = await this.database.executeSql(`
        INSERT INTO workouts (
          date, start_time, end_time, goal, body_parts, difficulty,
          duration, total_exercises, completed_exercises, completion_rate,
          calories_burned, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        date,
        startTime,
        endTime,
        goal,
        JSON.stringify(bodyParts),
        difficulty,
        duration,
        totalExercises,
        completedExercises,
        completionRate,
        caloriesBurned,
        status
      ]);

      const workoutId = workoutResult.insertId;

      // Insert exercises
      for (const exercise of exercises) {
        await this.database.executeSql(`
          INSERT INTO workout_exercises (
            workout_id, exercise_name, muscle, type, difficulty, completed
          ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
          workoutId,
          exercise.name,
          exercise.muscle || exercise.targetBodyPart,
          exercise.type,
          exercise.difficulty,
          1
        ]);
      }

      // Update user stats
      await this.updateUserStats(duration, caloriesBurned, date);

      console.log('Workout saved successfully with ID:', workoutId);
      return workoutId;
    } catch (error) {
      console.log('Error saving workout:', error);
      throw error;
    }
  }

  // Calculate estimated calories burned
  calculateCalories(duration, difficulty, completedExercises) {
    const baseRate = {
      'beginner': 8,     // calories per minute
      'intermediate': 10,
      'expert': 12
    };
    
    const rate = baseRate[difficulty?.toLowerCase()] || 8;
    const minutes = Math.floor(duration / 60);
    const exerciseBonus = completedExercises * 5; // bonus calories per completed exercise
    
    return Math.round((minutes * rate) + exerciseBonus);
  }

  // Update user statistics
  async updateUserStats(duration, calories, workoutDate) {
    try {
      // Get current stats
      const [result] = await this.database.executeSql(
        'SELECT * FROM user_stats WHERE id = 1'
      );

      if (result.rows.length > 0) {
        const stats = result.rows.item(0);
        const lastWorkoutDate = stats.last_workout_date;
        
        // Calculate streak
        let currentStreak = stats.current_streak;
        if (lastWorkoutDate) {
          const lastDate = new Date(lastWorkoutDate);
          const currentDate = new Date(workoutDate);
          const daysDiff = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === 1) {
            currentStreak += 1;
          } else if (daysDiff > 1) {
            currentStreak = 1;
          }
        } else {
          currentStreak = 1;
        }

        const bestStreak = Math.max(currentStreak, stats.best_streak);

        // Update stats
        await this.database.executeSql(`
          UPDATE user_stats SET
            total_workouts = total_workouts + 1,
            total_time = total_time + ?,
            total_calories = total_calories + ?,
            current_streak = ?,
            best_streak = ?,
            last_workout_date = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = 1
        `, [duration, calories, currentStreak, bestStreak, workoutDate]);
      }
    } catch (error) {
      console.log('Error updating user stats:', error);
    }
  }

  // Get user statistics
  async getUserStats() {
    try {
      const [result] = await this.database.executeSql(
        'SELECT * FROM user_stats WHERE id = 1'
      );
      
      if (result.rows.length > 0) {
        return result.rows.item(0);
      }
      return null;
    } catch (error) {
      console.log('Error getting user stats:', error);
      return null;
    }
  }

  // Get recent workouts
  async getRecentWorkouts(limit = 10) {
    try {
      const [result] = await this.database.executeSql(`
        SELECT * FROM workouts 
        ORDER BY date DESC, created_at DESC 
        LIMIT ?
      `, [limit]);

      const workouts = [];
      for (let i = 0; i < result.rows.length; i++) {
        const workout = result.rows.item(i);
        workout.body_parts = JSON.parse(workout.body_parts || '[]');
        workouts.push(workout);
      }
      
      return workouts;
    } catch (error) {
      console.log('Error getting recent workouts:', error);
      return [];
    }
  }

  // Get weekly progress
  async getWeeklyProgress() {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const [result] = await this.database.executeSql(`
        SELECT 
          DATE(date) as workout_date,
          COUNT(*) as workout_count,
          SUM(duration) as total_duration,
          SUM(calories_burned) as total_calories,
          AVG(completion_rate) as avg_completion
        FROM workouts 
        WHERE date >= ? 
        GROUP BY DATE(date)
        ORDER BY workout_date DESC
      `, [oneWeekAgo.toISOString()]);

      const weeklyData = [];
      for (let i = 0; i < result.rows.length; i++) {
        weeklyData.push(result.rows.item(i));
      }
      
      return weeklyData;
    } catch (error) {
      console.log('Error getting weekly progress:', error);
      return [];
    }
  }

  // Get workout stats by goal
  async getWorkoutStatsByGoal() {
    try {
      const [result] = await this.database.executeSql(`
        SELECT 
          goal,
          COUNT(*) as count,
          SUM(duration) as total_duration,
          AVG(completion_rate) as avg_completion
        FROM workouts 
        GROUP BY goal
        ORDER BY count DESC
      `);

      const goalStats = [];
      for (let i = 0; i < result.rows.length; i++) {
        goalStats.push(result.rows.item(i));
      }
      
      return goalStats;
    } catch (error) {
      console.log('Error getting goal stats:', error);
      return [];
    }
  }

  // Close database connection
  async closeDB() {
    if (this.database) {
      await this.database.close();
      console.log('Database closed');
    }
  }
}

// Export singleton instance
export default new DatabaseManager();