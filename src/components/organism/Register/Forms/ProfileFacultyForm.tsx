import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { View, Text, Switch } from "react-native";

import Title from "@/components/atoms/Title";
import SupportingText from "@/components/atoms/SupportingText";

import { occupationAndDepartment } from "@/types/register";

import ReusableButton from "@/components/atoms/ReusableButton";
import { SelectInputWithSearch } from "@/components/atoms/SelectInputWithSearch";
import SelectUniversityDropdownBottomSheet from "@/components/atoms/SelectUniversityDropDownBottomSheet";

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
    <View className="w-full">
      <View className="flex  items-center text-center p-4 ">
        <Title>Faculty Setup</Title>
        <SupportingText>
          Enter your faculty information for networking
        </SupportingText>
      </View>

      <View className="w-full flex  mb-4">
        <View
          style={{ height: 40 }}
          className={`flex flex-row justify-between items-center border border-neutral-300 rounded-lg p-2   bg-white mb-4`}
        >
          <Text className={`text-md text-neutral-900 `}>{userType}</Text>
        </View>

        {/* <SelectUniversityDropdownBottomSheet
          placeholder="Select University Name"
          icon="single"
          search={true}
          control={control}
          name="universityName"
          rules={{ required: "University is required!" }}
          setValue={setValue}
        /> */}
        <View className="mb-4">
          <SelectUniversityDropdownBottomSheet
            placeholder="Select University Name"
            icon="single"
            search={true}
            control={control}
            name="universityName"
            rules={{ required: "University is required!" }}
            setValue={setValue}
            isMarginBottom={false}
          />
          <View className="flex flex-row items-center">
            <Text className="text-[12px] text-neutral-500 text-start">
              Join the university community after signing up
            </Text>
            <Controller
              name={"isJoinUniversity"}
              control={control}
              // rules={{ required: 'This field is required.' }}
              render={({ field }) => (
                <View className="flex items-center gap-2">
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={field.value ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={field.onChange}
                    value={field.value}
                  />
                </View>
              )}
            />
          </View>
        </View>

        <SelectInputWithSearch
          label="Occupation"
          isLabelShown={false}
          placeholder="Select a occupation"
          name="occupation"
          options={Object.keys(occupationAndDepartment)}
          control={control}
          search={true}
          required
          rules={{ required: "Occupation is required!" }}
        />

        <SelectInputWithSearch
          isLabelShown={false}
          placeholder="Select a Department/Affiliation "
          options={currDepartment}
          name="department"
          control={control}
          required
          rules={{ required: "Department is required!" }}
        />
      </View>

      <ReusableButton
        onPress={handleSubmit(onSubmit)}
        buttonText="Next Step"
        variant="primary"
      />
      <ReusableButton
        onPress={handlePrev}
        buttonText="Review Profile"
        variant="shade"
      />

      <Text className="text-md text-neutral-600 text-center">
        You can add more profile information later in your profile settings!
      </Text>
    </View>
  );
};

export default ProfileFacultyForm;
