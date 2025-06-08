import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar } from 'react-native';
import { signIn } from '../../services/firebase/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hold Up!', 'Fill in all fields to start your fitness journey');
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Background Gradient Effect */}
      <View style={styles.backgroundGradient} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>PUMP</Text>
          <View style={styles.logoAccent} />
        </View>
        <Text style={styles.tagline}>Unlock Your Potential</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeSubtitle}>Ready to crush your goals?</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.inputLine} />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <View style={styles.inputLine} />
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Signup')}
            style={styles.signupContainer}
          >
            <Text style={styles.signupText}>
              Don't have an account? <Text style={styles.signupLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.motivationContainer}>
          <Text style={styles.motivationText}>Transform Today</Text>
          <View style={styles.motivationDot} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#FF6B35',
    opacity: 0.03,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: 2,
  },
  logoAccent: {
    width: 40,
    height: 3,
    backgroundColor: '#FF6B35',
    borderRadius: 2,
    marginTop: 4,
  },
  tagline: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  welcomeSection: {
    marginBottom: 48,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
  },
  formContainer: {
    flex: 1,
    maxHeight: 280,
  },
  inputContainer: {
    marginBottom: 32,
  },
  input: {
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 16,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    fontWeight: '500',
  },
  inputLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 32,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#CC5429',
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  signupContainer: {
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
  signupLink: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  bottomSection: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  motivationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  motivationText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  motivationDot: {
    width: 4,
    height: 4,
    backgroundColor: '#FF6B35',
    borderRadius: 2,
    marginLeft: 8,
  },
});