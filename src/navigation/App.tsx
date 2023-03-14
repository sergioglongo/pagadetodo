import React, { useEffect, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Menu from './Menu';
import { useData, ThemeProvider, TranslationProvider } from '../hooks';
import { Login } from '../screens';


const Stack = createStackNavigator()

export default () => {
  const { isDark, theme, setTheme } = useData();

  const [logged, setlogged] = useState(false)

  const getAuth = async () => {
     if (false) {
        setlogged(true)
      }
      else {
        setlogged(false)
      }
  }

  useEffect(() => {
    getAuth()
  }, [logged])

  /* set the status bar based on isDark constant */
  useEffect(() => {
    Platform.OS === 'android' && StatusBar.setTranslucent(true);
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    return () => {
      StatusBar.setBarStyle('default');
    };
  }, [isDark]);

  // load custom fonts
  const [fontsLoaded] = useFonts({
    'OpenSans-Light': theme.assets.OpenSansLight,
    'OpenSans-Regular': theme.assets.OpenSansRegular,
    'OpenSans-SemiBold': theme.assets.OpenSansSemiBold,
    'OpenSans-ExtraBold': theme.assets.OpenSansExtraBold,
    'OpenSans-Bold': theme.assets.OpenSansBold,
  });

  if (!fontsLoaded) {
    return null;
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
          <Stack.Navigator>
            {logged ?
              <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
              :
              <>
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                {/* <Stack.Screen
        name="ResetPasword"
        component={ResetPasword}
        options={{ headerShown: false }}
      /> */}
                <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
              </>
            }
          </Stack.Navigator>
          {/* <Menu /> */}
        </NavigationContainer>
      </ThemeProvider>
    </TranslationProvider>
  );
};
