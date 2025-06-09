import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// More nuanced screen size detection
const isSmallScreen = screenHeight < 700;
const isVerySmallScreen = screenHeight < 650;
const isTablet = screenWidth > 768;

// Responsive padding and spacing functions
const getResponsivePadding = (base) => {
  if (isVerySmallScreen) return base * 0.7;
  if (isSmallScreen) return base * 0.85;
  if (isTablet) return base * 1.2;
  return base;
};

const getResponsiveFontSize = (base) => {
  if (isVerySmallScreen) return base * 0.85;
  if (isSmallScreen) return base * 0.9;
  if (isTablet) return base * 1.1;
  return base;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'ios' ? (isSmallScreen ? 44 : 50) : 20,
  },
  scrollContent: {
    flexGrow: 1,
    padding: getResponsivePadding(20),
    paddingTop: getResponsivePadding(10),
    paddingBottom: getResponsivePadding(40), // Extra space for safe scrolling
  },
  header: {
    marginBottom: getResponsivePadding(25),
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(28),
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 15,
    lineHeight: getResponsiveFontSize(32),
  },
  headerSubtitle: {
    fontSize: getResponsiveFontSize(16),
    color: '#7f8c8d',
    textAlign: 'center',
    paddingHorizontal: 15,
    lineHeight: getResponsiveFontSize(20),
  },

  // Progress Section Styles - Improved responsiveness
  progressSection: {
    marginBottom: getResponsivePadding(20),
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: getResponsivePadding(12),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: getResponsivePadding(15),
    paddingHorizontal: 5,
    // Use flexible gap that adapts to screen width
    gap: Math.max(6, (screenWidth - 60) * 0.02),
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: getResponsivePadding(12),
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    // Ensure minimum and maximum sizes
    minHeight: isVerySmallScreen ? 55 : isSmallScreen ? 65 : 75,
    maxWidth: (screenWidth - 80) / 4, // Better calculation for card width
    minWidth: 70, // Prevent cards from being too narrow
  },
  statNumber: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 2,
    textAlign: 'center',
    numberOfLines: 1,
    adjustsFontSizeToFit: true,
  },
  statLabel: {
    fontSize: getResponsiveFontSize(11),
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: getResponsiveFontSize(13),
    numberOfLines: 2,
  },

  // Weekly Tracker Styles - Better layout
  weeklyTrackerContainer: {
    backgroundColor: 'white',
    padding: getResponsivePadding(15),
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 2, // Prevent shadow clipping
  },
  weeklyTrackerTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: getResponsivePadding(10),
    textAlign: 'center',
  },
  weeklyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    minHeight: 50, // Ensure consistent height
  },
  dayContainer: {
    alignItems: 'center',
    flex: 1,
    minWidth: 35, // Prevent squishing
  },
  dayButton: {
    width: Math.min(35, (screenWidth - 100) / 7), // Dynamic but capped size
    height: Math.min(35, (screenWidth - 100) / 7),
    borderRadius: Math.min(17.5, (screenWidth - 100) / 14),
    backgroundColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  dayButtonActive: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  dayText: {
    color: '#6c757d',
    fontWeight: '600',
    fontSize: getResponsiveFontSize(11),
  },
  dayTextActive: {
    color: '#fff',
  },

  // Main Button Styles - Better responsive scaling
  mainButton: {
    backgroundColor: '#007AFF',
    paddingVertical: getResponsivePadding(18),
    paddingHorizontal: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: getResponsivePadding(18),
    marginHorizontal: 5, // Prevent shadow clipping
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    minHeight: 60, // Ensure touchable area
  },
  mainButtonText: {
    color: 'white',
    fontSize: getResponsiveFontSize(17),
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    lineHeight: getResponsiveFontSize(20),
  },
  mainButtonSubtext: {
    color: 'white',
    fontSize: getResponsiveFontSize(13),
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: getResponsiveFontSize(16),
  },

  // Preview Container Styles - Improved spacing
  previewContainer: {
    backgroundColor: 'white',
    padding: getResponsivePadding(15),
    borderRadius: 12,
    marginBottom: getResponsivePadding(15),
    marginHorizontal: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  previewTitle: {
    fontSize: getResponsiveFontSize(15),
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    lineHeight: getResponsiveFontSize(18),
  },
  previewText: {
    fontSize: getResponsiveFontSize(13),
    color: '#6c757d',
    marginBottom: 4,
    lineHeight: getResponsiveFontSize(17),
  },

  // History Section Styles - Better layout
  historySection: {
    marginTop: 10,
  },
  historySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getResponsivePadding(12),
    flexWrap: 'wrap', // Allow wrapping on very small screens
  },
  clearButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minHeight: 36, // Ensure touchable area
  },
  clearButtonText: {
    color: 'white',
    fontSize: getResponsiveFontSize(12),
    fontWeight: '600',
  },
  historyItem: {
    backgroundColor: 'white',
    padding: getResponsivePadding(15),
    borderRadius: 12,
    marginBottom: getResponsivePadding(10),
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Better alignment for wrapped text
    marginBottom: getResponsivePadding(8),
  },
  historyGoal: {
    fontSize: getResponsiveFontSize(15),
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 10,
    lineHeight: getResponsiveFontSize(18),
  },
  historyDate: {
    fontSize: getResponsiveFontSize(11),
    color: '#6c757d',
    flexShrink: 0, // Prevent date from shrinking
  },
  historyDetails: {
    marginBottom: getResponsivePadding(8),
  },
  historyDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  historyLabel: {
    fontSize: getResponsiveFontSize(13),
    color: '#6c757d',
    flex: 1,
  },
  historyValue: {
    fontSize: getResponsiveFontSize(13),
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'right',
    flex: 1,
  },
  historyBodyParts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 5,
  },
  historyBodyPartChip: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4, // Space for wrapped items
  },
  historyBodyPartText: {
    fontSize: getResponsiveFontSize(11),
    color: '#495057',
  },
  moreHistoryText: {
    textAlign: 'center',
    fontSize: getResponsiveFontSize(12),
    color: '#6c757d',
    fontStyle: 'italic',
    marginTop: 15,
    marginBottom: 10,
  },

  // Motivation Card Styles - Better responsive design
  motivationCard: {
    backgroundColor: '#f8f9fa',
    padding: getResponsivePadding(18),
    marginVertical: getResponsivePadding(15),
    marginHorizontal: 2,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  motivationText: {
    fontSize: getResponsiveFontSize(15),
    fontStyle: 'italic',
    color: '#495057',
    textAlign: 'center',
    lineHeight: getResponsiveFontSize(22),
  },

  // Modal Styles - Improved responsiveness
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    padding: getResponsivePadding(20),
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: getResponsivePadding(20),
    maxHeight: isVerySmallScreen ? '90%' : isSmallScreen ? '85%' : '80%',
    // Ensure modal doesn't get too wide on tablets
    maxWidth: isTablet ? 500 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  modalTitle: {
    fontSize: getResponsiveFontSize(22),
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: getResponsiveFontSize(26),
  },
  sectionSubtitle: {
    fontSize: getResponsiveFontSize(13),
    color: '#7f8c8d',
    marginBottom: 10,
    lineHeight: getResponsiveFontSize(16),
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getResponsivePadding(8),
    marginBottom: 10,
    justifyContent: 'flex-start',
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: getResponsivePadding(8),
    paddingHorizontal: getResponsivePadding(12),
    margin: 2,
    minWidth: isVerySmallScreen ? 65 : 75,
    minHeight: 36, // Ensure touchable area
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    color: '#2c3e50',
    fontSize: getResponsiveFontSize(13),
    textAlign: 'center',
    lineHeight: getResponsiveFontSize(16),
  },
  selectedOptionText: {
    color: 'white',
  },
  modalButtonsContainer: {
    flexDirection: isVerySmallScreen ? 'column' : 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 10,
  },
  resetButton: {
    padding: getResponsivePadding(12),
    backgroundColor: '#6c757d',
    borderRadius: 8,
    flex: isVerySmallScreen ? 0 : 1,
    minHeight: 44, // Better touch target
  },
  resetButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: getResponsiveFontSize(15),
    lineHeight: getResponsiveFontSize(18),
  },
  startButton: {
    padding: getResponsivePadding(12),
    backgroundColor: '#007AFF',
    borderRadius: 8,
    flex: isVerySmallScreen ? 0 : 1,
    minHeight: 44, // Better touch target
  },
  startButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: getResponsiveFontSize(15),
    lineHeight: getResponsiveFontSize(18),
  },
  cancelButton: {
    marginTop: 15,
    alignSelf: 'center',
    padding: 10,
    minHeight: 44, // Better touch target
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: getResponsiveFontSize(16),
    lineHeight: getResponsiveFontSize(19),
  },
});

export default styles;