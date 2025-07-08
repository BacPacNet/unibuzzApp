import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@/theme";
import NewChatScreen from "@/screens/NewChatScreen";
import Messages from "@/screens/MessagesScreen";
import EditChatScreen from "@/screens/EditChatScreen";
import ChatMembersScreen from "@/screens/ChatMembersScreen";


const MessageStack = () => {
  const Stack = createStackNavigator();
  const { variant } = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Messages" component={Messages} />

      <Stack.Screen name="NewChatScreen" component={NewChatScreen} />
      <Stack.Screen name="EditChatScreen" component={EditChatScreen} />
      <Stack.Screen name="ChatMembersScreen" component={ChatMembersScreen} />
    </Stack.Navigator>
  );
};

export default MessageStack;
