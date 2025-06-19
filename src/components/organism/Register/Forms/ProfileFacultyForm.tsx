import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { View, Text, StyleSheet } from "react-native";
import Title from "@/components/atoms/Title";
import { occupationAndDepartment } from "@/types/register";
import ReusableButton from "@/components/atoms/ReusableButton";
import { SelectInputWithSearch } from "@/components/atoms/SelectInputWithSearch";
import SelectUniversityDropdownBottomSheet from "@/components/atoms/SelectUniversityDropDownBottomSheet";
import CustomSwitch from "@/components/atoms/CustomSwitch";

const ProfileFacultyForm = ({
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

  type occupationKeys = keyof typeof occupationAndDepartment;
  const currOccupation: occupationKeys = watch("occupation");
  const currFormDepartment: occupationKeys = watch("department");
  const universityName = watch("universityName");

  const [currDepartment, setCurrDepartment] = useState<any>([]);

  useEffect(() => {
    setCurrDepartment(occupationAndDepartment[currOccupation] || []);
    if (
      !occupationAndDepartment[currOccupation]?.includes(currFormDepartment)
    ) {
      setValue("department", "");
    }
  }, [currOccupation, setValue]);
  const userType = getValues("userType");

  return (
    <View style={styles.main}>
      <View className="flex w-full items-center ">
        <View style={styles.titlemargin} className="flex items-start  w-full">
          <Title>Faculty Setup</Title>
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
            label="Occupation"
            isLabelShown={true}
            placeholder="Select a occupation"
            name="occupation"
            options={Object.keys(occupationAndDepartment)}
            control={control}
            search={true}
            rules={{ required: "Occupation is required!" }}
            isMarginBottom={false}
            desc="If your occupation is not listed, choose the one that is closest to your current major."
          />

          <SelectInputWithSearch
            isLabelShown={true}
            placeholder="Select a Department/Affiliation "
            options={currDepartment}
            name="department"
            control={control}
            label="Department"
            rules={{ required: "Department is required!" }}
          />
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
          buttonText="Review Profile"
          variant="shade"
          height="large"
        />
      </View>
    </View>
  );
};

export default ProfileFacultyForm;

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
