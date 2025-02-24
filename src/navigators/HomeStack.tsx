// navigation/HomeStack.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@/theme";
import { Example, Timeline } from "@/screens";
import NewPost from "@/screens/NewPost";
import Profile from "@/screens/Profile";
import ProfileEdit from "@/screens/ProfileEdit";
import ProfileStack from "./ProfileStack";

const HomeStack = () => {
  const Stack = createStackNavigator();
  const { variant } = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Timeline" component={Timeline} />
      <Stack.Screen
        name="NewPost"
        component={NewPost}
        options={{
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      />
      <Stack.Screen name="Example" component={Example} />
      {/* <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ProfileEdit" component={ProfileEdit} /> */}
      <Stack.Screen name="ProfileStack" component={ProfileStack} />
    </Stack.Navigator>
  );
};

export default HomeStack;
