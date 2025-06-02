import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  isAllowed: boolean;
  onPress: () => void;
};

const CreatePostButton = ({ isAllowed, onPress }: Props) => {
  return (
    <View style={styles.plusButtonContainer}>
      {isAllowed && (
        <TouchableOpacity onPress={onPress} style={styles.createButton}>
          <Text style={{ color: "white", fontSize: 24 }}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CreatePostButton;

const styles = StyleSheet.create({
  plusButtonContainer: {
    position: "absolute",
    right: 20,
    top: "80%",
    zIndex: 200,
  },
  createButton: {
    backgroundColor: "#6744FF",
    padding: 15,
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
