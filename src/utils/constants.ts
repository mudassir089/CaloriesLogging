import {Dimensions} from 'react-native';
import { COLORS } from './colors';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const widthPercentage = (percentageValue: number) =>
  (width / 100) * percentageValue;
export const heightPercentage = (percentageValue: number) =>
  (height / 100) * percentageValue;
export const isSmallDevice = width <= 375 || height <= 667;

export const LOG_OPTIONS = [
  {
    image: require('../assets/images/camera.png'),
    title: 'Take or Upload a Photo',
    desc: 'Snap a picture of your meal, barcode, or menu.',
    navigate: 'CameraScreen',
  },
  {
    image: require('../assets/images/manual.png'),
    title: 'Type Manually',
    desc: 'Write what you ate — like Grilled Chicken with Rice.',
    navigate: 'ManualScreen',
  },
  {
    image: require('../assets/images/voice.png'),
    title: 'Speak It',
    desc: 'Tell us what you ate and we’ll transcribe it for you.',
    navigate: 'VoiceScreen',
  },
];

export const mealTypes = [
  {
    key: 'breakfast',
    label: 'Breakfast',
    image: require('../assets/images/breakfast.png'),
    goal: 128,
  },
  {
    key: 'lunch',
    label: 'Lunch',
    image: require('../assets/images/lunch.png'),
    goal: 228,
  },
  {
    key: 'dinner',
    label: 'Dinner',
    image: require('../assets/images/dinner.png'),
    goal: 228,
  },
  {
    key: 'snacks',
    label: 'Snacks',
    image: require('../assets/images/snacks.png'),
    goal: 100,
  },
];

export const CALORIE_GOAL = 2500;
export const PROTEIN_GOAL = 150;
export const CARBS_GOAL = 250;
export const FAT_GOAL = 65;

export const MEAL_CALORIE_GOALS = {
  breakfast: 500,
  lunch: 800,
  dinner: 900,
  snacks: 300,
};

export const macroChips: {
  key: 'calories' | 'protein' | 'carbs' | 'fat';
  label: string;
  icon: string;
  color: string;
  bg: string;
}[] = [
  {
    key: 'calories',
    label: 'Kcal',
    icon: 'fire',
    color: COLORS.primary,
    bg: COLORS.primary + '22',
  },
  {
    key: 'protein',
    label: 'Protein',
    icon: 'food-drumstick',
    color: COLORS.red,
    bg: COLORS.red + '22',
  },
  {
    key: 'carbs',
    label: 'Carbs',
    icon: 'grain',
    color: COLORS.orange,
    bg: COLORS.orange + '22',
  },
  {
    key: 'fat',
    label: 'Fat',
    icon: 'cheese',
    color: COLORS.blue,
    bg: COLORS.blue + '22',
  },
];
