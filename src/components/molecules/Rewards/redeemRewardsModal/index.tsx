import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FormInput } from "@/components/atoms/FormInput";
import ReusableButton from "@/components/atoms/ReusableButton";
import { FONTS } from "@/constants/fonts";
import InfoIcon from "@/assets/rewards/info.svg";
import { useNavigation } from "@react-navigation/native";

const PRIMARY = "#6744FF";

type RedeemRewardsModalProps = {
  amount: number;
  control: any;
  errors: Record<string, any>;
  onSubmit: () => void;
  isPending: boolean;
};

const RedeemRewardsModal = ({
  amount,
  control,
  errors,
  onSubmit,
  isPending,
}: RedeemRewardsModalProps) => {
  const navigation = useNavigation();
  const handleFeedback = () => {
    navigation.navigate({
      name: "InfoStackScreen",
      params: {
        screen: "FeedBackScreen",
      },
    } as never);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redeem Rewards</Text>

      <View style={styles.infoBox}>
        <View style={styles.infoIconWrapper}>
          <InfoIcon width={20} height={20} color="#fff" strokeWidth={2} />
        </View>
        <Text style={styles.infoText}>
          Enter your Amazon account email to receive your{" "}
          <Text style={styles.infoBold}>₹{amount} gift card</Text>. Processing
          may take up to several business days.
        </Text>
      </View>

      <View style={styles.form}>
        <FormInput
          control={control}
          name="email"
          label="Amazon Account Email"
          placeholder="john.dowry@example.com"
          keyboardType="email-address"
          rules={{ required: true }}
          isError={!!errors.email}
          errorMessage={errors.email ? "This field is required" : undefined}
        />

        <Text style={styles.hint}>
          Please ensure the email is correct to avoid payment issues.
        </Text>


        <Text style={styles.contactText}>
          Having issues receiving your rewards? Contact us through our{" "}

          <Text onPress={handleFeedback} style={styles.contactLink}>feedback form.</Text>

        </Text>
  
        <ReusableButton
          variant="primary"
          size="w-full"
          height="large"
          buttonText="Submit Email"
          onPress={onSubmit}
          disabled={isPending}
        />
      </View>
    </View>
  );
};

export default RedeemRewardsModal;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 24,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    color: "#3A3B3C",
    fontFamily: FONTS.poppins.bold,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    padding: 16,
    backgroundColor: "#F3F2FF",
    borderWidth: 1,
    borderColor: "rgba(103, 68, 255, 0.2)",
    borderRadius: 8,
  },
  infoIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#18191A",
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: "700",
  },
  form: {
    flexDirection: "column",
  },
  hint: {
    fontSize: 14,
    color: "#6B7280",
  },
  contactText: {
 
    fontSize: 14,
    color: "#6B7280",
    paddingVertical: 24,
 
  },
  contactLink: {
    color: PRIMARY,
    fontSize: 14,

  },

});
