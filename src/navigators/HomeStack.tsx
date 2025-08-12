// navigation/HomeStack.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@/theme";
import { Example, Timeline } from "@/screens";
import NewPost from "@/screens/NewPost";

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
          gestureEnabled: false,
          // gestureDirection: "horizontal",
        }}
      />
      <Stack.Screen name="Example" component={Example} />
    </Stack.Navigator>
  );
};

export default HomeStack;
