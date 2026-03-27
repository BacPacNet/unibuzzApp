import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CheckIcon from "@/assets/blueBGTick.svg";

const PRIMARY = "#6744FF";

type Props = {
  invitesRequired: number;
  rewardAmount: number;
  perInviteAmount: number;
  isActive?: boolean;
  isCompleted?: boolean;
  isDisabled?: boolean;
  showEarned?: boolean;
};

const MilestoneCard = ({
  invitesRequired,
  rewardAmount,
  perInviteAmount,
  isActive = false,
  isCompleted = false,
  isDisabled = false,
  showEarned = false,
}: Props) => {
  return (
    <View
      style={[
        styles.container,
        isActive && styles.containerActive,
        isDisabled && styles.containerDisabled,
      ]}
    >
      <View style={styles.leftSection}>
        <View
          style={[
            styles.circle,
            !isCompleted ? styles.circleDefault : styles.circleCompleted,
          ]}
        >
          {isCompleted ? (
            <CheckIcon width={48} height={48} color="#fff" />
          ) : (
            <Text
              style={[
                styles.circleText,
                isCompleted && styles.circleTextCompleted,
              ]}
            >
              {invitesRequired}
            </Text>
          )}
        </View>
        <View style={styles.textSection}>
          <Text
            style={[styles.invitesText, isActive && styles.textPrimary]}
          >
            {invitesRequired} Invites
          </Text>
       
        </View>
      </View>
      <View style={styles.rewardSection}>
        {/* <Text
          style={[styles.rewardAmount, isActive && styles.textPrimary]}
        >
          ₹{rewardAmount}
        </Text>
        {isActive && (
          <Text style={[styles.earnedText, styles.textPrimary]}>Earned</Text>
        )} */}


{!showEarned && !isCompleted ? <Text style={[styles.rewardAmount, isActive && styles.textPrimary]}>₹{rewardAmount}</Text> : showEarned ? <Text style={[styles.rewardAmount, styles.textPrimary]}>₹{rewardAmount}</Text> : ''}

{showEarned ? <Text style={[styles.earnedText, styles.textPrimary]}>Earned</Text> : ''}
      </View>
    </View>
  );
};

export default MilestoneCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerActive: {
    borderWidth: 2,
    borderColor: PRIMARY,
    backgroundColor: "rgba(103, 68, 255, 0.1)",
  },
  containerDisabled: {
    opacity: 0.5,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 360,
    alignItems: "center",
    justifyContent: "center",
    
    
  },
  circleDefault: {
 backgroundColor:"#F3F2FF"
  },
  circleCompleted: {
    // backgroundColor: PRIMARY,
  },
  circleText: {
    fontSize: 16,
    fontWeight: "600",
    color: PRIMARY,
  },
  circleTextCompleted: {
    color: "#fff",
  },
  checkMark: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "700",
  },
  textSection: {
    flexDirection: "column",
  },
  invitesText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#18191A",
  },
  textPrimary: {
    color: PRIMARY,
  },
  perInviteText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "400",
    marginTop: 2,
  },
  rewardSection: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  rewardAmount: {
    fontSize: 16,
    fontWeight: "400",
    color: "#18191A",
  },
  earnedText: {
    fontSize: 16,
    fontWeight: "400",
    marginTop: 2,
  },
});
