import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS} from '../utils/colors';
import {widthPercentage, heightPercentage} from '../utils/constants';
import Background from '../components/Background';
import {analyzeMealWithOpenAI} from '../utils/analyzeMeal';
import {useMealLog} from '../context/MealLoagContext';
import {HomeStackProps} from '../navigation/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ManualScreen: React.FC<HomeStackProps<'ManualScreen'>> = ({
  navigation,
}) => {
  const [value, setValue] = useState('Grilled Chicken with Rice');
  const [loading, setLoading] = useState(false);
  const {addLog, currentMealType} = useMealLog();
  const handleConfirm = async () => {
    if (!value.trim() || !currentMealType) return;
    setLoading(true);
    try {
      const macros = await analyzeMealWithOpenAI(value);
      if ('error' in macros) {
        Alert.alert('Error', macros.error);
        setLoading(false);
        return;
      }
      addLog({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        input: value,
        mealType: currentMealType,
        ...macros,
      });
      setLoading(false);
      navigation.navigate('HomeScreen');
    } catch (e) {
      setLoading(false);
      Alert.alert('Error', 'Failed to analyze meal.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Background>
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          <Icon
            onPress={() => navigation.goBack()}
            color={COLORS.black}
            name={'arrow-left'}
            size={28}
          />
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Type Manually</Text>
            <Text style={styles.subHeader}>
              Write what you ate — like Grilled Chicken with Rice.
            </Text>
          </View>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            placeholder="Grilled Chicken with Rice"
            placeholderTextColor={COLORS.grey}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleConfirm}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Confirm</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Background>
  );
};

export default ManualScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: widthPercentage(4),
  },
  headerContainer: {
    paddingTop: heightPercentage(5),
    marginBottom: heightPercentage(4),
    alignItems: 'center',
  },
  header: {
    fontSize: heightPercentage(3.2),
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: heightPercentage(1.5),
  },
  subHeader: {
    fontSize: heightPercentage(1.8),
    color: COLORS.grey,
    textAlign: 'center',
    marginHorizontal: widthPercentage(2),
  },
  input: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: widthPercentage(3),
    paddingVertical: heightPercentage(2.2),
    paddingHorizontal: widthPercentage(4),
    fontSize: heightPercentage(2.1),
    color: COLORS.dark,
    marginTop: heightPercentage(4),
    marginBottom: heightPercentage(2),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  button: {
    position: 'absolute',
    bottom: heightPercentage(2),
    left: widthPercentage(4),
    right: widthPercentage(4),
    backgroundColor: COLORS.primary,
    borderRadius: widthPercentage(3),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: heightPercentage(2.2),
  },
  buttonText: {
    color: COLORS.white,
    fontSize: heightPercentage(2.1),
    fontWeight: '600',
  },
});
