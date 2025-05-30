import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
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
        'Welcome to the Squad! 🎉', 
        'Your fitness journey starts now!',
        [{ text: 'LET\'S GO!', onPress: () => navigation.navigate('Login') }]
      );
    } else {
      Alert.alert('Signup Failed', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.appName}>💪 PUMP </Text>
            <Text style={styles.title}>Join the Squad!</Text>
            <Text style={styles.subtitle}>Your transformation starts here 🔥</Text>
          </View>
          
          {/* Form Section */}
          <View style={styles.formContainer}>
            <View style={styles.nameRow}>
              <TextInput
                style={[styles.input, styles.nameInput]}
                placeholder="👤 First Name"
                placeholderTextColor="#999"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
              <TextInput
                style={[styles.input, styles.nameInput]}
                placeholder="👤 Last Name"
                placeholderTextColor="#999"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="📧 Email Address"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <TextInput
              style={styles.input}
              placeholder="🔒 Create Password (min 6 chars)"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            <TextInput
              style={styles.input}
              placeholder="🔒 Confirm Password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            
            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleSignup}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? '⏳ Creating Your Account...' : '🚀 START MY JOURNEY!'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>
                Already crushing it? <Text style={styles.linkBold}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Terms Section */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By joining, you agree to push your limits and follow our{'\n'}
              <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          {/* Motivational Footer */}
          <View style={styles.footer}>
            <Text style={styles.motivationText}>
              "The body achieves what the mind believes"
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#B0B0B0',
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
    maxHeight: 500,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nameInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: '#FF6B35',
    paddingVertical: 18,
    borderRadius: 25,
    marginBottom: 20,
    marginTop: 10,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#CC5429',
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  linkText: {
    textAlign: 'center',
    color: '#B0B0B0',
    fontSize: 16,
    marginTop: 10,
  },
  linkBold: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  termsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  termsText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 13,
    lineHeight: 18,
  },
  termsLink: {
    color: '#FF6B35',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  motivationText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#FF6B35',
    textAlign: 'center',
    fontWeight: '500',
  },
});