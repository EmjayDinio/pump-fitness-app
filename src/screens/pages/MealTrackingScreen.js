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
import { Platform } from 'react-native'

const { width: screenWidth } = Dimensions.get('window');
const CALORIE_NINJAS_API_KEY = 'xDzK4Es7NP0bZzKHsd2Cgg==et5GnW8BwI0v68Tc';

// Under Development Banner Component
const UnderDevelopmentBanner = () => (
  <View style={styles.devBanner}>
    <View style={styles.devBannerContent}>
      <Text style={styles.devBannerIcon}>🚧</Text>
      <View style={styles.devBannerTextContainer}>
        <Text style={styles.devBannerTitle}>Under Development</Text>
        <Text style={styles.devBannerSubtitle}>Some features may not work as expected</Text>
      </View>
    </View>
  </View>
);

// Development Notice Modal
const DevelopmentNoticeModal = ({ visible, onClose }) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.noticeModalOverlay}>
      <View style={styles.noticeModalContent}>
        <Text style={styles.noticeIcon}>⚠️</Text>
        <Text style={styles.noticeTitle}>Development Version</Text>
        <Text style={styles.noticeText}>
          This app is currently under development. Some features may be incomplete or temporarily unavailable:
        </Text>
        <View style={styles.noticeList}>
          <Text style={styles.noticeListItem}>• Nutrition data fetching</Text>
          <Text style={styles.noticeListItem}>• Data persistence</Text>
          <Text style={styles.noticeListItem}>• Real-time calculations</Text>
          <Text style={styles.noticeListItem}>• Chart accuracy</Text>
        </View>
        <TouchableOpacity style={styles.noticeButton} onPress={onClose}>
          <Text style={styles.noticeButtonText}>I Understand</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// Circular Progress Component with Dev Overlay
const CircularProgress = ({ size = 80, strokeWidth = 8, progress = 0, color = '#4CAF50', backgroundColor = '#E8F5E8' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const center = size / 2;

  return (
    <View style={styles.progressContainer}>
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
          opacity={0.6} // Dimmed for dev mode
        />
      </Svg>
      <View style={styles.devOverlay}>
        <Text style={styles.devOverlayText}>DEV</Text>
      </View>
    </View>
  );
};

// Macro Distribution Chart Component
const MacroChart = ({ protein, carbs, fat, size = 120 }) => {
  const total = protein + carbs + fat;
  if (total === 0) return (
    <View style={[styles.devPlaceholder, { width: size, height: size, borderRadius: size/2 }]}>
      <Text style={styles.devPlaceholderText}>Chart\nN/A</Text>
    </View>
  );

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
    <View style={styles.chartWithOverlay}>
      <Svg width={size} height={size} style={{ opacity: 0.6 }}>
        <Path d={proteinPath} fill="#2196F3" />
        <Path d={carbsPath} fill="#FF9800" />
        <Path d={fatPath} fill="#9C27B0" />
      </Svg>
      <View style={styles.chartDevOverlay}>
        <Text style={styles.chartDevText}>BETA</Text>
      </View>
    </View>
  );
};

