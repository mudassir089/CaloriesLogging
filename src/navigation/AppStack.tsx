import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {HomeStackParamList} from './types';
import ManualScreen from '../screens/ManualScreen';
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import VoiceScreen from '../screens/VoiceScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import RecipeScreen from '../screens/RecipeScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const AppNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ManualScreen" component={ManualScreen} />
      <Stack.Screen name="VoiceScreen" component={VoiceScreen} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
      <Stack.Screen name="RecipeScreen" component={RecipeScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigation;
