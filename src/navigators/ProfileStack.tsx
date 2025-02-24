import Profile from "@/screens/Profile";
import ProfileEdit from "@/screens/ProfileEdit";
import { createStackNavigator } from "@react-navigation/stack";
import ConnectionStack from "./ConnectionStack";

const ProfileStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
