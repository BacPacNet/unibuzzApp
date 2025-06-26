import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onPress: () => void;
};

const PlusCircleButton = ({  onPress }: Props) => {
  return (
    // <View style={styles.plusButtonContainer}>
  
        <TouchableOpacity onPress={onPress} style={styles.createButton}>
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
   
    // </View>
  );
};

export default PlusCircleButton;

const styles = StyleSheet.create({

plusText: {
  color: "white",
  fontSize: 24,
},
  createButton: {
    backgroundColor: "#6744FF",

    height: 48,
    width: 48,
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