import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { View, Text, TouchableOpacity } from "react-native";

import Title from "@/components/atoms/Title";
import SupportingText from "@/components/atoms/SupportingText";
import CustomTextInput from "@/components/atoms/CustomTextInput";

import ReusableButton from "@/components/atoms/ReusableButton";
import { FormInput } from "@/components/atoms/FormInput";

const ClaimBenefitForm = ({
  onSubmit,
  isPending,
}: {
  onSubmit: (data: any) => Promise<void>;
  isPending: boolean;
}) => {
  const {
    formState: { errors: ClaimBenefit },
    control,

    handleSubmit,
  } = useFormContext();

  return (
    <View className="w-full">
      <View className="flex  items-center text-center p-4 ">
        <Title>Claim your benefit</Title>
        <SupportingText>
          Enter your referral code for these perks:
        </SupportingText>
      </View>
      {BadgeList()}
      <View className="w-full flex  mb-4">
        <View className="mt-4">
          <FormInput
            label="referralCode"
            placeholder="code"
            isLabelShown={false}
            required
            name="referralCode"
            control={control}
          />

          <ReusableButton
            buttonText="Confirm Code"
            variant="border_primary"
            activityIndicatorColor="#6744FF"
            textStyle="text-primary-500"
          />
          <Text className="text-md text-neutral-500 text-center mb-4">
            Plan will immediately apply to account after confirmation.
          </Text>
        </View>
      </View>

      <ReusableButton
        onPress={handleSubmit(onSubmit)}
        buttonText="Complete Sign Up"
        variant="primary"
        disabled={isPending}
        isLoading={isPending}
      />
    </View>
  );
};

export default ClaimBenefitForm;

const BadgeList = () => {
  const badgeData = [
    { name: "Custom Emojis", bg: "#FDF4FF", color: "#C026D3" },
    { name: "Unlimited AI Prompts", bg: "#ECFEFF", color: "#0891B2" },
    { name: "Profile Badge", bg: "#F0FDF4", color: "#16A34A" },
    { name: "Join Up 100 Groups", bg: "#F3F2FF", color: "#6744FF" },
    { name: "500 MB Upload", bg: "#FFFBEB", color: "#D97706" },
  ];
  return (
    <View style={{ flexWrap: "wrap", gap: 10 }} className="flex-row  ">
      {badgeData?.map((item) => (
        <Text
          key={item.name}
          className="rounded-full p-3  text-md w-auto"
          style={{ backgroundColor: item.bg, color: item.color }}
        >
          {item.name}
        </Text>
      ))}
    </View>
  );
};
