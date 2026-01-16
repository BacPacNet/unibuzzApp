import Profile from "@/screens/Profile";
import ProfileEdit from "@/screens/ProfileEdit";
import { createStackNavigator } from "@react-navigation/stack";
import type { ProfileRouteParams } from "@/screens/Profile/types";

export type ProfileStackParamList = {
  Profile: ProfileRouteParams;
  ProfileEdit: undefined;
};

const ProfileStack = () => {
  const Stack = createStackNavigator<ProfileStackParamList>();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
