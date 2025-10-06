import { Aldrich_400Regular, useFonts } from '@expo-google-fonts/aldrich';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Animated as RNAnimated, Text as RNText, TextInput as RNTextInput } from 'react-native';
import 'react-native-reanimated';
import AnimatedReanimated from 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({ Aldrich_400Regular });

  useEffect(() => {
    if (!fontsLoaded) return;
    
    // Set default font family for all Text components
    const defaultTextStyle = { fontFamily: 'Aldrich_400Regular' };
    
    // Apply to React Native Text components
    RNText.defaultProps = {
      ...RNText.defaultProps,
      style: [defaultTextStyle, RNText.defaultProps?.style],
    };
    
    RNTextInput.defaultProps = {
      ...RNTextInput.defaultProps,
      style: [defaultTextStyle, RNTextInput.defaultProps?.style],
    };
    
    // Apply to Animated Text components
    if ((RNAnimated as any).Text) {
      (RNAnimated as any).Text.defaultProps = {
        ...(RNAnimated as any).Text.defaultProps,
        style: [defaultTextStyle, (RNAnimated as any).Text.defaultProps?.style],
      };
    }
    
    if ((AnimatedReanimated as any).Text) {
      (AnimatedReanimated as any).Text.defaultProps = {
        ...(AnimatedReanimated as any).Text.defaultProps,
        style: [defaultTextStyle, (AnimatedReanimated as any).Text.defaultProps?.style],
      };
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
               <Stack.Screen name="checkIn" options={{ headerShown: false }} />
               <Stack.Screen name="timeline" options={{ headerShown: false }} />
               <Stack.Screen name="countdown" options={{ headerShown: false }} />
               <Stack.Screen name="checkUp" options={{ headerShown: false }} />
               <Stack.Screen name="preFlight" options={{ headerShown: false }} />
               <Stack.Screen name="inFlight" options={{ headerShown: false }} />
               <Stack.Screen name="arrived" options={{ headerShown: false }} />
               <Stack.Screen name="muscleMaintenance" options={{ headerShown: false }} />
               <Stack.Screen name="eyeTraining" options={{ headerShown: false }} />
               <Stack.Screen name="accommodation" options={{ headerShown: false }} />
               <Stack.Screen name="miniGame" options={{ headerShown: false }} />
               <Stack.Screen name="movingLEO" options={{ headerShown: false }} />
               <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
