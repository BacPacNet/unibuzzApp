import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Plus } from "iconoir-react-native";

type Props = {
  isAllowed: boolean;
  onPress: () => void;
};

const CreatePostButton = ({ isAllowed, onPress }: Props) => {
  if (!isAllowed) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Plus width={24} height={24} color="white" strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
};

export default CreatePostButton;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    bottom: 50,
    zIndex: 1000,
  },
  button: {
    backgroundColor: "#6744FF",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
});
