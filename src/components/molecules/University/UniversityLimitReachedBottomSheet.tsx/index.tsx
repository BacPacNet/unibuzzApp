import React from "react";

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";

type NavigationProp = StackNavigationProp<RootStackParamList, "University">;

const UniversityLimitReachedBottomSheet = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleRedirect = () => {
    navigation.navigate("SettingsStack", {
      screen: "UniversityVerification",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops! You’ve hit the limit.</Text>
      <Text style={styles.text}>
        Looks like you’ve already joined a university without verifying your
        student status. You can only join one unverified university at a time.
      </Text>
      <Text style={[styles.text, styles.bold]}>
        To continue, verify your student email for either:
      </Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>
          • The university you’ve previously joined
        </Text>
        <Text style={styles.listItem}>
          • The one you are currently attempting to join
        </Text>
      </View>
      <TouchableOpacity onPress={handleRedirect} style={styles.button}>
        <Text style={styles.buttonText}>Verify Student Email</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UniversityLimitReachedBottomSheet;
const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    textAlign: "center",
    color: "#374151",
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: "#374151",
  },
  bold: {
    fontWeight: "600",
  },
  list: {
    marginTop: 4,
  },
  listItem: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
    marginBottom: 4,
  },
  button: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#6647FF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
