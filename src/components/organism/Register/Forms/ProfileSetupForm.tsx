import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useFormContext } from "react-hook-form";
import { userType } from "@/types/register";
import Title from "@/components/atoms/Title";
import ReusableButton from "@/components/atoms/ReusableButton";
import { FormInput } from "@/components/atoms/FormInput";
import { DateSelect } from "@/components/atoms/DateSelect";
import { ArrowLeft } from "iconoir-react-native";
import RadioInput from "@/components/atoms/RadioInput";
import Accordion from "@/components/atoms/Accordian";

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
  } = useFormContext();
  const currDob = watch("birthDate");
  return (
    <View style={styles.main}>
      <View className="flex w-full items-center ">
        {/* Header */}
        <View style={styles.titlemargin} className="flex items-start  w-full">
          <Title>Profile Setup</Title>
        </View>

        {/* Form */}
        <View style={styles.mainContainer} className="w-full ">
          {/* First Name */}

          <FormInput
            label="First Name"
            placeholder="Enter First Name"
            isLabelShown={true}
            rules={{
              required: "First name is required!",
            }}
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
            isLabelShown={true}
            label="Last Name"
            rules={{
              required: "Last name is required!",
            }}
            name="lastName"
            control={control}
            isError={!!ProfileFormErrors.lastName}
            errorMessage={
              ProfileFormErrors.lastName ? "Please enter your last name!" : ""
            }
          />

          {/* Birth Date */}
          <DateSelect
            isLabelShown={true}
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
                  Number(day),
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

          {/* User Type */}

          <View className="flex flex-col gap-2">
            <Text className="text-neutral-700 text-xs">Status</Text>
            <RadioInput
              name="userType"
              control={control}
              options={[
                {
                  label: "Student",
                  value: userType[0],
                },
                {
                  label: "Faculty",
                  value: userType[1],
                },
              ]}
              required
              size="small"
            />

            <Accordion
              title="What is your status?"
              contentStyle={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <View className="flex flex-col gap-2">
                <Text className="font-bold text-neutral-700">• Students:</Text>
                <Text>
                  {" "}
                  For current university students. Select if you are already
                  enrolled.
                </Text>
              </View>
              <View className="flex flex-col gap-2">
                <Text className="font-bold text-neutral-700">• Faculty:</Text>
                <Text>
                  {" "}
                  For current employers or employees of a university. Select if
                  you have an occupation.
                </Text>
              </View>
              {/* <View className="flex flex-col gap-2">
        <Text className="font-bold text-neutral-700">• Applicant:</Text><Text> For those still under K–12 education. Select if you are not enrolled in a university.</Text>
        </View> */}
            </Accordion>
          </View>
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
