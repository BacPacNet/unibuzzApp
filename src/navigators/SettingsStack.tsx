import SettingsScreen from "@/screens/SettingsScreens/SettingScreen";
import UniversityVerificationScreen from "@/screens/SettingsScreens/UniversityVerificationScreen";
import { createStackNavigator } from "@react-navigation/stack";

const SettingsStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
        name="UniversityVerification"
        component={UniversityVerificationScreen}
      />
    </Stack.Navigator>
  );
};

export default SettingsStack;
