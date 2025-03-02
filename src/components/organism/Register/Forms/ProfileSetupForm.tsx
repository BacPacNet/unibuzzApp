import React from "react";
import { View, Text } from "react-native";
import { useFormContext } from "react-hook-form";
import { userType } from "@/types/register";
import Title from "@/components/atoms/Title";
import SupportingText from "@/components/atoms/SupportingText";
import ReusableButton from "@/components/atoms/ReusableButton";
import { FormInput } from "@/components/atoms/FormInput";
import { DateSelect } from "@/components/atoms/DateSelect";
import { SelectInputWithSearch } from "@/components/atoms/SelectInputWithSearch";

const ProfileSetupForm = ({
  onSubmit,
}: {
  onSubmit: (data: any) => Promise<void>;
}) => {
  const {
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

        <FormInput
          label="First Name"
          placeholder="Enter First Name"
          isLabelShown={false}
          required
          name="firstName"
          control={control}
          isError={!!ProfileFormErrors.firstName}
          errorMessage={
            ProfileFormErrors.firstName ? "Please enter your first name!" : ""
          }
        />

        {/* Last Name */}
        <FormInput
          placeholder="Enter Last Name"
          isLabelShown={false}
          required
          name="lastName"
          control={control}
          isError={!!ProfileFormErrors.lastName}
          errorMessage={
            ProfileFormErrors.lastName ? "Please enter your last name!" : ""
          }
        />

        {/* Birth Date */}
        <DateSelect
          isLabelShown={false}
          placeholder="DD/MM/YYYY"
          name="birthDate"
          required
          control={control}
          rules={{
            required: "Dob is required!",
            validate: (value: any) => {
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

              return adjustedAge >= 14 || "You must be at least 14 years old!";
            },
          }}
        />

        {/* User Type */}
        <SelectInputWithSearch
          isLabelShown={false}
          placeholder="userTyper"
          options={userType}
          name="userType"
          control={control}
          search={true}
          rules={{ required: "User type is required!" }}
        />
      </View>

      <ReusableButton
        onPress={handleSubmit(onSubmit)}
        buttonText="Next Step"
        variant="primary"
      />

      {/* Footer */}
      <Text className="text-[12px] text-neutral-600 text-center">
        You can add more profile information later in your profile settings!
      </Text>
    </View>
  );
};

export default ProfileSetupForm;
