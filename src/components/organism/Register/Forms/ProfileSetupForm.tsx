import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useFormContext, Controller } from "react-hook-form";

import { userType, GenderOptions } from "@/types/register";
import Title from "@/components/atoms/Title";
import SupportingText from "@/components/atoms/SupportingText";
import SelectDropdown from "@/components/atoms/SelectDropdown";
import CustomTextInput from "@/components/atoms/CustomTextInput";
import DateSelect from "@/components/atoms/CustomDateSelect";
import { Country } from "country-state-city";
import ReusableButton from "@/components/atoms/ReusableButton";

const ProfileSetupForm = ({
  onSubmit,
}: {
  onSubmit: (data: any) => Promise<void>;
}) => {
  const {
    register,
    formState: { errors: ProfileFormErrors },
    control,
    handleSubmit,
  } = useFormContext();

  return (
    <View className="flex w-full items-center p-4">
      {/* Header */}
      <View className="flex items-center mb-4">
        <Title>Profile Setup</Title>
        <SupportingText>
          Enter your profile information for networking
        </SupportingText>
      </View>

      {/* Form */}
      <View className="w-full mb-4">
        {/* First Name */}
        <View className="mb-4">
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomTextInput
                placeholder="firstName"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                error={!!ProfileFormErrors.firstName}
              />
            )}
            name="firstName"
            rules={{
              required: "Please enter your first name!",
            }}
          />
          {ProfileFormErrors.firstName && (
            <Text className="text-red-500 text-sm mt-1">
              Please enter your first name!
            </Text>
          )}
        </View>

        {/* Last Name */}
        <View className="mb-4">
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomTextInput
                placeholder="lastName"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                error={!!ProfileFormErrors.lastName}
              />
            )}
            name="lastName"
            rules={{
              required: "Please enter your last name!",
            }}
          />
          {ProfileFormErrors.lastName && (
            <Text className="text-red-500 text-sm mt-1">
              Please enter your lastName!
            </Text>
          )}
        </View>

        {/* Birth Date */}
        <View className="mb-4">
          <Controller
            name="birthDate"
            control={control}
            rules={{
              required: "BirthDate is required!",
              validate: (value) => {
                if (!value) return "BirthDate is required!";
                const today = new Date();
                const birthDate = new Date(value);
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                const dayDiff = today.getDate() - birthDate.getDate();
                const adjustedAge =
                  monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)
                    ? age - 1
                    : age;

                return (
                  adjustedAge >= 14 || "You must be at least 14 years old!"
                );
              },
            }}
            render={({ field }) => (
              <DateSelect
                value={field.value}
                onChangeText={field.onChange}
                placeholder="Birthday"
                err={!!ProfileFormErrors.birthDate}
              />
            )}
          />
          {ProfileFormErrors.birthDate && (
            <Text className="text-red-500 text-sm mt-1">
              {ProfileFormErrors?.birthDate?.message?.toString()}
            </Text>
          )}
        </View>

        {/* User Type */}
        <View className="mb-4">
          <Controller
            name="userType"
            control={control}
            rules={{ required: "User type is required!" }}
            render={({ field }) => (
              <SelectDropdown
                options={userType}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select a Type"
                icon="single"
                err={!!ProfileFormErrors.userType}
              />
            )}
          />
          {ProfileFormErrors.userType && (
            <Text className="text-red-500 text-sm mt-1">
              {ProfileFormErrors?.userType?.message?.toString()}
            </Text>
          )}
        </View>
      </View>

      <ReusableButton
        onPress={handleSubmit(onSubmit)}
        buttonText="Next Step"
        variant="primary"
      />

      {/* Footer */}
      <Text className="text-xs text-neutral-600 text-center">
        You can add more profile information later in your profile settings!
      </Text>
    </View>
  );
};

export default ProfileSetupForm;
