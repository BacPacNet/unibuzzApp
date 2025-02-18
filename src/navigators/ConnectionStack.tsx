import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Connections from "@/screens/ConnectionScreen";
import YourConnections from "@/screens/YourConnections/YourConnections";
import { useTheme } from "@/theme";

const ConnectionStack = () => {
  const Stack = createStackNavigator();
  const { variant } = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="Connection"
      key={variant}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Connections" component={Connections} />
      <Stack.Screen name="YourConnections" component={YourConnections} />
    </Stack.Navigator>
  );
};

export default ConnectionStack;
