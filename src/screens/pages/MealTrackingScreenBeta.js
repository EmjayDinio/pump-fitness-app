import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Svg, { Circle, Path, G, Text as SvgText } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');
const CALORIE_NINJAS_API_KEY = 'xDzK4Es7NP0bZzKHsd2Cgg==et5GnW8BwI0v68Tc';

// Circular Progress Component
const CircularProgress = ({ size = 80, strokeWidth = 8, progress = 0, color = '#4CAF50', backgroundColor = '#E8F5E8' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const center = size / 2;

  return (
    <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={backgroundColor}
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        fill="transparent"
      />
    </Svg>
  );
};

// Macro Distribution Chart Component
const MacroChart = ({ protein, carbs, fat, size = 120 }) => {
  const total = protein + carbs + fat;
  if (total === 0) return null;

  const center = size / 2;
  const radius = size / 2 - 10;
  
  const proteinAngle = (protein / total) * 360;
  const carbsAngle = (carbs / total) * 360;
  const fatAngle = (fat / total) * 360;

  const createArc = (startAngle, endAngle, color) => {
    const start = (startAngle * Math.PI) / 180;
    const end = (endAngle * Math.PI) / 180;
    
    const x1 = center + radius * Math.cos(start);
    const y1 = center + radius * Math.sin(start);
    const x2 = center + radius * Math.cos(end);
    const y2 = center + radius * Math.sin(end);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  let currentAngle = 0;
  const proteinPath = createArc(currentAngle, currentAngle + proteinAngle, '#2196F3');
  currentAngle += proteinAngle;
  const carbsPath = createArc(currentAngle, currentAngle + carbsAngle, '#FF9800');
  currentAngle += carbsAngle;
  const fatPath = createArc(currentAngle, currentAngle + fatAngle, '#9C27B0');

  return (
    <Svg width={size} height={size}>
      <Path d={proteinPath} fill="#2196F3" />
      <Path d={carbsPath} fill="#FF9800" />
      <Path d={fatPath} fill="#9C27B0" />
    </Svg>
  );
};

// Weekly Progress Chart Component (Simple Bar Chart)
const WeeklyChart = ({ data, width = screenWidth - 40, height = 100 }) => {
  const maxValue = Math.max(...data, 1);
  const barWidth = (width - 60) / 7;
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Weekly Calories</Text>
      <Svg width={width} height={height}>
        {data.map((value, index) => {
          const barHeight = (value / maxValue) * (height - 30);
          const x = 30 + index * barWidth + (barWidth - 20) / 2;
          const y = height - 20 - barHeight;
          
          return (
            <G key={index}>
              <Path
                d={`M ${x} ${height - 20} L ${x} ${y} L ${x + 20} ${y} L ${x + 20} ${height - 20} Z`}
                fill={index === 6 ? '#4CAF50' : '#E0E0E0'}
                rx={4}
              />
              <SvgText
                x={x + 10}
                y={height - 5}
                textAnchor="middle"
                fontSize="10"
                fill="#666"
              >
                {days[index]}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

export default function MealTrackingScreen({ navigation }) {
  const [dailyGoal] = useState({ calories: 2000, protein: 150, carbs: 250, fat: 67 });
  const [dailyTotals, setDailyTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [meals, setMeals] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  });
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('');
  const [foodQuery, setFoodQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [weeklyData] = useState([1850, 2100, 1950, 2200, 1800, 2000, dailyTotals.calories || 0]);

  // Load saved data on component mount
  useEffect(() => {
    loadSavedData();
  }, []);

  // Save data whenever meals change
  useEffect(() => {
    saveData();
    calculateDailyTotals();
  }, [meals]);

  const loadSavedData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const savedData = await AsyncStorage.getItem(`meals_${today}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setMeals(parsedData);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const saveData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem(`meals_${today}`, JSON.stringify(meals));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const calculateDailyTotals = () => {
    let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    Object.values(meals).forEach(mealFoods => {
      mealFoods.forEach(food => {
        totals.calories += food.calories || 0;
        totals.protein += food.protein_g || 0;
        totals.carbs += food.carbohydrates_total_g || 0;
        totals.fat += food.fat_total_g || 0;
      });
    });
    
    setDailyTotals(totals);
  };

  const fetchNutritionData = async (query) => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://api.calorieninjas.com/v1/nutrition', {
        headers: {
          'X-Api-Key': CALORIE_NINJAS_API_KEY
        },
        params: {
          query: query.trim()
        }
      });

      const nutritionData = response.data.items;
      if (nutritionData.length === 0) {
        Alert.alert('No Results', 'No nutrition data found. Try a different food name or be more specific (e.g., "1 large apple").');
        return;
      }

      return nutritionData[0];
    } catch (error) {
      console.error('Error fetching nutrition data:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to fetch nutrition data. Please check your internet connection and try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const addFoodToMeal = async () => {
    if (!foodQuery.trim()) {
      Alert.alert('Error', 'Please enter a food item');
      return;
    }

    const nutritionData = await fetchNutritionData(foodQuery);
    if (!nutritionData) return;

    const foodItem = {
      id: Date.now().toString(),
      name: nutritionData.name,
      calories: Math.round(nutritionData.calories || 0),
      protein_g: Math.round((nutritionData.protein_g || 0) * 10) / 10,
      carbohydrates_total_g: Math.round((nutritionData.carbohydrates_total_g || 0) * 10) / 10,
      fat_total_g: Math.round((nutritionData.fat_total_g || 0) * 10) / 10,
      fiber_g: Math.round((nutritionData.fiber_g || 0) * 10) / 10,
      sugar_g: Math.round((nutritionData.sugar_g || 0) * 10) / 10,
      sodium_mg: Math.round(nutritionData.sodium_mg || 0),
      timestamp: new Date().toISOString(),
    };

    setMeals(prev => ({
      ...prev,
      [selectedMealType]: [...prev[selectedMealType], foodItem]
    }));

    setFoodQuery('');
    setModalVisible(false);
  };

  const deleteFoodItem = (mealType, foodId) => {
    Alert.alert(
      'Delete Food Item',
      'Are you sure you want to delete this food item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMeals(prev => ({
              ...prev,
              [mealType]: prev[mealType].filter(food => food.id !== foodId)
            }));
          }
        }
      ]
    );
  };

  const editFoodItem = (mealType, food) => {
    setEditingFood({ mealType, food });
    setFoodQuery(food.name);
    setSelectedMealType(mealType);
    setModalVisible(true);
  };

  const updateFoodItem = async () => {
    if (!editingFood) return;

    const updatedNutritionData = await fetchNutritionData(foodQuery);
    if (!updatedNutritionData) return;

    const updatedFood = {
      ...editingFood.food,
      name: updatedNutritionData.name,
      calories: Math.round(updatedNutritionData.calories || 0),
      protein_g: Math.round((updatedNutritionData.protein_g || 0) * 10) / 10,
      carbohydrates_total_g: Math.round((updatedNutritionData.carbohydrates_total_g || 0) * 10) / 10,
      fat_total_g: Math.round((updatedNutritionData.fat_total_g || 0) * 10) / 10,
      fiber_g: Math.round((updatedNutritionData.fiber_g || 0) * 10) / 10,
      sugar_g: Math.round((updatedNutritionData.sugar_g || 0) * 10) / 10,
      sodium_mg: Math.round(updatedNutritionData.sodium_mg || 0),
    };

    setMeals(prev => ({
      ...prev,
      [editingFood.mealType]: prev[editingFood.mealType].map(food =>
        food.id === editingFood.food.id ? updatedFood : food
      )
    }));

    setEditingFood(null);
    setFoodQuery('');
    setModalVisible(false);
  };

  const openAddFoodModal = (mealType) => {
    setSelectedMealType(mealType);
    setEditingFood(null);
    setFoodQuery('');
    setModalVisible(true);
  };

  const getProgressPercentage = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getMealCalories = (mealType) => {
    return meals[mealType].reduce((total, food) => total + (food.calories || 0), 0);
  };

  const clearAllMeals = () => {
    Alert.alert(
      'Clear All Meals',
      'Are you sure you want to clear all meals for today? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setMeals({
              Breakfast: [],
              Lunch: [],
              Dinner: [],
              Snacks: [],
            });
          }
        }
      ]
    );
  };

  const mealIcons = {
    Breakfast: '🍳',
    Lunch: '🥗',
    Dinner: '🍽️',
    Snacks: '🍪'
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Modern Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Nutrition Tracker</Text>
          <Text style={styles.subtitle}>Today • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
        </View>
        <TouchableOpacity onPress={clearAllMeals} style={styles.clearButtonContainer}>
          <Text style={styles.clearButton}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Hero Card with Circular Progress */}
        <View style={styles.heroCard}>
          <View style={styles.progressSection}>
            <View style={styles.mainProgressContainer}>
              <CircularProgress
                size={120}
                strokeWidth={12}
                progress={getProgressPercentage(dailyTotals.calories, dailyGoal.calories)}
                color="#4CAF50"
                backgroundColor="#E8F5E8"
              />
              <View style={styles.progressTextContainer}>
                <Text style={styles.caloriesNumber}>{Math.round(dailyTotals.calories)}</Text>
                <Text style={styles.caloriesGoal}>/ {dailyGoal.calories}</Text>
                <Text style={styles.caloriesLabel}>kcal</Text>
              </View>
            </View>
            
            {/* Macro Circles */}
            <View style={styles.macroCircles}>
              <View style={styles.macroItem}>
                <CircularProgress
                  size={60}
                  strokeWidth={6}
                  progress={getProgressPercentage(dailyTotals.protein, dailyGoal.protein)}
                  color="#2196F3"
                  backgroundColor="#E3F2FD"
                />
                <View style={styles.macroTextContainer}>
                  <Text style={styles.macroNumber}>{Math.round(dailyTotals.protein)}</Text>
                  <Text style={styles.macroUnit}>g</Text>
                </View>
                <Text style={styles.macroLabel}>Protein</Text>
              </View>
              
              <View style={styles.macroItem}>
                <CircularProgress
                  size={60}
                  strokeWidth={6}
                  progress={getProgressPercentage(dailyTotals.carbs, dailyGoal.carbs)}
                  color="#FF9800"
                  backgroundColor="#FFF3E0"
                />
                <View style={styles.macroTextContainer}>
                  <Text style={styles.macroNumber}>{Math.round(dailyTotals.carbs)}</Text>
                  <Text style={styles.macroUnit}>g</Text>
                </View>
                <Text style={styles.macroLabel}>Carbs</Text>
              </View>
              
              <View style={styles.macroItem}>
                <CircularProgress
                  size={60}
                  strokeWidth={6}
                  progress={getProgressPercentage(dailyTotals.fat, dailyGoal.fat)}
                  color="#9C27B0"
                  backgroundColor="#F3E5F5"
                />
                <View style={styles.macroTextContainer}>
                  <Text style={styles.macroNumber}>{Math.round(dailyTotals.fat)}</Text>
                  <Text style={styles.macroUnit}>g</Text>
                </View>
                <Text style={styles.macroLabel}>Fat</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Weekly Progress Chart */}
        <View style={styles.weeklyCard}>
          <WeeklyChart data={[...weeklyData.slice(0, 6), dailyTotals.calories || 0]} />
        </View>

        {/* Macro Distribution */}
        {(dailyTotals.protein + dailyTotals.carbs + dailyTotals.fat) > 0 && (
          <View style={styles.macroDistributionCard}>
            <Text style={styles.cardTitle}>Macro Distribution</Text>
            <View style={styles.macroChartContainer}>
              <MacroChart
                protein={dailyTotals.protein}
                carbs={dailyTotals.carbs}
                fat={dailyTotals.fat}
                size={100}
              />
              <View style={styles.macroLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#2196F3' }]} />
                  <Text style={styles.legendText}>Protein {Math.round((dailyTotals.protein / (dailyTotals.protein + dailyTotals.carbs + dailyTotals.fat)) * 100)}%</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
                  <Text style={styles.legendText}>Carbs {Math.round((dailyTotals.carbs / (dailyTotals.protein + dailyTotals.carbs + dailyTotals.fat)) * 100)}%</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#9C27B0' }]} />
                  <Text style={styles.legendText}>Fat {Math.round((dailyTotals.fat / (dailyTotals.protein + dailyTotals.carbs + dailyTotals.fat)) * 100)}%</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Modern Meals Section */}
        <View style={styles.mealsSection}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          {Object.keys(meals).map((mealType) => (
            <View key={mealType} style={styles.modernMealCard}>
              <View style={styles.mealHeader}>
                <View style={styles.mealTitleContainer}>
                  <Text style={styles.mealIcon}>{mealIcons[mealType]}</Text>
                  <View>
                    <Text style={styles.mealType}>{mealType}</Text>
                    <Text style={styles.mealCalories}>{getMealCalories(mealType)} kcal</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.modernAddButton}
                  onPress={() => openAddFoodModal(mealType)}
                >
                  <Text style={styles.addIcon}>+</Text>
                </TouchableOpacity>
              </View>

              {meals[mealType].length === 0 ? (
                <View style={styles.emptyMealContainer}>
                  <Text style={styles.emptyMealText}>No foods added yet</Text>
                  <Text style={styles.emptyMealSubtext}>Tap + to add your first food</Text>
                </View>
              ) : (
                meals[mealType].map((food, index) => (
                  <View key={food.id} style={[styles.foodItem, index === meals[mealType].length - 1 && styles.lastFoodItem]}>
                    <View style={styles.foodInfo}>
                      <Text style={styles.foodName}>{food.name}</Text>
                      <View style={styles.foodNutritionRow}>
                        <View style={styles.nutritionBadge}>
                          <Text style={styles.nutritionBadgeText}>{food.calories} cal</Text>
                        </View>
                        <View style={[styles.nutritionBadge, { backgroundColor: '#E3F2FD' }]}>
                          <Text style={[styles.nutritionBadgeText, { color: '#2196F3' }]}>{food.protein_g}g P</Text>
                        </View>
                        <View style={[styles.nutritionBadge, { backgroundColor: '#FFF3E0' }]}>
                          <Text style={[styles.nutritionBadgeText, { color: '#FF9800' }]}>{food.carbohydrates_total_g}g C</Text>
                        </View>
                        <View style={[styles.nutritionBadge, { backgroundColor: '#F3E5F5' }]}>
                          <Text style={[styles.nutritionBadgeText, { color: '#9C27B0' }]}>{food.fat_total_g}g F</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.foodActions}>
                      <TouchableOpacity
                        onPress={() => editFoodItem(mealType, food)}
                        style={styles.editButton}
                      >
                        <Text style={styles.actionIcon}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => deleteFoodItem(mealType, food.id)}
                        style={styles.deleteButton}
                      >
                        <Text style={styles.actionIcon}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modern Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setEditingFood(null);
          setFoodQuery('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modernModalContent}>
            <View style={styles.modalHandle} />
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingFood ? 'Edit Food' : `Add to ${selectedMealType}`}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditingFood(null);
                  setFoodQuery('');
                }}
                style={styles.modernCloseButton}
              >
                <Text style={styles.closeIcon}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                What did you eat?
              </Text>
              <TextInput
                style={styles.modernFoodInput}
                placeholder="e.g., 1 medium banana, 100g grilled chicken"
                value={foodQuery}
                onChangeText={setFoodQuery}
                multiline={true}
                numberOfLines={2}
                placeholderTextColor="#999"
              />
              
              <TouchableOpacity
                style={[styles.modernAddFoodButton, isLoading && styles.disabledButton]}
                onPress={editingFood ? updateFoodItem : addFoodToMeal}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.addFoodButtonText}>
                    {editingFood ? 'Update Food' : 'Add Food'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.modernTipsContainer}>
              <Text style={styles.tipsTitle}>💡 Pro Tips</Text>
              <Text style={styles.tipsText}>• Include quantities (1 cup, 100g, 1 medium)</Text>
              <Text style={styles.tipsText}>• Be specific (grilled vs fried chicken)</Text>
              <Text style={styles.tipsText}>• Include cooking methods when relevant</Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 50, // Added top padding to move content lower
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#334155',
    fontSize: 20,
    fontWeight: '600',
  },
  headerCenter: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  clearButtonContainer: {
    width: 40,
    alignItems: 'center',
  },
  clearButton: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  progressSection: {
    alignItems: 'center',
  },
  mainProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  progressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caloriesNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  caloriesGoal: {
    fontSize: 14,
    color: '#64748b',
  },
  caloriesLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  macroCircles: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 12,
  },
  macroNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  macroUnit: {
    fontSize: 10,
    color: '#64748b',
  },
  macroLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
    fontWeight: '500',
  },
  weeklyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  macroDistributionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  macroChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  macroLegend: {
    flex: 1,
    marginLeft: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  mealsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
    marginLeft: 4,
  },
  modernMealCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: 'hidden',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  mealTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  mealType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  mealCalories: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  modernAddButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  addIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyMealContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyMealText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  emptyMealSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  lastFoodItem: {
    borderBottomWidth: 0,
  },
  foodInfo: {
    flex: 1,
    marginRight: 12,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    lineHeight: 20,
  },
  foodNutritionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  nutritionBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 4,
  },
  nutritionBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  foodActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modernModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 40,
    paddingHorizontal: 24,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  modernCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 20,
    color: '#64748b',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  modernFoodInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modernAddFoodButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },
  addFoodButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modernTipsContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
    lineHeight: 18,
  },
});