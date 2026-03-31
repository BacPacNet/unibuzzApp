import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FONTS } from "@/constants/fonts";
import RewardIcon from "@/components/atoms/RewardIcon";
import { Community as CommunityIcon } from "iconoir-react-native";

type EarningsHistoryCardProps = {
  completedReferrals: number;
  totalEarnings: number;
};

type MetricCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
};

function MetricCard({ title, value, icon }: MetricCardProps) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.iconWrapper}>
        {icon}
      </View>
      <View style={styles.metricTextWrapper}>
        <Text style={styles.metricTitle}>{title}</Text>
        <Text style={styles.metricValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function EarningsHistoryCard({ completedReferrals, totalEarnings }: EarningsHistoryCardProps) {
  return (
    <View style={styles.container}>
   <View style={styles.header}>
   <Text style={styles.heading}>Earnings History</Text>
      <Text style={styles.infoText}>You can see your total referral earnings calculated up to the end of the previous month.</Text>
      
   </View>
      <View style={styles.metricList}>
        <MetricCard
          title="Completed Referrals"
          value={String(completedReferrals)}
          icon={
            <CommunityIcon
              width={24}
              height={24}
              fill="#6647FF"
              color="#6647FF"
            />
          }
        />
        <MetricCard
          title="Total Earnings"
          value={`₹${totalEarnings}`}
          icon={<RewardIcon width={24} height={24} fill="#6744FF" />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    gap: 2,
  },
  heading: {
    fontSize: 20,
    color: "#3A3B3C",
    fontFamily: FONTS.poppins.bold,
  },
  metricList: {
    flexDirection: "column",
    gap: 12,
  },
  metricCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F3F2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  metricTextWrapper: {
    flex: 1,
    gap: 4,
  },
  metricTitle: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: FONTS.inter.regular,
  },
  metricValue: {
    fontSize: 24,
    lineHeight: 28,
    color: "#18191A",
    fontFamily: FONTS.poppins.semiBold,
  },
  infoText: {
    color: "#3A3B3C",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FONTS.inter.regular,
    includeFontPadding: false,
  },
});
