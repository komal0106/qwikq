import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { CartProvider } from '@/context/CartContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <CartProvider>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="cart" options={{ presentation: 'modal' }} />
          <Stack.Screen name="payment" options={{ presentation: 'modal' }} />
        </Stack>
      </CartProvider>
    </ThemeProvider>
  );
}