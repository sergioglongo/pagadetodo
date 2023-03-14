import React, {useEffect, useState} from 'react';
import {Platform, StatusBar} from 'react-native';
// import {useFonts} from 'expo-font';
// import { SplashScreen } from 'expo-splash-screen';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import * as Font from 'expo-font';
import { ASSETS } from '../constants/theme';

import Menu from './Menu';
import {useData, ThemeProvider, TranslationProvider} from '../hooks';

export default () => {
  const {isDark, theme, setTheme} = useData();

  /* set the status bar based on isDark constant */
  useEffect(() => {
    Platform.OS === 'android' && StatusBar.setTranslucent(true);
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    return () => {
      StatusBar.setBarStyle('default');
    };
  }, [isDark]);

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'OpenSans-Light': ASSETS.OpenSansLight,
        'OpenSans-Regular': ASSETS.OpenSansRegular,
        'OpenSans-SemiBold': ASSETS.OpenSansSemiBold,
        'OpenSans-ExtraBold': ASSETS.OpenSansExtraBold,
        'OpenSans-Bold': ASSETS.OpenSansBold,
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  const navigationTheme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      border: 'rgba(0,0,0,0)',
      text: String(theme.colors.text),
      card: String(theme.colors.card),
      primary: String(theme.colors.primary),
      notification: String(theme.colors.primary),
      background: String(theme.colors.background),
    },
  };

  return (
    <TranslationProvider>
      <ThemeProvider theme={theme} setTheme={setTheme}>
        <NavigationContainer theme={navigationTheme}>
          <Menu />
        </NavigationContainer>
      </ThemeProvider>
    </TranslationProvider>
  );
};
