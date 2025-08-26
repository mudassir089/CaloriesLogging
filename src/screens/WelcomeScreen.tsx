import React, {useEffect} from 'react';
import {StyleSheet, Text, View, Image, SafeAreaView} from 'react-native';
import {COLORS} from '../utils/colors';
import {widthPercentage, heightPercentage} from '../utils/constants';
import Background from '../components/Background';
import {HomeStackProps} from '../navigation/types';

const WelcomeScreen: React.FC<HomeStackProps<'WelcomeScreen'>> = ({
  navigation,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('HomeScreen');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Background>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.title}>
            Welcome to <Text style={styles.brand}>Fat Burner AI</Text>
          </Text>
          <Text style={styles.subtitle}>
            Your smart food tracker that helps you stay on top{'\n'}
            of your calories and macros powered by AI.
          </Text>
          <View style={styles.plateCircle}>
            <Image
              source={require('../assets/images/plate.png')}
              style={styles.plateImg}
              resizeMode="contain"
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoIcon}>ⓘ</Text>
            <Text style={styles.infoText}>
              Tap the plate icon below to log your meal. Use{'\n'}Photo, Text,
              or Voice.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </Background>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: widthPercentage(8),
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: heightPercentage(3.2),
    fontWeight: 'bold',
    color: COLORS.dark,
    marginTop: heightPercentage(8),
    marginBottom: heightPercentage(2),
    textAlign: 'center',
  },
  brand: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: heightPercentage(1.8),
    color: COLORS.grey,
    textAlign: 'center',
    marginBottom: heightPercentage(6),
  },
  plateCircle: {
    width: widthPercentage(65),
    height: widthPercentage(65),
    borderRadius: widthPercentage(32.5),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: heightPercentage(6),
    marginBottom: heightPercentage(6),
    shadowColor: COLORS.primary,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  plateImg: {
    width: widthPercentage(40),
    height: widthPercentage(40),
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: heightPercentage(4),
    left: widthPercentage(6),
    right: widthPercentage(6),
    gap: widthPercentage(1.5),
  },
  infoIcon: {
    fontSize: heightPercentage(1.7),
    color: COLORS.grey,
  },
  infoText: {
    fontSize: heightPercentage(1.7),
    color: COLORS.grey,
    textAlign: 'center',
  },
});
