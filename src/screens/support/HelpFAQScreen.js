import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';

const { width } = Dimensions.get('window');

// Simple icon components (you can replace with react-native-vector-icons)
const ChevronDown = () => <Text style={styles.chevron}>▼</Text>;
const ChevronUp = () => <Text style={styles.chevron}>▲</Text>;
const SearchIcon = () => <Text style={styles.icon}>🔍</Text>;
const HelpIcon = () => <Text style={styles.icon}>❓</Text>;
const ShieldIcon = () => <Text style={styles.icon}>🛡️</Text>;
const PhoneIcon = () => <Text style={styles.icon}>📱</Text>;
const UsersIcon = () => <Text style={styles.icon}>👥</Text>;
const SettingsIcon = () => <Text style={styles.icon}>⚙️</Text>;
const CreditIcon = () => <Text style={styles.icon}>💳</Text>;
const MessageIcon = () => <Text style={styles.icon}>💬</Text>;
const BackIcon = () => <Text style={styles.iconText}>←</Text>;

export default function HelpFAQScreen({ navigation }) {
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [animatedValues] = useState({});

  const handleBackPress = () => {
    // If using React Navigation
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
    // Alternative: If you have a custom back handler function passed as prop
    // if (onGoBack) {
    //   onGoBack();
    // }
  };

  const faqData = [
    {
      id: 1,
      category: 'Getting Started',
      icon: <PhoneIcon />,
      question: 'How do I use this app?',
      answer: 'Getting started is easy! Simply log in with your credentials, and you\'ll be taken to the main dashboard. From there, you can track your data, view analytics, and navigate between different sections using the bottom tabs. The interface is designed to be intuitive - explore each tab to discover all available features.'
    },
    {
      id: 2,
      category: 'Privacy & Security',
      icon: <ShieldIcon />,
      question: 'Is my data safe?',
      answer: 'Absolutely! We prioritize user privacy and data security. We use Firebase Authentication for secure login and Firestore for encrypted data storage. All data transmission is encrypted using industry-standard protocols. We never share your personal information with third parties without your explicit consent.'
    },
    {
      id: 3,
      category: 'Getting Started',
      icon: <UsersIcon />,
      question: 'How do I create an account?',
      answer: 'Creating an account is simple. Tap the "Sign Up" button on the login screen, enter your email address and create a secure password. You\'ll receive a verification email to confirm your account. Once verified, you can start using all app features immediately.'
    },
    {
      id: 4,
      category: 'Features',
      icon: <SettingsIcon />,
      question: 'What features are available?',
      answer: 'Our app includes data tracking and visualization, personalized analytics, cloud sync across devices, customizable notifications, export functionality, and detailed reporting. Premium users get access to advanced analytics, priority support, and additional customization options.'
    },
    {
      id: 5,
      category: 'Privacy & Security',
      icon: <ShieldIcon />,
      question: 'Can I delete my account and data?',
      answer: 'Yes, you have full control over your data. You can delete your account and all associated data at any time through the Settings menu. Once deleted, your data cannot be recovered, so please make sure to export any important information beforehand.'
    },
    {
      id: 6,
      category: 'Billing',
      icon: <CreditIcon />,
      question: 'How does billing work?',
      answer: 'We offer both free and premium tiers. The free version includes basic features, while premium subscriptions unlock advanced analytics and additional storage. Billing is handled securely through your device\'s app store, and you can cancel anytime from your subscription settings.'
    },
    {
      id: 7,
      category: 'Features',
      icon: <SettingsIcon />,
      question: 'How do I sync data across devices?',
      answer: 'Data synchronization happens automatically when you\'re signed in. Make sure you\'re connected to the internet and logged into the same account on all devices. Your data will sync in real-time, ensuring you always have access to the latest information.'
    },
    {
      id: 8,
      category: 'Support',
      icon: <MessageIcon />,
      question: 'How can I contact support?',
      answer: 'We\'re here to help! You can reach our support team through the in-app contact form, email us directly, or check our comprehensive help documentation. Premium users receive priority support with faster response times.'
    }
  ];

  const categories = ['All', ...new Set(faqData.map(item => item.category))];

  const initializeAnimation = (id) => {
    if (!animatedValues[id]) {
      animatedValues[id] = new Animated.Value(0);
    }
  };

  const toggleExpanded = (id) => {
    initializeAnimation(id);
    
    const newExpanded = new Set(expandedItems);
    const isExpanding = !newExpanded.has(id);
    
    if (isExpanding) {
      newExpanded.add(id);
    } else {
      newExpanded.delete(id);
    }
    
    setExpandedItems(newExpanded);
    
    Animated.timing(animatedValues[id], {
      toValue: isExpanding ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const filteredFAQs = faqData.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryStyle = (category) => {
    const styles = {
      'Getting Started': { backgroundColor: '#E3F2FD', color: '#1565C0' },
      'Privacy & Security': { backgroundColor: '#E8F5E8', color: '#2E7D32' },
      'Features': { backgroundColor: '#F3E5F5', color: '#7B1FA2' },
      'Billing': { backgroundColor: '#FFF3E0', color: '#EF6C00' },
      'Support': { backgroundColor: '#FCE4EC', color: '#C2185B' }
    };
    return styles[category] || { backgroundColor: '#F5F5F5', color: '#424242' };
  };

  const renderFAQItem = (item) => {
    initializeAnimation(item.id);
    const isExpanded = expandedItems.has(item.id);
    const categoryStyle = getCategoryStyle(item.category);

    return (
      <View key={item.id} style={styles.faqItem}>
        <TouchableOpacity
          style={styles.faqHeader}
          onPress={() => toggleExpanded(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.faqHeaderContent}>
            <View style={styles.iconContainer}>
              {item.icon}
            </View>
            <View style={styles.questionContainer}>
              <View style={[styles.categoryBadge, { backgroundColor: categoryStyle.backgroundColor }]}>
                <Text style={[styles.categoryText, { color: categoryStyle.color }]}>
                  {item.category}
                </Text>
              </View>
              <Text style={styles.questionText}>{item.question}</Text>
            </View>
          </View>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </TouchableOpacity>
        
        {isExpanded && (
          <Animated.View
            style={[
              styles.answerContainer,
              {
                opacity: animatedValues[item.id],
                maxHeight: animatedValues[item.id].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 200],
                }),
              }
            ]}
          >
            <View style={styles.answerContent}>
              <Text style={styles.answerText}>{item.answer}</Text>
            </View>
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button - Same style as RateAppScreen */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <BackIcon />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <View style={styles.headerIcon}>
          <HelpIcon />
        </View>
        <Text style={styles.title}>Help & FAQ</Text>
        <Text style={styles.subtitle}>
          Find answers to commonly asked questions about our app
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchIcon}>
            <SearchIcon />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search frequently asked questions..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryPill,
                (searchTerm === '' && category === 'All') || searchTerm === category
                  ? styles.categoryPillActive
                  : styles.categoryPillInactive
              ]}
              onPress={() => setSearchTerm(category === 'All' ? '' : category)}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  (searchTerm === '' && category === 'All') || searchTerm === category
                    ? styles.categoryPillTextActive
                    : styles.categoryPillTextInactive
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* FAQ Items */}
        <View style={styles.faqContainer}>
          {filteredFAQs.length === 0 ? (
            <View style={styles.noResults}>
              <Text style={styles.noResultsIcon}>🔍</Text>
              <Text style={styles.noResultsTitle}>No results found</Text>
              <Text style={styles.noResultsText}>
                Try adjusting your search terms or browse all categories
              </Text>
            </View>
          ) : (
            filteredFAQs.map(renderFAQItem)
          )}
        </View>

        {/* Contact Support Section */}
        <View style={styles.supportSection}>
          <Text style={styles.supportIcon}>💬</Text>
          <Text style={styles.supportTitle}>Still need help?</Text>
          <Text style={styles.supportText}>
            Our support team is standing by to help you with any questions or issues you might have.
          </Text>
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </TouchableOpacity>
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
  iconText: {
    fontSize: 18,
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  titleSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: 20,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryPillActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryPillInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  categoryPillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },
  categoryPillTextInactive: {
    color: '#6B7280',
  },
  faqContainer: {
    paddingHorizontal: 20,
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  faqHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#EBF4FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  questionContainer: {
    flex: 1,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 22,
  },
  answerContainer: {
    overflow: 'hidden',
  },
  answerContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingLeft: 76,
  },
  answerText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    borderLeftWidth: 4,
    borderLeftColor: '#BFDBFE',
    paddingLeft: 16,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  noResultsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  supportSection: {
    backgroundColor: '#3B82F6',
    margin: 20,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  supportIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  supportTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  supportText: {
    fontSize: 16,
    color: '#BFDBFE',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  supportButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  supportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  chevron: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  icon: {
    fontSize: 20,
  },
});