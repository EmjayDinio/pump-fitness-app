import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
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
      <View style={styles.overlay}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.appName}>PUMP</Text>
          <Text style={styles.title}>Feel the power!</Text>
          <Text style={styles.subtitle}>Welcome back, champion!</Text>
        </View>
        
        {/* Form Section */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="📧 Your Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="🔒 Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? '🔄 Logging In...' : 'LET\'S GO!'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.linkText}>
              New to the gym? <Text style={styles.linkBold}>Join the Squad!</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Motivational Footer */}
        <View style={styles.footer}>
          <Text style={styles.motivationText}>
            "Your only limit is YOU"
          </Text>
        </View>
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
    justifyContent: 'space-between',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#B0B0B0',
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    maxHeight: 300,
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
  button: {
    backgroundColor: '#FF6B35',
    paddingVertical: 18,
    borderRadius: 25,
    marginBottom: 20,
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
  footer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  motivationText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#FF6B35',
    textAlign: 'center',
    fontWeight: '500',
  },
});