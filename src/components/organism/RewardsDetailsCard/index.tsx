import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Share, ActivityIndicator } from "react-native";
import { NEXT_PROD_FE_BASE_URL } from "@env";
import ReusableButton from "@/components/atoms/ReusableButton";
import MaxMonthInviteCardDetails from "@/components/molecules/Rewards/maxMonthInviteCardDetails";
import MilestoneCard from "@/components/molecules/Rewards/milestoneCard";
import MonthProgressCard from "@/components/molecules/Rewards/monthProgressCard";
import { useGetUserRewards } from "@/services/user";
import { showToast } from "@/utils/toastWrapper";
import { FONTS } from "@/constants/fonts";
import EarningsHistoryCard from "@/components/molecules/Rewards/earningHistoryCard";
import RedeemRewardsCard from "@/components/molecules/Rewards/redeemRewardCard";

const rewardTiers = [
  {
    invitesRequired: 10,
    rewardAmount: 100,
    perInviteAmount: 10,
  },
  {
    invitesRequired: 15,
    rewardAmount: 200,
    perInviteAmount: 13.33,
  },
  {
    invitesRequired: 20,
    rewardAmount: 400,
    perInviteAmount: 20,
  },
]


export default function RewardsDetailsCard() {
  const { data, isLoading, error } = useGetUserRewards();
  const [shared, setShared] = useState(false);
  const currentProgress = data?.thisMonthProgress || 0
  const latestCompletedMilestone = rewardTiers.filter((tier) => currentProgress >= tier.invitesRequired).at(-1)?.invitesRequired || null

  const referralCode = (data?.referCode || "").toUpperCase();
  const referralLink = useMemo(() => {
    if (!referralCode) return "";
    const baseUrl = NEXT_PROD_FE_BASE_URL;
    if (!baseUrl) return "";
    return `${baseUrl}/register?referralCode=${referralCode}`;
  }, [referralCode]);

  const handleShareLink = async () => {
    if (!referralLink) return;
    try {
      const result = await Share.share({ message: referralLink });
      if (result.action === Share.dismissedAction) return;
      if (result.action === Share.sharedAction && result.activityType == null) return;
      setShared(true);
      showToast({ message: "Referral link shared", type: "success", placement: "top" });
      setTimeout(() => setShared(false), 2000);
    } catch (err: any) {
      if (err?.message !== "User did not share") {
        showToast({ message: "Failed to share link", type: "warning", placement: "top" });
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Rewards</Text>
        <Text style={styles.errorText}>Failed to load rewards. Please try again.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} >
      <View style={styles.header}>
        <Text style={styles.title}>Rewards</Text>
        <Text style={styles.subtitle}>
        Share your unique link and earn cash rewards when someone from your university signs up. <Text style={styles.highlight}>Only verified students or faculty from your current university</Text> will count toward your rewards, so please remind them to complete their university verification during or after signing up!
        </Text>
      </View>

      {!!referralLink && (
        <View style={styles.referralSection}>
    

<ReusableButton
              variant="primary"
              size="w-full"
              height="large"
              onPress={handleShareLink}
              disabled={shared}
              buttonText={"Refer Now"}
            />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Milestones</Text>
        <MonthProgressCard
          monthProgress={data?.thisMonthProgress || 0}
          monthEarnings={data?.thisMonthReward || 0}
        />

        <View style={styles.list}>
          {rewardTiers.map((tier) => {
            const isActive = currentProgress >= tier.invitesRequired
            const isCompleted = currentProgress >= tier.invitesRequired
            const showEarned = latestCompletedMilestone === tier.invitesRequired
            return (
              <MilestoneCard
                key={tier.invitesRequired}
                invitesRequired={tier.invitesRequired}
                rewardAmount={tier.rewardAmount}
                perInviteAmount={tier.perInviteAmount}
                isActive={isActive}
                isCompleted={isCompleted}
                showEarned={showEarned}
                isDisabled={false}
              />
            );
          })}
        </View>

        <MaxMonthInviteCardDetails />
      </View>


      <RedeemRewardsCard currentUpiId={data?.currentUPI || null} />
      <EarningsHistoryCard completedReferrals={data?.totalInvites || 0} totalEarnings={data?.totalEarning || 0} />

    </View>
  );
}

const PRIMARY = "#6744FF";

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 32,
  
  },
  loadingContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "column",
    gap: 16,

  },
  title: {
    fontSize: 28,
 
    color: "#18191A",
    fontFamily: FONTS.poppins.extraBold,
  },
  subtitle: {
    fontSize: 16,
    color: "#3A3B3C",
    fontWeight: "400",
  },
  highlight: {
    fontSize: 16,
    color: "#3A3B3C",
    fontWeight: "600",
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
  },
  referralSection: {
    flexDirection: "column",
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#18191A",
  },
  referralRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  linkInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#374151",
    backgroundColor: "#F9FAFB",
  },
  section: {
    flexDirection: "column",
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#3A3B3C",
    fontFamily: FONTS.poppins.bold,
  },
  list: {
    flexDirection: "column",
    gap: 12,
  },

});
