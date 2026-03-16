import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "@/types/navigation";
import ReusableButton from "@/components/atoms/ReusableButton";
import { FONTS } from "@/constants/fonts";

const PRIMARY = "#6744FF";

type Props = {
  amount: number;
  previousMonthRedeemed: boolean;
};

type NavigationProp = StackNavigationProp<RootStackParamList, "RedeemRewards">;

const ExpectedPayoutCard = ({ amount, previousMonthRedeemed }: Props) => {
  const navigation = useNavigation<NavigationProp>();
  const handleFeedback = () => {
    navigation.navigate({
      name: "InfoStackScreen",
      params: {
        screen: "FeedBackScreen",
      },
    } as never);
  };
  const handleRedeemReward = () => {
    navigation.navigate("RedeemRewards", { amount });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expected Payout</Text>

      {previousMonthRedeemed ? (
        <Text style={styles.description}>
          You can redeem your reward after completing a milestone. If you have
          trouble with your previous payout, contact us through our{" "}
          <Text onPress={handleFeedback} style={styles.link}>feedback form</Text>.
        </Text>
      ) : (
        <Text style={styles.description}>
          You can redeem your <Text style={styles.amount}>₹{amount}</Text> gift
          card from last month&apos;s rewards using the button below.
        </Text>
      )}

      <ReusableButton
        variant="primary"
        size="fit"
        height="medium"
        buttonText="Redeem Reward"
        onPress={handleRedeemReward}
        disabled={amount === 0 || previousMonthRedeemed}
        isRounded={false}
      />
    </View>
  );
};

export default ExpectedPayoutCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 12,
  },
  title: {
    fontSize: 20,
    color: "#3A3B3C",
    fontFamily: FONTS.poppins.bold,
  },
  description: {
    fontSize: 16,
    fontWeight: "400",
    color: "#3A3B3C",
  },
  link: {
    color: PRIMARY,
  },
  amount: {
    color: "#18191A",
  },
});
