import React, { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { View, Text, StyleSheet } from "react-native";

import Title from "@/components/atoms/Title";

import { degreeAndMajors } from "@/types/register";
import ReusableButton from "@/components/atoms/ReusableButton";
import SelectUniversityDropdownBottomSheet from "@/components/atoms/SelectUniversityDropDownBottomSheet";
import { SelectInputWithSearch } from "@/components/atoms/SelectInputWithSearch";
import { ArrowLeft } from "iconoir-react-native";
import CustomSwitch from "@/components/atoms/CustomSwitch";

const ProfileStudentForm = ({
  onSubmit,
  handlePrev,
}: {
  onSubmit: (data: any) => Promise<void>;
  handlePrev: () => void;
}) => {
  const {
    formState: { errors: ProfileFormErrors },
    control,
    watch,
    setValue,
    handleSubmit,
    getValues,
  } = useFormContext();

  type DegreeKeys = keyof typeof degreeAndMajors;
  const currDegree: DegreeKeys = watch("year");
  const currMa: DegreeKeys = watch("major");
  const userType = getValues("userType");
  const universityName = watch("universityName");

  const [currMajor, setCurrMajor] = useState<any>([]);

  useEffect(() => {
    setCurrMajor(degreeAndMajors[currDegree] || []);
    if (!degreeAndMajors[currDegree]?.includes(currMa)) {
      setValue("major", "");
    }
  }, [currDegree, setValue]);

  return (
    <View style={styles.main}>
      <View className="flex w-full items-center ">
        {/* Header */}
        <View style={styles.titlemargin} className="flex items-start  w-full">
          <Title>Student Setup</Title>
        </View>

        <View style={styles.mainContainer} className="w-full ">
          <View>
            <SelectUniversityDropdownBottomSheet
              placeholder="Select University Name"
              icon="single"
              search={true}
              control={control}
              name="universityName"
              rules={{ required: "University is required!" }}
              setValue={setValue}
              isMarginBottom={false}
              label="University"
            />
            {universityName && (
              <View className="flex flex-row items-center gap-2 mt-4">
                <Text className="text-[12px] text-neutral-500 text-start">
                  Join the university community after signing up
                </Text>
                <Controller
                  name={"isJoinUniversity"}
                  control={control}
                  // rules={{ required: 'This field is required.' }}
                  render={({ field }) => (
                    <View className="flex items-center gap-2">
                      <CustomSwitch
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </View>
                  )}
                />
              </View>
            )}
          </View>
          <SelectInputWithSearch
            isLabelShown={true}
            placeholder="Year"
            name="year"
            options={Object.keys(degreeAndMajors)}
            control={control}
            search={true}
            isMarginBottom={false}
            rules={{ required: "Year is required!" }}
            label="Year"
          />

          <View className="w-full flex flex-col relative ">
            <SelectInputWithSearch
              isLabelShown={true}
              placeholder="Select a major"
              name="major"
              options={currMajor}
              control={control}
              search={true}
              label="Major"
              rules={{ required: "major is required!" }}
              desc="If your major is not listed, choose the one that is closest to your current major."
            />
          </View>
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
  );
};

export default ProfileStudentForm;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  titlemargin: {
    marginBottom: 32,
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 32,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginTop: 64,
  },
});
