import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigation from './src/navigation/AppStack';
import {MealLogProvider} from './src/context/MealLoagContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <MealLogProvider>
          <AppNavigation />
        </MealLogProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
