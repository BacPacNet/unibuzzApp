import React, { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { View, Text, TouchableOpacity } from "react-native";

import Title from "@/components/atoms/Title";
import SupportingText from "@/components/atoms/SupportingText";

import SelectUniversityDropdown from "@/components/atoms/SelectUniversityDropdown";
import {
  currYear,
  degreeAndMajors,
  occupationAndDepartment,
} from "@/types/register";
import SelectDropdown from "@/components/atoms/SelectDropdown";

const ProfileFacultyForm = ({
  onSubmit,
}: {
  onSubmit: (data: any) => Promise<void>;
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
          className={`flex flex-row justify-between items-center border border-neutral-300 rounded-lg p-2 h-14  bg-white mb-4`}
        >
          <Text className={`text-xs text-neutral-900 `}>{userType}</Text>
        </View>
        <View className="w-full flex flex-col relative mb-4">
          <Controller
            name="universityName"
            control={control}
            // rules={{ required: 'University name is required!' }}
            render={({ field }) => (
              <SelectUniversityDropdown
                value={field.value}
                onChange={(selectedUniversity: any) => {
                  field.onChange(selectedUniversity.name);
                  setValue("universityId", selectedUniversity._id);
                }}
                placeholder="Select University Name"
                icon="single"
                search={true}
                err={!!ProfileFormErrors.universityName}
              />
            )}
          />
          {ProfileFormErrors.universityName && (
            <Text className="text-red-500 text-sm mt-1">
              {ProfileFormErrors?.universityName?.message?.toString()}
            </Text>
          )}
        </View>

        <View className="w-full flex flex-col relative mb-4">
          <Controller
            name="occupation"
            control={control}
            rules={{ required: "Occupation is required!" }}
            render={({ field }) => (
              <SelectDropdown
                options={Object.keys(occupationAndDepartment)}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select a occupation"
                icon="dual"
                search={true}
                err={!!ProfileFormErrors.occupation}
              />
            )}
          />
          {ProfileFormErrors.year && (
            <Text className="text-red-500 text-sm mt-1">
              {ProfileFormErrors?.occupation?.message?.toString()}
            </Text>
          )}
        </View>

        <View className="w-full flex flex-col relative mb-4">
          <Controller
            name="department"
            control={control}
            rules={{ required: "department is required!" }}
            disabled={!currDepartment}
            render={({ field }) => (
              <SelectDropdown
                key={currDepartment}
                options={currDepartment}
                value={field.value}
                onChange={field.onChange}
                search={true}
                placeholder="Select a department"
                icon="single"
                err={!!ProfileFormErrors.department}
              />
            )}
          />
          <Text className={`text-2xs text-neutral-400 text-center`}>
            If your affiliation/department is not listed, choose the one that is
            closest to your current major.
          </Text>
          {ProfileFormErrors.major && (
            <Text className="text-red-500 text-sm mt-1">
              {ProfileFormErrors?.department?.message?.toString()}
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        className={`bg-primary-500 py-3 rounded-lg w-full mb-4`}
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-center text-white font-bold">Next Step</Text>
      </TouchableOpacity>

      <Text className="text-[12px] text-neutral-600 text-center">
        You can add more profile information later in your profile settings!
      </Text>
    </View>
  );
};

export default ProfileFacultyForm;
