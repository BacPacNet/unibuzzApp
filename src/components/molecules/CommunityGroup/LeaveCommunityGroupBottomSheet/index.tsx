import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import ReusableButton from "@/components/atoms/ReusableButton";
import { FONTS } from "@/constants/fonts";
import { ActionSheetRef } from "react-native-actions-sheet";
import { WarningCircle } from "iconoir-react-native";

const LeaveCommunityGroupBottomSheet = ({
  leaveCommunityGroup,
  leaveCommunityGroupBottomSheet,
}: {
  leaveCommunityGroupBottomSheet: React.RefObject<ActionSheetRef>;
  leaveCommunityGroup: () => any;
}) => {
  return (
    <View style={styles.container}>
      <WarningCircle width={"90%"} height={100} color="#111827" />
      <Text style={styles.title}>
        Are you sure you want to leave community group?
      </Text>

      <View style={styles.buttonContainer}>
        <ReusableButton
          buttonText="Leave"
          onPress={leaveCommunityGroup}
          variant="danger"
          activityIndicatorColor=""
          size="w-1/2"
          height="medium"
        />
        <ReusableButton
          buttonText="Cancel"
          onPress={() => leaveCommunityGroupBottomSheet.current?.hide()}
          variant="primary"
          activityIndicatorColor=""
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
    alignItems: "center",
    gap: 16,
  },
  title: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 16,
    fontFamily: FONTS.poppins.bold,
    textAlign: "center",
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

export default LeaveCommunityGroupBottomSheet;
