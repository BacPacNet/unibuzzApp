import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";

import Title from "@/components/atoms/Title";
import ReusableButton from "@/components/atoms/ReusableButton";
import referralImage from "@/assets/referralImage.png";

const ClaimBenefitForm = ({
  onSubmit,
  isPending,
}: {
  onSubmit: (data: any) => Promise<void>;
  isPending: boolean;
}) => {
  const { control, watch, handleSubmit } = useFormContext();

  const referralCode = watch("referralCode");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 w-full"
    >
      <View className="flex-1 w-full px-4 justify-between">
        <View className="w-full">
          <View className="flex items-center mb-6">
            <Image
              source={referralImage}
              style={styles.referralImage}
              resizeMode="contain"
            />
          </View>

          <View className="flex items-center mb-6">
            <Title className="mb-2">Have a referral code?</Title>
            <Text className="text-sm text-neutral-500 text-center mt-2 mb-4">
              Optional — shared by a friend from your university
            </Text>
          </View>

          <View className="w-full">
            <Controller
              control={control}
              name="referralCode"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Enter referral code"
                  placeholderTextColor="#9CA3AF"
                  value={value || ""}
                  onChangeText={(text) => {
                    // Convert to uppercase and filter to only allow alphanumeric
                    const filtered = text
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "");
                    onChange(filtered);
                  }}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              )}
            />
          </View>
        </View>

        <View className="w-full pb-4">
          <ReusableButton
            onPress={handleSubmit(onSubmit)}
            buttonText="Submit"
            variant="primary"
            disabled={isPending}
            isLoading={isPending}
            height="large"
            size="w-full"
            containerStyle="mb-3"
          />

          <ReusableButton
            onPress={handleSubmit(onSubmit)}
            buttonText="Skip & Complete Sign Up"
            variant="border"
            disabled={isPending}
            height="large"
            size="w-full"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ClaimBenefitForm;

const styles = StyleSheet.create({
  referralImage: {
    width: "100%",
    height: 256,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#1F2937",
    height: 40,
  },
});
