import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS} from '../utils/colors';
import {
  widthPercentage,
  heightPercentage,
  CALORIE_GOAL,
} from '../utils/constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CircularProgress from '../assets/Svg/CircularProgress';

type Macro = {
  value: number;
  max: number;
  color: string;
  label: string;
  emoji: string;
};

type Props = {
  selectedDate: Date;
  isToday: boolean;
  kcalEaten: number;
  kcalLeft: number;
  macros: Macro[];
  onPrevDate: () => void;
  onNextDate: () => void;
};

const SummaryCard: React.FC<Props> = ({
  selectedDate,
  isToday,
  kcalEaten,
  kcalLeft,
  macros,
  onPrevDate,
  onNextDate,
}) => (
  <View style={styles.card}>
    <View style={styles.headerRow}>
      <TouchableOpacity onPress={onPrevDate}>
        <Icon color={COLORS.grey} name={'chevron-left'} size={28} />
      </TouchableOpacity>
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{selectedDate.toDateString()}</Text>
        <Icon
          style={styles.calendar}
          color={COLORS.black}
          name={'calendar-month-outline'}
          size={20}
        />
      </View>
      <TouchableOpacity disabled={isToday} onPress={onNextDate}>
        <Icon
          color={isToday ? COLORS.border : COLORS.grey}
          name={'chevron-right'}
          size={28}
        />
      </TouchableOpacity>
    </View>

    <View style={styles.kcalRow}>
      <View style={styles.kcalCol}>
        <Text style={styles.kcalLabel}>🥗 Eaten</Text>
        <Text style={styles.kcalValue}>{kcalEaten}</Text>
        <Text style={styles.kcalUnit}>Kcal</Text>
      </View>
      <View style={styles.kcalCircleCol}>
        <View style={styles.circleWrapper}>
          <View style={styles.circleBg}>
            <CircularProgress
              size={widthPercentage(32)}
              strokeWidth={widthPercentage(2.5)}
              progress={Math.min(kcalEaten / CALORIE_GOAL, 1)}
              color={COLORS.primary}
            />
            <View style={styles.circleCenter}>
              <Text style={styles.circleText}>{CALORIE_GOAL}</Text>
              <Text style={styles.circleSub}>Total Calories</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.kcalCol}>
        <Text style={styles.kcalLabel}>🔥 Kcal left</Text>
        <Text style={styles.kcalValue}>{kcalLeft}</Text>
        <Text style={styles.kcalUnit}>Kcal</Text>
      </View>
    </View>

    <View style={styles.divider} />

    <Text style={styles.eatenLabel}>Eaten</Text>
    <View style={styles.macrosRow}>
      {macros.map((macro, idx) => (
        <View key={idx} style={styles.macroCol}>
          <View style={styles.macroCircleWrapper}>
            <CircularProgress
              size={widthPercentage(20)}
              strokeWidth={widthPercentage(2)}
              progress={Math.min(macro.value / macro.max, 1)}
              color={macro.color}
            />
            <View style={styles.macroCircleCenter}>
              <Text style={styles.macroValue}>{macro.value.toFixed(1)}</Text>
              <Text style={styles.macroMax}>/ {macro.max} g</Text>
            </View>
          </View>
          <Text style={styles.macroLabel}>
            {macro.label} <Text style={styles.macroEmoji}>{macro.emoji}</Text>
          </Text>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: widthPercentage(5),
    padding: widthPercentage(5),
    marginTop: heightPercentage(2),
    shadowColor: COLORS.black,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: heightPercentage(2.5),
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  date: {
    fontSize: heightPercentage(2.2),
    fontWeight: '700',
    color: COLORS.dark,
    textAlign: 'center',
  },
  calendar: {
    marginHorizontal: widthPercentage(2),
  },
  kcalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kcalCol: {
    alignItems: 'center',
    flex: 1,
  },
  kcalLabel: {
    fontSize: heightPercentage(1.7),
    color: COLORS.grey,
    marginBottom: heightPercentage(0.5),
  },
  kcalValue: {
    fontSize: heightPercentage(2.8),
    fontWeight: '700',
    color: COLORS.dark,
  },
  kcalUnit: {
    fontSize: heightPercentage(1.5),
    color: COLORS.grey,
    marginTop: heightPercentage(0.2),
  },
  kcalCircleCol: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBg: {
    width: widthPercentage(32),
    height: widthPercentage(32),
    borderRadius: widthPercentage(16),
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circleCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: widthPercentage(32),
    height: widthPercentage(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText: {
    fontSize: heightPercentage(3.2),
    fontWeight: '700',
    color: COLORS.dark,
    zIndex: 2,
  },
  circleSub: {
    fontSize: heightPercentage(1.5),
    color: COLORS.grey,
    marginTop: heightPercentage(0.5),
    zIndex: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: heightPercentage(2.5),
    width: '100%',
  },
  eatenLabel: {
    fontSize: heightPercentage(1.7),
    color: COLORS.grey,
    marginBottom: heightPercentage(2),
    fontWeight: '600',
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: heightPercentage(1),
  },
  macroCol: {
    alignItems: 'center',
    flex: 1,
  },
  macroCircleWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: heightPercentage(1),
  },
  macroCircleCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: widthPercentage(20),
    height: widthPercentage(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroValue: {
    fontSize: heightPercentage(2.1),
    fontWeight: '700',
    color: COLORS.dark,
  },
  macroMax: {
    fontSize: heightPercentage(1.3),
    color: COLORS.grey,
  },
  macroLabel: {
    fontSize: heightPercentage(1.5),
    color: COLORS.grey,
    marginTop: heightPercentage(0.5),
    textAlign: 'center',
  },
  macroEmoji: {
    fontSize: heightPercentage(1.5),
  },
});

export default SummaryCard;
