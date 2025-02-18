import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@/theme";
import AllUniversities from "@/screens/AllUniversity";
import University from "@/screens/University";

const DiscoverStack = () => {
  const Stack = createStackNavigator();
  const { variant } = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Discover" component={AllUniversities} />
      <Stack.Screen
        name="University"
        component={University}
        options={{
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      />
    </Stack.Navigator>
  );
};

export default DiscoverStack;
