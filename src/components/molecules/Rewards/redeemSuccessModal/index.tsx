import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FONTS } from "@/constants/fonts";
import InfoIcon from "@/assets/rewards/info.svg";
import TickIcon from "@/assets/blueBGTick.svg";

const RedeemSuccessModal = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TickIcon width={28} height={28} color="#6744FF" />
        <Text style={styles.headerTitle}>Request Received</Text>
      </View>

      <Text style={styles.message}>
        Congratulations! We've received your redemption request. You can keep
        earning rewards and redeem again once you reach your next milestone.
      </Text>

      <View style={styles.reminderBox}>
        <View style={styles.reminderIconContainer}>
        <InfoIcon width={20} height={20} color="#6744FF" />
        <Text style={styles.reminderTitle}>Important Reminder</Text>
        </View>
    
        <Text style={styles.reminderText}>
          Your reward will be added directly to your Amazon account, but you may
          not receive a notification. Check your account within five business
          days after submitting your request to confirm it's been applied.
        </Text>
      </View>

   
    </View>
  );
};

export default RedeemSuccessModal;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    paddingHorizontal: 20,
    gap: 24,
  },
  header: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerTitle: {
    fontSize: 20,
    color: "#3A3B3C",
    fontFamily: FONTS.poppins.bold,
  },
  reminderIconContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    color: "#18191A",
    lineHeight: 24,
    textAlign: "left",
  },
  reminderBox: {
    flexDirection: "column",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F3F2FF",
    borderWidth: 1,
    borderColor: "#6744FF33",
    borderRadius: 8,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#18191A",
  },
  reminderText: {
    fontSize: 14,
    color: "#18191A",
    lineHeight: 20,
  },
 
});
