import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView,
  Image,
  Switch
} from 'react-native';
import { logout, getCurrentUser } from '../../services/firebase/authService';
import { getUserProgress } from '../../services/database/database';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        
        // Load user progress/stats
        const progress = await getUserProgress(currentUser.uid);
        setTotalWorkouts(progress.length);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            const result = await logout();
            if (!result.success) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const getInitials = (email) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  const formatJoinDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(user?.email)}
            </Text>
          </View>
        </View>
        
        <Text style={styles.userName}>
          {user?.displayName || user?.email?.split('@')[0] || 'Fitness User'}
        </Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <Text style={styles.joinDate}>
          Member since {formatJoinDate(user?.metadata?.creationTime)}
        </Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalWorkouts}</Text>
            <Text style={styles.statLabel}>Workouts Logged</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Streak Days</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Goals Achieved</Text>
          </View>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Push Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: '#007AFF' }}
            thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: '#767577', true: '#007AFF' }}
            thumbColor={darkModeEnabled ? '#ffffff' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Workout History</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Goals & Targets</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Privacy Settings</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Support Section */}
      <View style={styles.supportContainer}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Help & FAQ</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Contact Support</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Rate the App</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Terms & Privacy</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Section */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* App Version */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  joinDate: {
    fontSize: 14,
    color: '#888',
  },
  statsContainer: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  settingsContainer: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  menuItemArrow: {
    fontSize: 20,
    color: '#ccc',
  },
  supportContainer: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  logoutContainer: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#888',
  },
});