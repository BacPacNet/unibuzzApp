import BackHeader from "@/components/atoms/BackHeader";
import MultiSelectDropdown from "@/components/atoms/MultiSelectDropDown";
import ReusableButton from "@/components/atoms/ReusableButton";
import SelectUniversityDropdownBottomSheet from "@/components/atoms/SelectUniversityDropDownBottomSheet";
import RoleSelectorWithFields from "@/components/molecules/SearchCommunity/UserSelectionFields";
import { FONTS } from "@/constants/fonts";
import { defaultBottomSheetSnapPoints } from "@/types/constant";
import { RootStackParamList } from "@/types/navigation";
import {
  degreeAndMajors,
  occupationAndDepartment,
  value,
} from "@/types/register";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Refresh } from "iconoir-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { Toast } from "react-native-toast-notifications";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useCustomBackHandler from "@/hooks/useCustomBackHandler";
import { isApplicantRole } from "@/lib/userProfileSubtitle";
import { getUserProfileStore } from "@/storage/user";
import { EmailType } from "@/types/users";

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  "ConnectionsFilter"
>;

const toVerifiedUniversityFormValues = (university: EmailType) => ({
  universityName: university.UniversityName ?? "",
  universityId: university._id ?? "",
  communityId: university.communityId ?? "",
});

