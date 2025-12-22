import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import ReusableButton from "@/components/atoms/ReusableButton";
import { FONTS } from "@/constants/fonts";
import { ActionSheetRef } from "react-native-actions-sheet";
import { WarningCircle } from "iconoir-react-native";

const DeActivateAccountBottomSheet = ({
  deActivateAccount,
  cancelDeActivateAccount,
  isLoading,
}: {
  deActivateAccount: () => any;
  cancelDeActivateAccount: () => void;
  isLoading: boolean;
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Account</Text>
      <Text style={styles.desc}>
        Are you sure you want to delete your account? All public and private
        profile information will be permanently removed. Personal messages
        cannot be deleted.
      </Text>
      <Text style={styles.imp}>This action is permanent.</Text>

      <View style={styles.buttonContainer}>
        <ReusableButton
          buttonText="Delete Account"
          onPress={deActivateAccount}
          isLoading={isLoading}
          disabled={isLoading}
          variant="danger"
          activityIndicatorColor=""
          size="w-1/2"
          height="medium"
        />
        <ReusableButton
          buttonText="Cancel"
          onPress={cancelDeActivateAccount}
          variant="primary"
          activityIndicatorColor=""
          disabled={isLoading}
          size="w-1/2"
          height="medium"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 10,
    display: "flex",
    flexDirection: "column",

    gap: 16,
  },
  title: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 16,
    fontFamily: FONTS.poppins.bold,
    textAlign: "center",
  },
  desc: {
    color: "#111827",
    fontSize: 12,
  },
  imp: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 12,
    fontFamily: FONTS.poppins.bold,
  },

  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginTop: 16,
  },
});

export default DeActivateAccountBottomSheet;
