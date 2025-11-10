import React from "react";
import { View, Text, StyleSheet } from "react-native";

import ReusableButton from "@/components/atoms/ReusableButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { FONTS } from "@/constants/fonts";

type NavigationProp = StackNavigationProp<RootStackParamList, "CommunityGroup">;

const VerifyToCreateGroupBottomSheet = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleRedirect = () => {
    navigation.navigate("SettingsStack", {
      screen: "UniversityVerification",
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Account to Create Groups</Text>

      <Text style={styles.description}>
        Verify your account to unlock group creation and start building your own
        community. Please complete verification to continue.
      </Text>

      <View style={styles.buttonContainer}>
        <ReusableButton
          buttonText="Verify University Email"
          onPress={handleRedirect}
          variant="primary"
          activityIndicatorColor=""
          size={"w-1/2"}
          height="medium"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  title: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 14,
    fontFamily: FONTS.poppins.bold,
  },
  description: {
    color: "#374151",
    fontSize: 14,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
});

export default VerifyToCreateGroupBottomSheet;
