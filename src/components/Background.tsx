import React, { PropsWithChildren } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

const bgImage = require('../assets/images/background.png');

const Background = ({ children }: PropsWithChildren) => (
  <ImageBackground source={bgImage} style={styles.bg} resizeMode="cover">
    {children}
  </ImageBackground>
);

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default Background;
