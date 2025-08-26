import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type HomeStackParamList = {
  WelcomeScreen: undefined;
  HomeScreen: undefined;
  ManualScreen: undefined;
  CameraScreen: undefined;
  VoiceScreen: undefined;
  RecipeScreen: {
    product: {
      name: string;
      image: string;
      calories: number;
      protein: number;
      carbs: number;
    }
  };
};

export type HomeStackProps<Screen extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, Screen>;