// Weekly Progress Chart Component (Simple Bar Chart)
const WeeklyChart = ({ data, width = screenWidth - 40, height = 100 }) => {
  const maxValue = Math.max(...data, 1);
  const barWidth = (width - 60) / 7;
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartTitleContainer}>
        <Text style={styles.chartTitle}>Weekly Calories</Text>
        <View style={styles.devBadge}>
          <Text style={styles.devBadgeText}>PREVIEW</Text>
        </View>
      </View>
      <Svg width={width} height={height} style={{ opacity: 0.7 }}>
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
  const [showDevNotice, setShowDevNotice] = useState(false);

  // Show development notice on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDevNotice(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
    // Show development alert instead of making real API call
    Alert.alert(
      'Development Mode',
      'Nutrition API is currently disabled in development mode. Demo data will be used instead.',
      [{ text: 'OK' }]
    );
    
    setIsLoading(true);
    
    // Simulate API call with demo data
    setTimeout(() => {
      const demoData = {
        name: query.trim(),
        calories: Math.floor(Math.random() * 300) + 50,
        protein_g: Math.floor(Math.random() * 25) + 5,
        carbohydrates_total_g: Math.floor(Math.random() * 40) + 10,
        fat_total_g: Math.floor(Math.random() * 15) + 2,
        fiber_g: Math.floor(Math.random() * 8) + 1,
        sugar_g: Math.floor(Math.random() * 20) + 2,
        sodium_mg: Math.floor(Math.random() * 500) + 50,
      };
      
      setIsLoading(false);
      return demoData;
    }, 1500);
    
    return null;
  };

  const addFoodToMeal = async () => {
    if (!foodQuery.trim()) {
      Alert.alert('Error', 'Please enter a food item');
      return;
    }

    // Use demo data for development
    const foodItem = {
      id: Date.now().toString(),
      name: foodQuery.trim() + ' (Demo)',
      calories: Math.floor(Math.random() * 300) + 50,
      protein_g: Math.round((Math.random() * 25 + 5) * 10) / 10,
      carbohydrates_total_g: Math.round((Math.random() * 40 + 10) * 10) / 10,
      fat_total_g: Math.round((Math.random() * 15 + 2) * 10) / 10,
      fiber_g: Math.round((Math.random() * 8 + 1) * 10) / 10,
      sugar_g: Math.round((Math.random() * 20 + 2) * 10) / 10,
      sodium_mg: Math.floor(Math.random() * 500) + 50,
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
    Alert.alert(
      'Development Mode',
      'Edit functionality is currently disabled in development mode.',
      [{ text: 'OK' }]
    );
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
      {/* Development Notice Modal */}
      <DevelopmentNoticeModal 
        visible={showDevNotice} 
        onClose={() => setShowDevNotice(false)} 
      />

      {/* Under Development Banner */}
      <UnderDevelopmentBanner />

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
          <Text style={styles.subtitle}>Today • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • DEV</Text>
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
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Macro Distribution</Text>
              <View style={styles.devBadge}>
                <Text style={styles.devBadgeText}>BETA</Text>
              </View>
            </View>
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
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Today's Meals</Text>
            <View style={styles.devBadge}>
              <Text style={styles.devBadgeText}>DEMO DATA</Text>
            </View>
          </View>
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
                  <Text style={styles.emptyMealSubtext}>Tap + to add demo food</Text>
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
                        style={[styles.editButton, styles.disabledButton]}
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
                Add Demo Food to {selectedMealType}
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

            <View style={styles.devNoticeContainer}>
              <Text style={styles.devNoticeIcon}>⚠️</Text>
              <Text style={styles.devNoticeText}>
                Development Mode: Random demo data will be generated
              </Text>
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
                onPress={addFoodToMeal}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.addFoodButtonText}>
                    Add Demo Food
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.modernTipsContainer}>
              <Text style={styles.tipsTitle}>🚧 Development Notes</Text>
              <Text style={styles.tipsText}>• Real nutrition data is disabled</Text>
              <Text style={styles.tipsText}>• Random demo values will be generated</Text>
              <Text style={styles.tipsText}>• Edit functionality is temporarily disabled</Text>
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
  },
  
  // Development Banner Styles
  devBanner: {
    backgroundColor: '#FEF3C7',
    borderBottomWidth: 1,
    borderBottomColor: '#F59E0B',
  },
  devBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  devBannerIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  devBannerTextContainer: {
    flex: 1,
  },
  devBannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  devBannerSubtitle: {
    fontSize: 12,
    color: '#A16207',
    marginTop: 2,
  },

  // Development Notice Modal Styles
  noticeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noticeModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  noticeIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noticeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  noticeText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  noticeList: {
    alignSelf: 'stretch',
    marginBottom: 24,
  },
  noticeListItem: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 6,
    paddingLeft: 8,
  },
  noticeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  noticeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Development Overlay Styles
  progressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  devOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -8 }],
    backgroundColor: 'rgba(255, 193, 7, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  devOverlayText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000',
  },
  devPlaceholder: {
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  devPlaceholderText: {
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '500',
  },
  chartWithOverlay: {
    position: 'relative',
  },
  chartDevOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -8 }],
    backgroundColor: 'rgba(156, 39, 176, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  chartDevText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#fff',
  },
  devBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  devBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#92400E',
  },

  // Header Styles - Made responsive
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 44 : 12, // Account for status bar
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
    fontSize: 18,
    color: '#475569',
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  clearButtonContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  clearButton: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },

  // Main Scroll Container - Fixed for responsiveness
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100, // Extra bottom padding for safe area
  },

  // Hero Card Styles - Made responsive
  heroCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  progressSection: {
    alignItems: 'center',
  },
  mainProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    minHeight: 120,
  },
  progressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caloriesNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  caloriesGoal: {
    fontSize: 13,
    color: '#64748b',
  },
  caloriesLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  macroCircles: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    flexWrap: 'wrap',
  },
  macroItem: {
    alignItems: 'center',
    position: 'relative',
    minWidth: 60,
    marginBottom: 8,
  },
  macroTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 12,
  },
  macroNumber: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  macroUnit: {
    fontSize: 8,
    color: '#64748b',
  },
  macroLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 6,
    fontWeight: '500',
  },

  // Weekly Chart Styles - Made responsive
  weeklyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  chartContainer: {
    alignItems: 'center',
    width: '100%',
  },
  chartTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },

  // Macro Distribution Card - Made responsive
  macroDistributionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  macroChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  macroLegend: {
    flex: 1,
    marginLeft: 16,
    minWidth: 120,
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
    flex: 1,
  },

  // Meals Section Styles - Made responsive
  mealsSection: {
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  modernMealCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  mealTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mealIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
  },
  mealType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  mealCalories: {
    fontSize: 13,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyMealContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyMealText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  emptyMealSubtext: {
    fontSize: 12,
    color: '#cbd5e1',
    marginTop: 4,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 12,
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
    fontSize: 15,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 6,
  },
  foodNutritionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  nutritionBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 4,
    marginBottom: 3,
  },
  nutritionBadgeText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#475569',
  },
  foodActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 12,
  },

  // Modal Styles - Made responsive
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modernModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '85%',
    minHeight: 300,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
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
    fontSize: 18,
    color: '#64748b',
    fontWeight: 'bold',
  },
  devNoticeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  devNoticeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  devNoticeText: {
    fontSize: 13,
    color: '#92400E',
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  modernFoodInput: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1e293b',
    backgroundColor: '#fff',
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modernAddFoodButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
    marginTop: 8,
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
    paddingLeft: 8,
  },
});