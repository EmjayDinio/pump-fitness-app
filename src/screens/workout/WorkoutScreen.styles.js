import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30, // Increased bottom padding for better scrolling
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: Math.max(20, screenHeight * 0.06), // Dynamic top padding based on screen height
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: Math.min(28, screenWidth * 0.07), // Responsive font size
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
  },
  workoutStatus: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    marginHorizontal: 4, // Prevent edge clipping
  },
  statusText: {
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '600',
    color: '#856404',
    marginBottom: 4,
  },
  progressText: {
    fontSize: Math.min(14, screenWidth * 0.035),
    color: '#856404',
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap', // Allow wrapping on smaller screens
  },
  goalLabel: {
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '600',
    color: '#495057',
    marginRight: 8,
    marginBottom: 4, // Add margin for wrapped content
  },
  goalValue: {
    fontSize: Math.min(16, screenWidth * 0.04),
    color: '#007AFF',
    fontWeight: '500',
  },
  bodyPartsContainer: {
    marginBottom: 20,
  },
  bodyPartsLabel: {
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  bodyPartsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4, // Compensate for chip margins
  },
  bodyPartChip: {
    backgroundColor: '#e7f3ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4, // Horizontal margin instead of right-only
    marginBottom: 8,
    minWidth: 60, // Minimum width for consistency
  },
  bodyPartText: {
    fontSize: Math.min(14, screenWidth * 0.035),
    color: '#007AFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  mainStartButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4, // Prevent edge clipping
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainStartButtonText: {
    color: '#fff',
    fontSize: Math.min(18, screenWidth * 0.045),
    fontWeight: 'bold',
  },
  pauseButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    marginHorizontal: 4,
  },
  pauseButtonText: {
    color: '#212529',
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '600',
  },
  noSelectionContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  noSelectionText: {
    fontSize: Math.min(16, screenWidth * 0.04),
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 12,
  },
  selectGoalButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  selectGoalButtonText: {
    color: '#fff',
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  errorText: {
    fontSize: Math.min(16, screenWidth * 0.04),
    color: '#721c24',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '500',
  },
  exercisesContainer: {
    padding: 20,
  },
  exercisesTitle: {
    fontSize: Math.min(22, screenWidth * 0.055),
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  exercisesSubtitle: {
    fontSize: Math.min(16, screenWidth * 0.04),
    color: '#6c757d',
    marginBottom: 20,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 4, // Prevent edge clipping
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseHeader: {
    flexDirection: screenWidth < 350 ? 'column' : 'row', // Stack on very small screens
    justifyContent: 'space-between',
    alignItems: screenWidth < 350 ? 'flex-start' : 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: Math.min(18, screenWidth * 0.045),
    fontWeight: 'bold',
    color: '#212529',
    flex: screenWidth < 350 ? undefined : 1,
    marginRight: screenWidth < 350 ? 0 : 12,
    marginBottom: screenWidth < 350 ? 8 : 0,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: screenWidth < 350 ? 'flex-start' : 'center',
  },
  difficultyText: {
    color: '#fff',
    fontSize: Math.min(12, screenWidth * 0.03),
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  exerciseDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: screenWidth < 300 ? 'column' : 'row', // Stack on very small screens
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: Math.min(14, screenWidth * 0.035),
    fontWeight: '600',
    color: '#495057',
    width: screenWidth < 300 ? undefined : 100,
    marginBottom: screenWidth < 300 ? 2 : 0,
  },
  detailValue: {
    fontSize: Math.min(14, screenWidth * 0.035),
    color: '#212529',
    flex: screenWidth < 300 ? undefined : 1,
    textTransform: 'capitalize',
  },
  instructionsContainer: {
    marginTop: 8,
  },
  instructionsText: {
    fontSize: Math.min(14, screenWidth * 0.035),
    color: '#6c757d',
    lineHeight: 20,
    marginTop: 4,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '600',
  },
  noExercisesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 40,
    marginTop: 20, // Reduced from 50
  },
  noExercisesText: {
    fontSize: Math.min(18, screenWidth * 0.045),
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
  },
  // Modal Styles - Enhanced for responsiveness
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Math.max(15, screenHeight * 0.06), // Dynamic top padding
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  timerContainer: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80, // Ensure consistent width
  },
  timerText: {
    color: '#fff',
    fontSize: Math.min(18, screenWidth * 0.045),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6c757d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  exerciseCounter: {
    backgroundColor: '#e7f3ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  counterText: {
    fontSize: Math.min(16, screenWidth * 0.04),
    color: '#007AFF',
    fontWeight: '600',
  },
  modalExerciseName: {
    fontSize: Math.min(28, screenWidth * 0.07),
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 10, // Prevent text cutoff
  },
  modalExerciseInfo: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: screenWidth < 300 ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: screenWidth < 300 ? 'flex-start' : 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  infoLabel: {
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '600',
    color: '#495057',
    marginBottom: screenWidth < 300 ? 4 : 0,
  },
  infoValue: {
    fontSize: Math.min(16, screenWidth * 0.04),
    color: '#212529',
    textTransform: 'capitalize',
  },
  instructionsSection: {
    marginBottom: 30,
  },
  instructionsTitle: {
    fontSize: Math.min(20, screenWidth * 0.05),
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 12,
  },
  modalInstructions: {
    fontSize: Math.min(16, screenWidth * 0.04),
    color: '#495057',
    lineHeight: 24,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
  },
  workoutControls: {
    flexDirection: screenWidth < 350 ? 'column' : 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: screenWidth < 350 ? 12 : 0,
  },
  skipButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: screenWidth < 350 ? undefined : 0.3,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#fff',
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: screenWidth < 350 ? undefined : 0.65,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '600',
    textAlign: 'center',
  },
  finishWorkoutButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#e0a800',
  },
  finishWorkoutButtonText: {
    color: '#212529',
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '600',
  },
});

export default styles;