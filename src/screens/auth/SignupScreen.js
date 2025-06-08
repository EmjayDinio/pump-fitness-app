import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, StatusBar } from 'react-native';
import { signUp } from '../../services/firebase/authService';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!firstName.trim()) {
      Alert.alert('Hold Up, Champ!', 'We need your first name to get started');
      return false;
    }
    
    if (!lastName.trim()) {
      Alert.alert('Almost There!', 'Don\'t forget your last name');
      return false;
    }
    
    if (!email.trim()) {
      Alert.alert('Email Required!', 'We need your email to keep you motivated');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return false;
    }
    
    if (password.length < 6) {
      Alert.alert('Weak Password!', 'Make it strong like you - at least 6 characters');
      return false;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Your passwords don\'t match - try again!');
      return false;
    }
    
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await signUp(email, password);
    setLoading(false);

    if (result.success) {
      Alert.alert(
        'Welcome to the Squad!', 
        'Your fitness journey starts now!',
        [{ text: 'Let\'s Go!', onPress: () => navigation.navigate('Login') }]
      );
    } else {
      Alert.alert('Signup Failed', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Background Gradient Effect */}
      <View style={styles.backgroundGradient} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>PUMP</Text>
            <View style={styles.logoAccent} />
          </View>
          <Text style={styles.tagline}>Join the Movement</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Create Account</Text>
            <Text style={styles.welcomeSubtitle}>Start your transformation journey</Text>
          </View>

          <View style={styles.formContainer}>
            {/* Name Fields Row */}
            <View style={styles.nameRow}>
              <View style={[styles.inputContainer, styles.nameInputContainer]}>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor="#9CA3AF"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
                <View style={styles.inputLine} />
              </View>
              <View style={[styles.inputContainer, styles.nameInputContainer]}>
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor="#9CA3AF"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
                <View style={styles.inputLine} />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.inputLine} />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Create Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <View style={styles.inputLine} />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              <View style={styles.inputLine} />
            </View>

            <TouchableOpacity 
              style={[styles.signupButton, loading && styles.signupButtonDisabled]} 
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.signupButtonText}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate('Login')}
              style={styles.loginContainer}
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginLink}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Terms Section */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By creating an account, you agree to our{'\n'}
              <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <View style={styles.motivationContainer}>
            <Text style={styles.motivationText}>Begin Your Journey</Text>
            <View style={styles.motivationDot} />
          </View>
        </View>
      </ScrollView>
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
    height: '40%',
    backgroundColor: '#FF6B35',
    opacity: 0.03,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    fontSize: 32,
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
  },
  welcomeSection: {
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
  },
  formContainer: {
    marginBottom: 32,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  nameInputContainer: {
    flex: 1,
    marginHorizontal: 6,
  },
  inputContainer: {
    marginBottom: 28,
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
  signupButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  signupButtonDisabled: {
    backgroundColor: '#CC5429',
    opacity: 0.6,
  },
  signupButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
  loginLink: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  termsContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  termsText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
  },
  termsLink: {
    color: '#FF6B35',
    fontWeight: '500',
  },
  bottomSection: {
    paddingBottom: 32,
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