const ConnectionsFilter = () => {
  const navigation = useNavigation<NavigationProp>();
  const paramValues: any = useRoute().params;
  const insets = useSafeAreaInsets();
  const userProfileData = getUserProfileStore();
  const isApplicantUser = isApplicantRole(userProfileData?.role);
  const firstVerifiedUniversity = userProfileData?.email?.[0];
  const {
    register: GroupRegister,
    watch,
    control,
    handleSubmit: handleGroupCreate,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm<any>({
    defaultValues: {
      studentYear: [],
      major: [],
      occupation: [],
      affiliation: [],

      selectedUsers: [],
    },
  });

  const yearActionSheetRef = useRef<ActionSheetRef>(null);
  const majorActionSheetRef = useRef<ActionSheetRef>(null);
  const occupationActionSheetRef = useRef<ActionSheetRef>(null);
  const affiliationActionSheetRef = useRef<ActionSheetRef>(null);

  const [selectedType, setSelectedType] = useState<
    "student" | "faculty" | null
  >(null);

  const studentYear = watch("studentYear") || "";
  const major = watch("major") || "";
  const occupation = watch("occupation") || "";
  const affiliation = watch("affiliation") || "";

  const universityName = watch("universityName");

  const handleRemove = (fieldName: any, itemToRemove: string) => {
    const currentValue = (watch(fieldName) as string[]) || [];
    const updatedValue = currentValue.filter((item) => item !== itemToRemove);
    setValue(fieldName, updatedValue);
  };

  const handleApplyFilters = () => {
    const { logoUrl, ...filteredValues } = getValues();

    filteredValues.role = selectedType;
    if (
      isApplicantUser &&
      selectedType &&
      !filteredValues?.universityName
    ) {
      Toast.hideAll();
      Toast.show(
        "Select university to filter based on student or faculty."
      );
      return;
    }
    if (!filteredValues?.universityName) {
      Toast.hideAll();
      Toast.show("Please select a filter to apply");
      return;
    }
    navigation.navigate("Connections", {
      values: filteredValues,
    });
  };

  useEffect(() => {
    if (paramValues?.Currvalues) {
      setValue("studentYear", paramValues?.Currvalues?.studentYear);
      setValue("major", paramValues?.Currvalues?.major);
      setValue("occupation", paramValues?.Currvalues?.occupation);
      setValue("affiliation", paramValues?.Currvalues?.affiliation);
      setValue("universityName", paramValues?.Currvalues?.universityName);
      setValue("universityId", paramValues?.Currvalues?.universityId);
      setValue("communityId", paramValues?.Currvalues?.communityId);
      setValue("selectedUsers", paramValues?.Currvalues?.selectedUsers);
      setSelectedType(paramValues?.Currvalues?.role ?? null);
      return;
    }

    setSelectedType(null);
  }, [paramValues]);

  useEffect(() => {
    if (isApplicantUser || paramValues?.Currvalues) return;
    if (firstVerifiedUniversity) {
      const values = toVerifiedUniversityFormValues(firstVerifiedUniversity);
      setValue("universityName", values.universityName);
      setValue("universityId", values.universityId);
      setValue("communityId", values.communityId);
    }
  }, [isApplicantUser, firstVerifiedUniversity, paramValues, setValue]);

  const resetFilters = () => {
    reset();
    setSelectedType(null);
    if (!isApplicantUser && firstVerifiedUniversity) {
      const values = toVerifiedUniversityFormValues(firstVerifiedUniversity);
      setValue("universityName", values.universityName);
      setValue("universityId", values.universityId);
      setValue("communityId", values.communityId);
    }
  };

  const handleBack = () => {
    if (!universityName) {
      navigation.navigate("Connections", {
        values: null,
      });
    } else {
      navigation.goBack();
    }
  };

  useCustomBackHandler(handleBack);

  return (
    <ScrollView style={styles.container}>
      <View
        style={{ marginRight: 8 }}
        className="flex-row items-center justify-between"
      >
        <BackHeader label="Connections" onPress={handleBack} />

        <TouchableOpacity
          onPress={() => {
            resetFilters();
          }}
          style={styles.refreshButton}
        >
          <Refresh width={20} height={20} color={"#6744FF"} />
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bulkContainer}>
        {isApplicantUser ? (
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
        ) : null}
        <RoleSelectorWithFields
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          disabled={!universityName}
          studentFields={{
            chips: [
              {
                key: "year",
                value: studentYear,
                onRemove: (val) => handleRemove("studentYear", val),
              },
              {
                key: "major",
                value: major,
                onRemove: (val) => handleRemove("major", val),
              },
            ],
            buttons: [
              {
                text: "Add Year",
                onPress: () => yearActionSheetRef.current?.show(),
                label: "Add Year",
              },
              {
                text: "Add Major",
                onPress: () => majorActionSheetRef.current?.show(),
                label: "Add Major",
              },
            ],
          }}
          facultyFields={{
            chips: [
              {
                key: "occupation",
                value: occupation,
                onRemove: (val) => handleRemove("occupation", val),
              },
              {
                key: "affiliation",
                value: affiliation,
                onRemove: (val) => handleRemove("affiliation", val),
              },
            ],
            buttons: [
              {
                text: "Add Occupation",
                onPress: () => occupationActionSheetRef.current?.show(),
                label: "Add Occupation",
              },
              {
                text: "Add Affiliation",
                onPress: () => affiliationActionSheetRef.current?.show(),
                label: "Add Affiliation",
              },
            ],
          }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <ReusableButton
          buttonText="Apply Filters"
          onPress={handleApplyFilters}
          variant="primary"
          height={"large"}
        />
      </View>

      <ActionSheet
        ref={yearActionSheetRef}
        gestureEnabled={true}
        snapPoints={defaultBottomSheetSnapPoints}
        safeAreaInsets={insets}
      >
        <Controller
          name="studentYear"
          control={control}
          render={({ field }) => (
            <MultiSelectDropdown
              options={Object.keys(degreeAndMajors)}
              value={field.value || []}
              onChange={(val) => {
                field.onChange(val);
                yearActionSheetRef.current?.hide();
              }}
              placeholder="Select Year"
              err={false}
              multiSelect={false}
            />
          )}
        />
      </ActionSheet>
      <ActionSheet
        ref={majorActionSheetRef}
        gestureEnabled={true}
        snapPoints={defaultBottomSheetSnapPoints}
        containerStyle={styles.actionSheetContainer}
        safeAreaInsets={insets}
      >
        <Controller
          name="major"
          control={control}
          render={({ field }) => (
            <MultiSelectDropdown
              options={value}
              value={field.value || []}
              onChange={field.onChange}
              placeholder="Add By Major"
              err={false}
              search={true}
              parentCategory={studentYear}
            />
          )}
        />
      </ActionSheet>

      <ActionSheet
        ref={occupationActionSheetRef}
        gestureEnabled={true}
        snapPoints={defaultBottomSheetSnapPoints}
        containerStyle={styles.actionSheetContainer}
        safeAreaInsets={insets}
      >
        <Controller
          name="occupation"
          control={control}
          render={({ field }) => (
            <MultiSelectDropdown
              options={Object.keys(occupationAndDepartment)}
              value={field.value || []}
              onChange={(val) => {
                field.onChange(val);
                occupationActionSheetRef.current?.hide();
              }}
              placeholder="Add By Major"
              err={false}
              search={true}
              multiSelect={false}
            />
          )}
        />
      </ActionSheet>
      <ActionSheet
        ref={affiliationActionSheetRef}
        gestureEnabled={true}
        snapPoints={defaultBottomSheetSnapPoints}
        containerStyle={styles.actionSheetContainer}
        safeAreaInsets={insets}
      >
        <Controller
          name="affiliation"
          control={control}
          render={({ field }) => (
            <MultiSelectDropdown
              options={value}
              value={field.value || []}
              onChange={field.onChange}
              placeholder="Add By Major"
              err={false}
              search={true}
              parentCategory={occupation}
            />
          )}
        />
      </ActionSheet>
    </ScrollView>
  );
};

export default ConnectionsFilter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardAvoid: {
    flex: 1,
  },

  bulkContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginTop: 32,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 32,
    marginHorizontal: 16,
    marginTop: 32,
  },
  actionSheetContainer: {
    height: "100%",
  },
  refreshButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F3F2FF",
    borderWidth: 1,
    borderColor: "#E9E8FF",
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: "#6744FF",
    fontSize: 12,
    fontFamily: FONTS.inter.medium,
  },
});
