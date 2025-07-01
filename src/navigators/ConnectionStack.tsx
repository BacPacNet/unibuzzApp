import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Connections from "@/screens/ConnectionScreen";
import { useTheme } from "@/theme";
import ConnectionsFilter from "@/screens/ConnectionFilterScreen";

const ConnectionStack = () => {
  const Stack = createStackNavigator();
  const { variant } = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="Connections"
      key={variant}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Connections" component={Connections} />
      <Stack.Screen name="ConnectionsFilter" component={ConnectionsFilter} />
    </Stack.Navigator>
  );
};

export default ConnectionStack;
