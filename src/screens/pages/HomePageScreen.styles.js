import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },

  // Progress Section Styles
  progressSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 70,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },

  // Weekly Tracker Styles
  weeklyTrackerContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weeklyTrackerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  weeklyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
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
    fontSize: 12,
  },
  dayTextActive: {
    color: '#fff',
  },

  // Main Button Styles
  mainButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  mainButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  mainButtonSubtext: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },

  // Preview Container Styles
  previewContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },

  // History Section Styles
  historySection: {
    marginTop: 10,
  },
  historySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  clearButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  historyItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyGoal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  historyDate: {
    fontSize: 12,
    color: '#6c757d',
  },
  historyDetails: {
    marginBottom: 10,
  },
  historyDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  historyLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  historyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  historyBodyParts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  historyBodyPartChip: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  historyBodyPartText: {
    fontSize: 12,
    color: '#495057',
  },
  moreHistoryText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
    marginTop: 10,
  },

  // Motivation Card Styles
  motivationCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    marginVertical: 15,
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
    fontSize: 16,
    fontStyle: 'italic',
    color: '#495057',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,
  },
  selectedOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    color: '#2c3e50',
  },
  selectedOptionText: {
    color: 'white',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  resetButton: {
    padding: 12,
    backgroundColor: '#6c757d',
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  resetButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
  },
  startButton: {
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    flex: 1,
  },
  startButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 15,
    alignSelf: 'center',
    padding: 10,
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default styles;