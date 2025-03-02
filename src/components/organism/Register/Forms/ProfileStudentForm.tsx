import React, { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import Title from "@/components/atoms/Title";
import SupportingText from "@/components/atoms/SupportingText";

import SelectUniversityDropdown from "@/components/atoms/SelectUniversityDropdown";
import { currYear, degreeAndMajors } from "@/types/register";
import SelectDropdown from "@/components/atoms/SelectDropdown";
import ReusableButton from "@/components/atoms/ReusableButton";
import SelectUniversityDropdownBottomSheet from "@/components/atoms/SelectUniversityDropDownBottomSheet";
import { SelectInputWithSearch } from "@/components/atoms/SelectInputWithSearch";

const ProfileStudentForm = ({
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

  type DegreeKeys = keyof typeof degreeAndMajors;
  const currDegree: DegreeKeys = watch("degree");
  const currMa: DegreeKeys = watch("major");
  const userType = getValues("userType");

  const [currMajor, setCurrMajor] = useState<any>([]);

  useEffect(() => {
    setCurrMajor(degreeAndMajors[currDegree] || []);
    if (!degreeAndMajors[currDegree]?.includes(currMa)) {
      setValue("major", "");
    }
  }, [currDegree, setValue]);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      nestedScrollEnabled={true}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ gap: 0 }} className="w-full  flex flex-col items-center">
        <View className="flex  items-center text-center p-4 ">
          <Title>Profile Setup</Title>
          <SupportingText>
            Enter your profile information for networking
          </SupportingText>
        </View>

        <View className="w-full flex flex-col gap-0 mb-4">
          <View
            style={{ height: 40 }}
            className={`flex flex-row justify-between items-center border border-neutral-300 rounded-lg p-2   bg-white mb-4`}
          >
            <Text className={`text-md text-neutral-900 `}>{userType}</Text>
          </View>

          <SelectUniversityDropdownBottomSheet
            placeholder="Select University Name"
            icon="single"
            search={true}
            control={control}
            name="universityName"
            rules={{ required: "University is required!" }}
            setValue={setValue}
          />

          <SelectInputWithSearch
            isLabelShown={false}
            placeholder="Year"
            name="year"
            options={currYear}
            control={control}
            search={true}
            required
            rules={{ required: "Year is required!" }}
          />

          <SelectInputWithSearch
            isLabelShown={false}
            placeholder="Select a degree"
            name="degree"
            options={Object.keys(degreeAndMajors)}
            control={control}
            search={true}
            required
            rules={{ required: "degree is required!" }}
          />

          <View className="w-full flex flex-col relative mb-4">
            <SelectInputWithSearch
              isLabelShown={false}
              placeholder="Select a major"
              name="major"
              options={currMajor}
              control={control}
              search={true}
              required
              rules={{ required: "major is required!" }}
            />
            <Text className={`text-md text-neutral-400 text-center`}>
              If your major is not listed, choose the one that is closest to
              your current major.
            </Text>
          </View>
        </View>

        <ReusableButton
          onPress={handleSubmit(onSubmit)}
          buttonText="Next Step"
          variant="primary"
        />

        <Text className="text-[12px] text-neutral-600 text-center">
          You can add more profile information later in your profile settings!
        </Text>
      </View>
    </ScrollView>
  );
};

export default ProfileStudentForm;
