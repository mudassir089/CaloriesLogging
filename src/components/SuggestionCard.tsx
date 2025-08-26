import React, {useCallback, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {COLORS} from '../utils/colors';
import {
  widthPercentage,
  heightPercentage,
  mealTypes,
  MEAL_CALORIE_GOALS,
} from '../utils/constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {MealLog, MealType} from '../context/MealLoagContext';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import MealItemsBottomSheet from './MealItemsBottomSheet';

type Props = {
  selectedDate: Date;
  isToday: boolean;
  getMealLogForDate: (mealType: MealType, date: Date) => any;
  setCurrentMealType: (type: MealType) => void;
  handlePresentModalPress: () => void;
};

const SuggestionsCard: React.FC<Props> = ({
  selectedDate,
  isToday,
  getMealLogForDate,
  setCurrentMealType,
  handlePresentModalPress,
}) => {
  const [selectedMealLog, setSelectedMealLog] = useState<MealLog | null>(null);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentMealModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <View style={styles.suggestionsCard}>
      <View style={styles.suggestionsHeader}>
        <Text style={styles.suggestionsTitle}>Daily Meals</Text>
      </View>
      {mealTypes.map(meal => {
        const log = getMealLogForDate(meal.key as MealType, selectedDate);
        const mealGoal =
          MEAL_CALORIE_GOALS[meal.key as keyof typeof MEAL_CALORIE_GOALS];
        const mealCalories = log ? Number(log.calories) : 0;
        const progress = Math.min(mealCalories / mealGoal, 1);
        const isFull = mealCalories >= mealGoal;
        return (
          <TouchableOpacity
            key={meal.key}
            onPress={() => {
              const selectedItem = getMealLogForDate(
                meal.key as MealType,
                selectedDate,
              );
              setSelectedMealLog({...selectedItem, mealType: meal.label});
              handlePresentMealModalPress();
            }}>
            <View style={styles.suggestionRow}>
              <Image source={meal.image} style={styles.suggestionImg} />
              <View style={styles.suggestionInfo}>
                <Text style={styles.suggestionMeal}>{meal.label}</Text>
                <View
                  style={[
                    styles.suggestionBarBg,
                    {width: isFull ? widthPercentage(55) : widthPercentage(55)},
                  ]}>
                  <View
                    style={[
                      styles.suggestionBarFill,
                      {
                        width: `${progress * 100}%`,
                        backgroundColor: COLORS.primary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.suggestionKcalContainer}>
                  <Text style={styles.suggestionKcal}>
                    {mealCalories} / {mealGoal} Kcal
                  </Text>
                  {isFull && (
                    <View style={styles.suggestionKcalIcon}>
                      <Icon
                        name={'check'}
                        size={widthPercentage(2.7)}
                        color={COLORS.white}
                      />
                    </View>
                  )}
                </View>
              </View>
              {isToday && !isFull && (
                <TouchableOpacity
                  onPress={() => {
                    setCurrentMealType(meal.key as MealType);
                    handlePresentModalPress();
                  }}
                  disabled={isFull}
                  style={styles.suggestionAddBtn}>
                  <Icon
                    name={isFull ? 'check' : 'plus'}
                    size={widthPercentage(5)}
                    color={COLORS.white}
                  />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
      <MealItemsBottomSheet
        selectedMealLog={selectedMealLog}
        ref={bottomSheetModalRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  suggestionsCard: {
    backgroundColor: COLORS.white,
    borderRadius: widthPercentage(5),
    padding: widthPercentage(5),
    marginTop: heightPercentage(3),
    shadowColor: COLORS.black,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightPercentage(2.5),
  },
  suggestionsTitle: {
    fontSize: heightPercentage(2.2),
    fontWeight: 'bold',
    color: COLORS.dark,
    flex: 1,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightPercentage(2),
  },
  suggestionImg: {
    width: widthPercentage(13),
    height: widthPercentage(13),
    marginRight: widthPercentage(3),
    borderRadius: widthPercentage(6.5),
    backgroundColor: COLORS.bg,
  },
  suggestionInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  suggestionMeal: {
    fontSize: heightPercentage(2),
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  suggestionBarBg: {
    height: heightPercentage(1),
    borderRadius: widthPercentage(1),
    backgroundColor: COLORS.border2,
    marginVertical: heightPercentage(0.7),
    overflow: 'hidden',
  },
  suggestionBarFill: {
    height: heightPercentage(1),
    borderRadius: widthPercentage(1),
  },
  suggestionKcalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPercentage(1),
  },
  suggestionKcal: {
    fontSize: heightPercentage(1.7),
    color: COLORS.grey,
    fontWeight: '600',
  },
  suggestionKcalIcon: {
    width: widthPercentage(4),
    height: widthPercentage(4),
    borderRadius: widthPercentage(2),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionAddBtn: {
    width: widthPercentage(7),
    height: widthPercentage(7),
    borderRadius: widthPercentage(7 / 2),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: widthPercentage(2),
  },
});

export default SuggestionsCard;
