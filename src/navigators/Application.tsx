import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Example, LoginScreen, Timeline, RegisterScreen } from "@/screens";
import { useTheme } from "@/theme";

import type { RootStackParamList } from "@/types/navigation";
import OnboardingScreen from "@/screens/OnboardingScreen/OnboardingScreen";
import { useEffect, useState } from "react";
import { storage } from "@/App";
import AuthGuard from "@/components/template/AuthGuard/AuthGuard";
import UnauthenticatedGuard from "@/components/template/UnauthenticatedGuard/UnauthenticatedGuard";

const Stack = createStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  const { variant, navigationTheme } = useTheme();

  const [isAppFirstLaunched, setIsAppFirstLaunched] = useState(false);

  useEffect(() => {
    const appData = storage.contains("isAppFirstLaunched");
    if (!appData) {
      storage.set("isAppFirstLaunched", true);
      setIsAppFirstLaunched(true);
    } else {
      setIsAppFirstLaunched(false);
    }

    // AsyncStorage.removeItem('isAppFirstLaunched');
  }, []);

  return (
    <NavigationContainer theme={navigationTheme}>
      <AuthGuard>
        <Stack.Navigator
          initialRouteName="Timeline"
          key={variant}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Example" component={Example} />
          <Stack.Screen name="Timeline" component={Timeline} />
        </Stack.Navigator>
      </AuthGuard>
      <UnauthenticatedGuard>
        <Stack.Navigator key={variant} screenOptions={{ headerShown: false }}>
          {isAppFirstLaunched && (
            <Stack.Screen
              name="OnboardingScreen"
              component={OnboardingScreen}
            />
          )}
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        </Stack.Navigator>
      </UnauthenticatedGuard>
    </NavigationContainer>
  );
}

export default ApplicationNavigator;
