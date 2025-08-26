import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { COLORS } from '../utils/colors';
import {
  widthPercentage,
  heightPercentage,
  PROTEIN_GOAL,
  CARBS_GOAL,
  FAT_GOAL,
  CALORIE_GOAL,
} from '../utils/constants';
import Background from '../components/Background';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HomeStackProps } from '../navigation/types';
import { useMealLog } from '../context/MealLoagContext';
import CategoryBottomSheet from '../components/CategoryBottomSheet';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import SummaryCard from '../components/SummaryCard';
import SuggestionsCard from '../components/SuggestionCard';

const HomeScreen: React.FC<HomeStackProps<'HomeScreen'>> = ({ navigation, route }) => {
  const { setCurrentMealType, getMealLogForDate, getMacrosTotalForDate } =
    useMealLog();
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const selectedDateStr = selectedDate.toISOString().slice(0, 10);
  const isToday = selectedDateStr === new Date().toISOString().slice(0, 10);
  const total = getMacrosTotalForDate(selectedDate);
  const kcalEaten = total.calories;
  const kcalLeft = Math.max(CALORIE_GOAL - kcalEaten, 0);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const macros = [
    {
      value: total.protein,
      max: PROTEIN_GOAL,
      color: '#F25C5C',
      label: 'Protein',
      emoji: '🍗',
    },
    {
      value: total.carbs,
      max: CARBS_GOAL,
      color: '#FFA726',
      label: 'Carbs',
      emoji: '🍚',
    },
    {
      value: total.fat,
      max: FAT_GOAL,
      color: '#42A5F5',
      label: 'Fat',
      emoji: '🧀',
    },
  ];

  return (
    <BottomSheetModalProvider>
      <Background>
        <View style={styles.greenBg} />
        <View style={styles.container}>
          <View style={styles.profileContainer}>
            <Text style={styles.title}>FAT BURNER</Text>
            <Icon color={COLORS.white} name={'account-circle'} size={28} />
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            <SummaryCard
              selectedDate={selectedDate}
              isToday={isToday}
              kcalEaten={kcalEaten}
              kcalLeft={kcalLeft}
              macros={macros}
              onPrevDate={() =>
                setSelectedDate(prev => {
                  const d = new Date(prev);
                  d.setDate(d.getDate() - 1);
                  return d;
                })
              }
              onNextDate={() => {
                if (!isToday) {
                  setSelectedDate(prev => {
                    const d = new Date(prev);
                    d.setDate(d.getDate() + 1);
                    return d;
                  });
                }
              }}
            />
            <SuggestionsCard
              selectedDate={selectedDate}
              isToday={isToday}
              getMealLogForDate={getMealLogForDate}
              setCurrentMealType={setCurrentMealType}
              handlePresentModalPress={handlePresentModalPress}
            />
          </ScrollView>
        </View>
        <CategoryBottomSheet
          ref={bottomSheetModalRef}
          navigation={navigation}
        />
      </Background>
    </BottomSheetModalProvider>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: heightPercentage(5),
  },
  scrollContent: {
    paddingHorizontal: widthPercentage(4),
    paddingBottom: heightPercentage(5),
    zIndex: 1,
  },
  greenBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: heightPercentage(100) * 0.4,
    backgroundColor: COLORS.primary,
    zIndex: 0,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: heightPercentage(2),
    paddingBlock: heightPercentage(1),
    paddingHorizontal: widthPercentage(4),
    zIndex: 2,
  },

  title: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.white,
    fontSize: heightPercentage(3),
    fontWeight: 'bold',
  },
});
