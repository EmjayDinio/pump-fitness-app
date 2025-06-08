import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';

// Terms of Service Screen
export function TermsOfServiceScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.headerAccent} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last updated: June 5, 2025</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.sectionText}>
              By accessing and using PUMP, you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service govern your use of our fitness application and services.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Description of Service</Text>
            <Text style={styles.sectionText}>
              PUMP is a fitness application designed to help users track workouts, monitor progress, and achieve their fitness goals. Our service includes workout planning, progress tracking, and motivational features.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
            <Text style={styles.sectionText}>
              You are responsible for:
            </Text>
            <Text style={styles.bulletPoint}>• Providing accurate and complete information</Text>
            <Text style={styles.bulletPoint}>• Maintaining the security of your account</Text>
            <Text style={styles.bulletPoint}>• Using the service in compliance with applicable laws</Text>
            <Text style={styles.bulletPoint}>• Consulting healthcare professionals before starting any fitness program</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Health and Safety</Text>
            <Text style={styles.sectionText}>
              PUMP provides fitness guidance for informational purposes only. Always consult with a qualified healthcare provider before beginning any exercise program. You assume full responsibility for your health and safety while using our service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Account Security</Text>
            <Text style={styles.sectionText}>
              You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized use of your account or any security breach.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Prohibited Activities</Text>
            <Text style={styles.sectionText}>
              You may not:
            </Text>
            <Text style={styles.bulletPoint}>• Use the service for any illegal purpose</Text>
            <Text style={styles.bulletPoint}>• Attempt to gain unauthorized access to our systems</Text>
            <Text style={styles.bulletPoint}>• Share inappropriate or harmful content</Text>
            <Text style={styles.bulletPoint}>• Interfere with other users' experience</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Intellectual Property</Text>
            <Text style={styles.sectionText}>
              All content, features, and functionality of PUMP are owned by us and are protected by copyright, trademark, and other intellectual property laws.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
            <Text style={styles.sectionText}>
              PUMP is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Termination</Text>
            <Text style={styles.sectionText}>
              We reserve the right to terminate or suspend your account at any time for violation of these terms or for any other reason we deem appropriate.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Changes to Terms</Text>
            <Text style={styles.sectionText}>
              We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. Contact Information</Text>
            <Text style={styles.sectionText}>
              If you have questions about these Terms of Service, please contact us at support@pumpfitness.com
            </Text>
          </View>

          <View style={styles.bottomSection}>
            <Text style={styles.motivationText}>Transform Responsibly</Text>
            <View style={styles.motivationDot} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Privacy Policy Screen
export function PrivacyPolicyScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.headerAccent} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last updated: June 5, 2025</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            <Text style={styles.sectionText}>
              We collect information you provide directly to us, such as:
            </Text>
            <Text style={styles.bulletPoint}>• Account information (name, email, password)</Text>
            <Text style={styles.bulletPoint}>• Profile information (fitness goals, preferences)</Text>
            <Text style={styles.bulletPoint}>• Workout data and progress tracking</Text>
            <Text style={styles.bulletPoint}>• Communication preferences</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
            <Text style={styles.sectionText}>
              We use your information to:
            </Text>
            <Text style={styles.bulletPoint}>• Provide and improve our fitness services</Text>
            <Text style={styles.bulletPoint}>• Track your workout progress and goals</Text>
            <Text style={styles.bulletPoint}>• Send you relevant fitness tips and updates</Text>
            <Text style={styles.bulletPoint}>• Ensure account security and prevent fraud</Text>
            <Text style={styles.bulletPoint}>• Analyze usage patterns to enhance user experience</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Information Sharing</Text>
            <Text style={styles.sectionText}>
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </Text>
            <Text style={styles.bulletPoint}>• With your explicit consent</Text>
            <Text style={styles.bulletPoint}>• To comply with legal obligations</Text>
            <Text style={styles.bulletPoint}>• To protect our rights and safety</Text>
            <Text style={styles.bulletPoint}>• With service providers who assist in app functionality</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Data Security</Text>
            <Text style={styles.sectionText}>
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security assessments.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Health Information</Text>
            <Text style={styles.sectionText}>
              Your health and fitness data is particularly sensitive. We use industry-standard security practices to protect this information and will never share it without your explicit consent, except as required by law.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Data Retention</Text>
            <Text style={styles.sectionText}>
              We retain your personal information for as long as necessary to provide our services and as required by law. You may request deletion of your account and associated data at any time.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Your Rights</Text>
            <Text style={styles.sectionText}>
              You have the right to:
            </Text>
            <Text style={styles.bulletPoint}>• Access your personal information</Text>
            <Text style={styles.bulletPoint}>• Correct inaccurate data</Text>
            <Text style={styles.bulletPoint}>• Delete your account and data</Text>
            <Text style={styles.bulletPoint}>• Export your fitness data</Text>
            <Text style={styles.bulletPoint}>• Opt-out of marketing communications</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Cookies and Tracking</Text>
            <Text style={styles.sectionText}>
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, and remember your preferences. You can control cookie settings through your device settings.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Third-Party Services</Text>
            <Text style={styles.sectionText}>
              Our app may integrate with third-party fitness devices and services. Please review their privacy policies as we are not responsible for their data practices.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Children's Privacy</Text>
            <Text style={styles.sectionText}>
              PUMP is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we discover such information, we will delete it immediately.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. Changes to Privacy Policy</Text>
            <Text style={styles.sectionText}>
              We may update this Privacy Policy periodically. We will notify you of any material changes through the app or via email. Your continued use constitutes acceptance of the updated policy.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>12. Contact Us</Text>
            <Text style={styles.sectionText}>
              If you have questions about this Privacy Policy or how we handle your data, please contact us at privacy@pumpfitness.com or through the app's support section.
            </Text>
          </View>

          <View style={styles.bottomSection}>
            <Text style={styles.motivationText}>Your Privacy Matters</Text>
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
    backgroundColor: '#0A0A0A',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: 55,
    zIndex: 1,
  },
  backButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerAccent: {
    width: 40,
    height: 2,
    backgroundColor: '#FF6B35',
    borderRadius: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 22,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 22,
    marginLeft: 16,
    marginBottom: 4,
  },
  bottomSection: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  motivationText: {
    fontSize: 12,
    color: '#6B7280',
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