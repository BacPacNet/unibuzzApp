import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TextInput, Share, ActivityIndicator } from "react-native";
import { NEXT_PROD_FE_BASE_URL } from "@env";
import ReusableButton from "@/components/atoms/ReusableButton";
import ExpectedPayoutCard from "@/components/molecules/Rewards/expectedPayoutCard";
import MaxMonthInviteCardDetails from "@/components/molecules/Rewards/maxMonthInviteCardDetails";
import MilestoneCard from "@/components/molecules/Rewards/milestoneCard";
import MonthProgressCard from "@/components/molecules/Rewards/monthProgressCard";
import RewardInfoCard from "@/components/molecules/Rewards/rewardInfoCard";
import { useGetUserRewards } from "@/services/user";
import { showToast } from "@/utils/toastWrapper";
import InfoIcon from "@/assets/rewards/info.svg";
import GiftIcon from "@/assets/rewards/gift.svg";
import RedeemIcon from "@/assets/rewards/redem.svg";
import { FONTS } from "@/constants/fonts";

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

const cards = [
  {
    Icon: InfoIcon,
    title: 'Monthly Reset',
    description: 'Milestones reset on the 1st of every month. Start fresh and earn more rewards!',
  },
  {
    Icon: GiftIcon,
    title: 'Gift Card Delivery',
    description: 'Gift cards will be sent to your login email (personal or university email).',
  },
  {
    Icon: RedeemIcon,
    title: 'Redemption',
    description: 'Rewards are redeemable on or after 1st April 2026. Gift cards will be issued in multiples of ₹100.',
  },
]

export default function RewardsDetailsCard() {
  const { data, isLoading, error } = useGetUserRewards();
  const [shared, setShared] = useState(false);

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
          Share your unique link, and earn cash rewards when a student or faculty member from your current university signs up.
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

      <ExpectedPayoutCard
        amount={data?.previousMonthReward || 0}
        previousMonthRedeemed={data?.previousMonthRedeemed || false}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Milestones</Text>
        <MonthProgressCard
          monthProgress={data?.thisMonthProgress || 0}
          monthEarnings={data?.thisMonthReward || 0}
        />

        <View style={styles.list}>
          {rewardTiers.map((tier) => {
            const progress = data?.thisMonthProgress || 0;
            const reached = progress >= tier.invitesRequired;
            return (
              <MilestoneCard
                key={tier.invitesRequired}
                invitesRequired={tier.invitesRequired}
                rewardAmount={tier.rewardAmount}
                perInviteAmount={tier.perInviteAmount}
                isActive={reached}
                isCompleted={reached}
                isDisabled={false}
              />
            );
          })}
        </View>

        <MaxMonthInviteCardDetails />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How it Works</Text>
        <View style={styles.list}>
          {cards.map((card) => (
            <RewardInfoCard
              key={card.title}
              Icon={card.Icon as any}
              title={card.title}
              description={card.description}
            />
          ))}
        </View>
      </View>
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
