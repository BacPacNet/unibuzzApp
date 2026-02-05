import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import ReusableButton from "@/components/atoms/ReusableButton";
import { FONTS } from "@/constants/fonts";
import { ActionSheetRef } from "react-native-actions-sheet";
import CommunityLogo from "@/components/atoms/LogoHolder";

const LeaveCommunityBottomSheet = ({
  leaveCommunity,
  leaveCommunityBottomSheet,
  communityLogoUrl,
  communityName,
}: {
  leaveCommunity: () => void;
  leaveCommunityBottomSheet: React.RefObject<ActionSheetRef>;
  communityLogoUrl: string;
  communityName: string;
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaving Community</Text>

      <Text style={styles.description}>
        Leaving your university community removes you from all its groups and
        deletes the ones you created.
      </Text>

      <View style={styles.listContainer}>
        <Text style={styles.bulletPoint}>
          • You'll need to rejoin your groups.
        </Text>
        <Text style={styles.bulletPoint}>
          • Group members will lose access to your groups.
        </Text>
      </View>

      <View style={styles.communityContainer}>
        <CommunityLogo logoUrl={communityLogoUrl} variant="small" />
        <Text style={styles.communityName}>{communityName}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <ReusableButton
          buttonText="Leave"
          onPress={leaveCommunity}
          variant="danger"
          activityIndicatorColor=""
          size="w-1/2"
          height="medium"
        />
        <ReusableButton
          buttonText="Cancel"
          onPress={() => leaveCommunityBottomSheet.current?.hide()}
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
  description: {
    color: "#374151",
    fontSize: 14,
    textAlign: "center",
  },
  listContainer: {
    marginTop: 4,
    width:"auto",
    display:"flex",
    flexDirection:"column",
    justifyContent:"flex-start",
    gap:2,
   
  },
  bulletPoint: {
    color: "#374151",
    fontSize: 14,
    
  },
  communityContainer: {
    flexDirection: "row",
    alignItems: "center",

    gap: 8,
    marginTop: 8,
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  communityName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
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

export default LeaveCommunityBottomSheet;
