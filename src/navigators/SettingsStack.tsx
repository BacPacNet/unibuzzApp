import UserAccountDeactivationScreen from "@/screens/SettingsScreens/AccountDeactivationScreen";
import BlockUsersScreen from "@/screens/SettingsScreens/BlockUsersScreen";
import UserEmailChangeScreen from "@/screens/SettingsScreens/ChangeEmailScreen";
import UserPasswordChangeScreen from "@/screens/SettingsScreens/ChangePasswordScreen";
import DeleteAccountPage from "@/screens/SettingsScreens/DeleteAccountScreen";
import SettingsScreen from "@/screens/SettingsScreens/SettingScreen";
import UniversityVerificationScreen from "@/screens/SettingsScreens/UniversityVerificationScreen";
import UserNameChangeScreen from "@/screens/SettingsScreens/UserNameChangeScreen";
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
      <Stack.Screen name="UserNameChange" component={UserNameChangeScreen} />
      <Stack.Screen
        name="UserPasswordChange"
        component={UserPasswordChangeScreen}
      />
      <Stack.Screen name="UserEmailChange" component={UserEmailChangeScreen} />
      <Stack.Screen
        name="UserAccountDeactivation"
        component={UserAccountDeactivationScreen}
      />
      <Stack.Screen name="DeleteAccount" component={DeleteAccountPage} />
      <Stack.Screen name="BlockUsers" component={BlockUsersScreen} />
    </Stack.Navigator>
  );
};

export default SettingsStack;
