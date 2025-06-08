import React, { useState } from 'react';
import {
  View,
  Text,
  Linking,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// Simple icon components (you can replace with react-native-vector-icons)
const BackIcon = () => <Text style={styles.iconText}>←</Text>;
const EmailIcon = () => <Text style={styles.iconEmoji}>📧</Text>;
const PhoneIcon = () => <Text style={styles.iconEmoji}>📞</Text>;
const ChatIcon = () => <Text style={styles.iconEmoji}>💬</Text>;
const HelpIcon = () => <Text style={styles.iconEmoji}>❓</Text>;
const ClockIcon = () => <Text style={styles.iconEmoji}>🕐</Text>;
const CheckIcon = () => <Text style={styles.iconEmoji}>✅</Text>;

export default function ContactSupportScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const supportEmail = 'support@yourapp.com';
  const supportPhone = '+1-555-0123';

  const categories = [
    'Technical Issue',
    'Account Problem',
    'Billing Question',
    'Feature Request',
    'Bug Report',
    'General Inquiry'
  ];

  const handleBackPress = () => {
    // Replace with your navigation method
    if (navigation && navigation.goBack) {
      navigation.goBack();
    } else {
      // Alternative for testing or if navigation prop is not available
      console.log('Back button pressed');
    }
  };

  const handleEmailPress = () => {
    const subject = selectedCategory ? `Support Request: ${selectedCategory}` : 'Support Request';
    const body = message ? `\n\nMessage:\n${message}\n\nFrom: ${userEmail}` : '';
    const emailUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(emailUrl).catch(() => {
      Alert.alert(
        'Unable to open email',
        `Please send your message to: ${supportEmail}`,
        [{ text: 'OK' }]
      );
    });
  };

  const handlePhonePress = () => {
    const phoneUrl = `tel:${supportPhone}`;
    Linking.openURL(phoneUrl).catch(() => {
      Alert.alert(
        'Unable to make call',
        `Please call us at: ${supportPhone}`,
        [{ text: 'OK' }]
      );
    });
  };

  const handleChatPress = () => {
    Alert.alert(
      'Live Chat',
      'Live chat feature coming soon! For immediate assistance, please use email or phone support.',
      [{ text: 'OK' }]
    );
  };

  const handleSendMessage = () => {
    if (!selectedCategory || !message.trim() || !userEmail.trim()) {
      Alert.alert(
        'Missing Information',
        'Please fill in all fields before sending your message.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Here you would typically send the message to your backend
    Alert.alert(
      'Message Sent!',
      'Thank you for contacting us. We\'ll get back to you within 24 hours.',
      [{ text: 'OK', onPress: () => {
        setSelectedCategory('');
        setMessage('');
        setUserEmail('');
      }}]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <BackIcon />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <HelpIcon />
          </View>
          <Text style={styles.title}>Contact Support</Text>
          <Text style={styles.subtitle}>
            We're here to help! Choose how you'd like to reach us.
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Contact</Text>
          
          <TouchableOpacity 
            style={styles.contactOption} 
            onPress={handleEmailPress}
            activeOpacity={0.7}
          >
            <View style={styles.contactIcon}>
              <EmailIcon />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactDescription}>
                Get detailed help via email
              </Text>
              <Text style={styles.contactDetail}>{supportEmail}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactOption} 
            onPress={handlePhonePress}
            activeOpacity={0.7}
          >
            <View style={styles.contactIcon}>
              <PhoneIcon />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Phone Support</Text>
              <Text style={styles.contactDescription}>
                Speak directly with our team
              </Text>
              <Text style={styles.contactDetail}>{supportPhone}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactOption} 
            onPress={handleChatPress}
            activeOpacity={0.7}
          >
            <View style={styles.contactIcon}>
              <ChatIcon />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Live Chat</Text>
              <Text style={styles.contactDescription}>
                Instant messaging support
              </Text>
              <Text style={styles.contactDetail}>Available 9AM - 6PM EST</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Support Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support Hours</Text>
          <View style={styles.hoursContainer}>
            <View style={styles.hoursIcon}>
              <ClockIcon />
            </View>
            <View style={styles.hoursInfo}>
              <Text style={styles.hoursText}>Monday - Friday: 9:00 AM - 6:00 PM EST</Text>
              <Text style={styles.hoursText}>Saturday: 10:00 AM - 4:00 PM EST</Text>
              <Text style={styles.hoursText}>Sunday: Closed</Text>
              <Text style={styles.hoursSubtext}>
                We typically respond to emails within 2-4 hours during business hours.
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send us a Message</Text>
          
          <View style={styles.formContainer}>
            <Text style={styles.formLabel}>Your Email</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email address"
              value={userEmail}
              onChangeText={setUserEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.formLabel}>Issue Category</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
              contentContainerStyle={styles.categoryContainer}
            >
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryPill,
                    selectedCategory === category && styles.categoryPillSelected
                  ]}
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextSelected
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.formLabel}>Message</Text>
            <TextInput
              style={[styles.textInput, styles.messageInput]}
              placeholder="Describe your issue or question in detail..."
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#9CA3AF"
            />

            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={handleSendMessage}
              activeOpacity={0.8}
            >
              <CheckIcon />
              <Text style={styles.sendButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Link */}
        <View style={styles.section}>
          <View style={styles.faqContainer}>
            <Text style={styles.faqTitle}>Looking for quick answers?</Text>
            <Text style={styles.faqText}>
              Check our FAQ section for instant solutions to common questions.
            </Text>
            <TouchableOpacity 
              style={styles.faqButton}
              onPress={() => {
                // Navigate to FAQ screen
                if (navigation && navigation.navigate) {
                  navigation.navigate('FAQ');
                } else {
                  console.log('Navigate to FAQ');
                }
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.faqButtonText}>View FAQ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 8,
  },
  backText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
    marginLeft: 4,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#3B82F6',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  contactIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#EBF4FF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  contactDetail: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  hoursContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  hoursIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#FEF3C7',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  hoursInfo: {
    flex: 1,
  },
  hoursText: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 4,
    fontWeight: '500',
  },
  hoursSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    fontStyle: 'italic',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryScroll: {
    marginBottom: 8,
  },
  categoryContainer: {
    paddingRight: 20,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  categoryPillSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  faqContainer: {
    backgroundColor: '#F0F9FF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0EA5E9',
    alignItems: 'center',
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0C4A6E',
    marginBottom: 8,
  },
  faqText: {
    fontSize: 14,
    color: '#0369A1',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  faqButton: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  faqButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  iconText: {
    fontSize: 18,
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  iconEmoji: {
    fontSize: 24,
  },
});