import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../utils/colors';
import {widthPercentage, heightPercentage} from '../utils/constants';
import Background from '../components/Background';
import {HomeStackProps} from '../navigation/types';
import {useMealLog} from '../context/MealLoagContext';
import Voice from '@react-native-voice/voice';
import {analyzeMealWithOpenAI} from '../utils/analyzeMeal';

const VoiceScreen: React.FC<HomeStackProps<'VoiceScreen'>> = ({navigation}) => {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const {addLog, currentMealType} = useMealLog();

  const startRecording = async () => {
    setTranscript('');
    setRecording(true);
    try {
      await Voice.start('en-US');
    } catch (e) {
      setRecording(false);
      Alert.alert('Error', 'Microphone not available');
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
    } catch (e) {
      setRecording(false);
      Alert.alert('Error', 'Could not stop recording');
    }
  };

  const handleSend = useCallback(async () => {
    if (!transcript.trim || !currentMealType) return;
    setLoading(true);
    try {
      const macros = await analyzeMealWithOpenAI(transcript);
      if ('error' in macros) {
        Alert.alert('Error', macros.error);
        return;
      }
      addLog({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        input: transcript,
        mealType: currentMealType,
        ...macros,
      });

      navigation.navigate('HomeScreen');
    } catch (e) {
      Alert.alert('Error', 'Failed to analyze meal.');
    } finally {
      setLoading(false);
      setTranscript('');
      setRecording(false);
    }
  }, [addLog, navigation, transcript, currentMealType]);

  useEffect(() => {
    Voice.onSpeechResults = e => {
      const text = e.value?.[0] || '';
      setTranscript(text);
    };
    Voice.onSpeechError = () => {
      setRecording(false);
      Alert.alert('Error', 'Could not recognize speech');
    };
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return (
    <Background>
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          <Icon
            onPress={() => navigation.goBack()}
            color={COLORS.black}
            name={'arrow-left'}
            size={28}
          />
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Voice Input</Text>
            <Text style={styles.subHeader}>
              Speak your meal aloud — we’ll convert your voice to text and
              analyze it for calories and macros.
            </Text>
          </View>
          <TextInput
            style={styles.transcriptInput}
            value={transcript}
            onChangeText={setTranscript}
            placeholder="Your meal will appear here..."
            multiline
            editable={!loading}
            textAlignVertical="top"
          />
          {loading ? (
            <View style={styles.micBtn}>
              <ActivityIndicator color={COLORS.white} size="large" />
            </View>
          ) : recording ? (
            <TouchableOpacity
              style={styles.micBtn}
              activeOpacity={0.7}
              onPress={stopRecording}
              disabled={loading}>
              <Icon
                name="stop-circle-outline"
                color={COLORS.white}
                size={widthPercentage(18)}
              />
            </TouchableOpacity>
          ) : transcript ? (
            <TouchableOpacity
              style={styles.micBtn}
              activeOpacity={0.7}
              onPress={handleSend}
              disabled={loading}>
              <Icon
                name="send"
                color={COLORS.white}
                size={widthPercentage(18)}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.micBtn}
              activeOpacity={0.7}
              onPress={startRecording}
              disabled={loading}>
              <Icon
                name="microphone"
                color={COLORS.white}
                size={widthPercentage(18)}
              />
            </TouchableOpacity>
          )}
          <View style={styles.infoContainer}>
            <Text style={styles.infoIcon}>ⓘ</Text>
            <Text style={styles.infoText}>
              Use your voice to describe your meal. We'll handle the rest
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
};

export default VoiceScreen;

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
    marginBottom: heightPercentage(8),
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
  micBtn: {
    width: widthPercentage(50),
    height: widthPercentage(50),
    borderRadius: widthPercentage(25),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: heightPercentage(8),
    shadowColor: COLORS.primary,
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
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
    flex: 1,
  },
  transcriptText: {
    fontSize: heightPercentage(1.9),
    color: COLORS.grey,
    textAlign: 'center',
    flex: 1,
  },
  transcriptInput: {
    minHeight: heightPercentage(10),
    maxHeight: heightPercentage(20),
    borderRadius: widthPercentage(3),
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
    color: COLORS.dark,
    fontSize: heightPercentage(2),
    padding: widthPercentage(3),
    marginBottom: heightPercentage(5),
    textAlignVertical: 'top',
  },
});
