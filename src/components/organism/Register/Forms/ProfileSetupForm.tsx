import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFormContext } from "react-hook-form";
import Title from "@/components/atoms/Title";
import ReusableButton from "@/components/atoms/ReusableButton";
import { FormInput } from "@/components/atoms/FormInput";
import { DateSelect } from "@/components/atoms/DateSelect";
import { ArrowLeft } from "iconoir-react-native";
import RadioInput from "@/components/atoms/RadioInput";
import { GenderOptions } from "@/types/register";
import { TRACK_EVENT } from "@/content/constant";
import { useTimeTracking } from "@/hooks/useTimeTracking";

const ProfileSetupForm = ({
  onSubmit,
  handlePrev,
}: {
  onSubmit: (data: any) => Promise<void>;
  handlePrev: () => void;
}) => {
  const {
    formState: { errors: ProfileFormErrors },
    control,
    handleSubmit,
    watch,
    getValues,
  } = useFormContext();

  useTimeTracking(TRACK_EVENT.PROFILE_SETUP_STEP_VIEW_DURATION, {
    email: getValues("email"),
  });

  const currDob = watch("birthDate");

  return (
    <View style={styles.main}>
      <View className="flex w-full items-center ">
        <View style={styles.titlemargin} className="flex items-start  w-full">
          <Title>Profile Setup</Title>
        </View>

        <View style={styles.mainContainer} className="w-full ">
          <FormInput
            label="First Name"
            placeholder="Enter First Name"
            isLabelShown
            rules={{ required: "First name is required!" }}
            name="firstName"
            control={control}
            isError={!!ProfileFormErrors.firstName}
            errorMessage={
              ProfileFormErrors.firstName
                ? "Please enter your first name!"
                : ""
            }
          />

          <FormInput
            placeholder="Enter Last Name"
            isLabelShown
            label="Last Name"
            rules={{ required: "Last name is required!" }}
            name="lastName"
            control={control}
            isError={!!ProfileFormErrors.lastName}
            errorMessage={
              ProfileFormErrors.lastName ? "Please enter your last name!" : ""
            }
          />

          <DateSelect
            isLabelShown
            label="Birth Date"
            placeholder="DD/MM/YYYY"
            name="birthDate"
            currDob={currDob}
            control={control}
            rules={{
              required: "Dob is required!",
              validate: (value: any) => {
                if (!value) return "BirthDate is required!";

                const [day, month, year] = value.split("/");
                const birthDate = new Date(
                  Number(year),
                  Number(month) - 1,
                  Number(day)
                );

                if (isNaN(birthDate.getTime()))
                  return "Invalid birth date format";

                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
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
          />

          {/* <View className="flex flex-col gap-2">
            <Text className="text-neutral-700 text-xs">Gender</Text>
            <RadioInput
              name="gender"
              control={control}
              options={GenderOptions.map((g) => ({ label: g, value: g }))}
              required
              size="small"
            />
          </View> */}
        </View>

        <View style={styles.buttonContainer}>
          <ReusableButton
            onPress={handleSubmit(onSubmit)}
            buttonText="Next Step"
            variant="primary"
            height="large"
          />
          <ReusableButton
            onPress={handlePrev}
            buttonText="Review Account"
            containerStyle="flex items-center justify-center"
            buttonContent={
              <View className="flex flex-row items-center justify-center gap-2">
                <ArrowLeft width={20} height={20} color="#6744FF" />
                <Text className="text-primary-500"> Review Account</Text>
              </View>
            }
            variant="shade"
            height="large"
          />
        </View>
      </View>
    </View>
  );
};

export default ProfileSetupForm;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: "100%",
  },
  titlemargin: {
    marginBottom: 32,
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginTop: 64,
  },
});
