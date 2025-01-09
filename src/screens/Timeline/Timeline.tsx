import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "@/context/AuthProvider/AuthContext";

const Timeline = () => {
  const { deauthenticate } = useAuth();
  return (
    <View>
      <Text>Timeline</Text>
      <TouchableOpacity
        onPress={() => {
          deauthenticate();
        }}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Timeline;
