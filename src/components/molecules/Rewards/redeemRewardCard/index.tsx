import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import ReusableButton from "@/components/atoms/ReusableButton";
import { FONTS } from "@/constants/fonts";
import { useUpdateLatestRewardRedemptionUpiId } from "@/services/user";
import { showToast } from "@/utils/toastWrapper";

const UPI_REGEX = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

export default function RedeemRewardsCard({ currentUpiId }: { currentUpiId: string | null }) {
  const [upiId, setUpiId] = useState("");
  const { mutate: updateUpiId, isPending } = useUpdateLatestRewardRedemptionUpiId();

  const handleSubmit = () => {
    const trimmedUpi = upiId.trim();

    if (!trimmedUpi) {
      showToast({ message: "Please enter your UPI ID", type: "warning", placement: "top" });
      return;
    }

    if (!UPI_REGEX.test(trimmedUpi)) {
      showToast({ message: "Invalid UPI ID format", type: "warning", placement: "top" });
      return;
    }

    updateUpiId(
      { upiId: trimmedUpi },
      {
        onSuccess: () => {
          showToast({ message: "UPI ID submitted to receive rewards.", type: "success", placement: "top" });
          setUpiId("");
        },
        onError: () => {
          showToast({ message: "Unable to submit UPI ID. Please try again.", type: "danger", placement: "top" });
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redeem Rewards</Text>

      <View style={styles.row}>
        <View style={styles.inputContainer}>
        <TextInput
          value={upiId}
          onChangeText={setUpiId}
          style={styles.input}
          placeholder="Enter your UPI ID"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          autoCorrect={false}
        
          
        />

        {currentUpiId && (
          <View style={styles.activeUpiRow}>
            <Text style={styles.infoText}>Your active UPI ID:</Text>
            <Text style={styles.highlight} numberOfLines={1} ellipsizeMode="tail">
              {currentUpiId}
            </Text>
          </View>
        )}
      </View>

      
      </View>
      <ReusableButton
          variant="primary"
          height="large"
          size="w-full"
          onPress={handleSubmit}
          disabled={isPending || !upiId.trim()}
          isLoading={isPending}
          buttonText={isPending ? "Submitting..." : "Submit"}
        />
      <Text style={styles.infoText}>
        We will send the cash reward to your UPI ID. Rewards are redeemable after May 1, 2026, and will continue to be available at the start of
        each month. This can take up to several business days.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    flex: 1,
  },
  title: {
    fontSize: 20,
    color: "#3A3B3C",
    fontFamily: FONTS.poppins.bold,
  },
  row: {
 flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FFFFFF",
    fontFamily: FONTS.inter.regular,
  },
  infoText: {
    color: "#3A3B3C",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FONTS.inter.regular,
    includeFontPadding: false,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
  },
  highlight: {
    fontSize: 14,
    color: "#3A3B3C",
    lineHeight: 20,
    fontFamily: FONTS.inter.semiBold,
    includeFontPadding: false,
    flexShrink: 1,
  },
  activeUpiRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    justifyContent: "flex-start",
  },
});
