import MultiSelectDropdown from "@/components/atoms/MultiSelectDropDown";
import ReusableButton from "@/components/atoms/ReusableButton";
import { SelectUserProfileChips } from "@/components/atoms/SelectedUserProfileChips";
import SelectCommunityUsersBottomSheet from "@/components/molecules/CreateNewGroup/SelectCommunityUsersBottomSheet";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import {
  degreeAndMajors,
  occupationAndDepartment,
  value,
} from "@/types/register";
import BackHeader from "@/components/atoms/BackHeader";
import RoleSelectorWithFields from "@/components/molecules/SearchCommunity/UserSelectionFields";
import { getUserProfileStore } from "@/storage/user";
import SubscribedUniveristyBottomSheet from "@/components/molecules/SearchCommunity/SubscribedUniveristyBottomSheet";
import DummyButton from "@/components/atoms/DummyButton";
import { NavArrowDown, NavArrowUp, Search } from "iconoir-react-native";
import { useGetCommunity } from "@/services/university-community";
import {
  filterData,
  filterFacultyData,
  getUniqueById,
} from "@/lib/communityGroup";
import { useNewCommunityGroupStatesContext } from "@/context/NewCommunityGroupStatesProvider/NewCommunityGroupStatesProvider";
import { useNavigation } from "@react-navigation/native";
import { useCommunityUsers } from "@/services/community";
import { FONTS } from "@/constants/fonts";

const NewCommunityGroupUsersSelectScreen = ({ route }: any) => {
  const universityName = route?.params?.universityName || "";
  const communityId = route?.params?.communityId || "";
  const isEditGroup = route?.params?.isEditGroup || false;
  const navigate = useNavigation();
  const {
    register: GroupRegister,
    watch,
    control,
    handleSubmit: handleGroupCreate,
    formState: { errors },
    setValue,
  } = useForm<any>({
    defaultValues: {
      studentYear: [],
      major: [],
      occupation: [],
      affiliation: [],
      //   community: { name: "", id: "" },
      community: { name: universityName, id: communityId },
      selectedUsers: [],
    },
  });

  const studentYear = watch("studentYear") || "";
  const major = watch("major") || "";
  const occupation = watch("occupation") || "";
  const affiliation = watch("affiliation") || "";
  const community = watch("community");

  const userProiledata = getUserProfileStore();

  const { data: communityData } = useGetCommunity(community.id);
  const {
    data: communityUsersData,
    hasNextPage: communityHasNextPage,
    isFetchingNextPage: communityIsFetchingNextPage,
    fetchNextPage: communityFetchNextPage,
  } = useCommunityUsers(communityId, true, "");

  const communityUsers =
    communityUsersData?.pages
      .flatMap((page) => page.data)
      .filter((user) => user.users_id !== userProiledata?.users_id) || [];

  const {
    studentYearState,
    setStudentYearState,
    communityState,
    setCommunityState,
    resetFilters,
    selectedUsersState,
    setSelectedUsersState,
    setMajorState,
    setAffiliationState,
    setOccupationState,
    affiliationState,
    majorState,
    occupationState,
    filteredFacultyUsersState,
    filteredUsersState,
    individualUserState,
    setFilteredFacultyUsersState,
    setIndividualUserState,
    setFilteredUsersState,
    selectedTypeState,
    setSelectedTypeState,
  } = useNewCommunityGroupStatesContext();

  const [individualsUsers, setIndividualsUsers] = useState<any[]>([]);
  const [filteredUsers, setFilterUsers] = useState<any[]>([]);
  const [filteredFacultyUsers, setFilterFacultyUsers] = useState<any[]>([]);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const yearActionSheetRef = useRef<ActionSheetRef>(null);
  const majorActionSheetRef = useRef<ActionSheetRef>(null);
  const occupationActionSheetRef = useRef<ActionSheetRef>(null);
  const affiliationActionSheetRef = useRef<ActionSheetRef>(null);
  const universityActionSheetRef = useRef<ActionSheetRef>(null);

  const [searchInput, setSearchInput] = useState<string>("");
  const [showbulk, setShowBulk] = useState(false);
  const [selectedType, setSelectedType] = useState<
    "student" | "faculty" | null
  >(null);

  const handleRemove = (fieldName: any, itemToRemove: string) => {
    const currentValue = (watch(fieldName) as string[]) || [];
    const updatedValue = currentValue.filter((item) => item !== itemToRemove);
    setValue(fieldName, updatedValue);
  };

  const removeUser = (userId: string) => {
    setIndividualsUsers((prev: any[]) => prev.filter((u) => u._id !== userId));
  };

  const handleAddUsers = () => {
    const mergedUsers = [
      ...individualsUsers,
      ...filteredUsers,
      ...filteredFacultyUsers,
    ];

    const uniqueUsers = getUniqueById(mergedUsers);

    setSelectedUsersState(uniqueUsers);

    setStudentYearState(studentYear);
    setMajorState(major);
    setOccupationState(occupation);
    setAffiliationState(affiliation);
    setCommunityState(community);
    setSelectedTypeState(selectedType);
    setIndividualUserState(individualsUsers as any);
    setFilteredUsersState(filteredUsers);
    setFilteredFacultyUsersState(filteredFacultyUsers);

    navigate.goBack();
  };

  useEffect(() => {
    const allUsers = communityUsers || [];
    const allStudentUsers = allUsers.filter((user) => user.role == "student");

    const filters = { year: studentYear, major: major };

    const filtered = filterData(allStudentUsers as any, filters);

    setFilterUsers(filtered);
  }, [studentYear, major, communityData]);

  useEffect(() => {
    const allUsers = communityUsers || [];
    const allFacultyUsers = allUsers.filter((user) => user.role == "faculty");

    const filters = { occupation: occupation, affiliation: affiliation };
    const filtered = filterFacultyData(allFacultyUsers as any, filters);

    setFilterFacultyUsers(filtered);
  }, [occupation, affiliation]);

  useEffect(() => {
    setValue("selectedUsers", selectedUsersState);
    setValue("studentYear", studentYearState);
    setValue("major", majorState);
    setValue("occupation", occupationState);
    setValue("affiliation", affiliationState);

    if (communityState?.id) {
      setValue("community", communityState);
    } else {
      setValue("community", { name: universityName, id: communityId });
    }
    setIndividualsUsers(individualUserState as any);
    setFilterUsers(filteredUsersState);
    setFilterFacultyUsers(filteredFacultyUsersState);
    setSelectedType(selectedTypeState);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <BackHeader label={isEditGroup ? "Edit Group" : "Create Group"} />
      <View style={styles.paddingContainer}>
        <Text style={styles.inputLabels}>Add Individuals</Text>

        <View style={styles.individualsContainer}>
          <DummyButton
            onPress={() => actionSheetRef.current?.show()}
            toShowCross={false}
            text={"Search Name"}
            icon={<Search width={20} height={20} />}
          />
          <SelectUserProfileChips
            individualsUsers={individualsUsers}
            onRemove={(id) => removeUser(id as string)}
          />
        </View>
        <ReusableButton
          onPress={() => setShowBulk(!showbulk)}
          buttonText="Bulk Add Members"
          buttonContent={
            <View style={styles.bulkButtonContent}>
              <Text style={styles.bulkButtonText}>Bulk Add Members</Text>
              {!showbulk ? (
                <NavArrowDown
                  width={20}
                  height={20}
                  color={"#6744FF"}
                  strokeWidth={2}
                />
              ) : (
                <NavArrowUp
                  width={20}
                  height={20}
                  color={"#6744FF"}
                  strokeWidth={2}
                />
              )}
            </View>
          }
          variant="border_primary"
          height="large"
        />

        {showbulk ? (
          <View style={styles.bulkContainer}>
            <DummyButton
              label="University"
              toShowCross={!!community.name}
              text={universityName}
              icon={<NavArrowDown width={20} height={20} />}
            />
            <RoleSelectorWithFields
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              disabled={!community.name}
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
                    text: "If you are a student choose your current year",
                    onPress: () => yearActionSheetRef.current?.show(),
                    label: "Year",
                  },
                  {
                    text: "If you are a student choose your major",
                    onPress: () => majorActionSheetRef.current?.show(),
                    label: "Major",
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
                    text: "If you are a faculty choose your occupation",
                    onPress: () => occupationActionSheetRef.current?.show(),
                    label: "Occupation",
                  },
                  {
                    text: "If you are a faculty choose your affiliation",
                    onPress: () => affiliationActionSheetRef.current?.show(),
                    label: "Affiliation",
                  },
                ],
              }}
            />
          </View>
        ) : (
          <View></View>
        )}

        <View style={styles.addUsersContainer}>
          <ReusableButton
            onPress={() => handleAddUsers()}
            buttonText="Add Members"
            variant="primary"
            height="large"
          />
        </View>
      </View>

      <ActionSheet
        ref={universityActionSheetRef}
        gestureEnabled={true}
        snapPoints={[50]}
        onClose={() => setSearchInput("")}
        containerStyle={styles.actionSheetContainer}
      >
        <SubscribedUniveristyBottomSheet
          options={userProiledata?.email || []}
          value={[]}
          onSelect={(val) => setValue("community", val)}
          err={false}
        />
      </ActionSheet>

      <ActionSheet
        ref={actionSheetRef}
        gestureEnabled={true}
        snapPoints={[50, 100]}
        onClose={() => setSearchInput("")}
      >
        <SelectCommunityUsersBottomSheet
          setSelectedUsers={setIndividualsUsers}
          selectedUsers={individualsUsers}
          communityId={communityId}
          myUserId={userProiledata?.users_id || ""}
        />
      </ActionSheet>
      <ActionSheet
        ref={yearActionSheetRef}
        gestureEnabled={true}
        // snapPoints={[70, 100]}

        onClose={() => setSearchInput("")}
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
              label="Year (Students)"
              err={false}
              //   filteredCount={filteredYearCount}
              multiSelect={false}
            />
          )}
        />
      </ActionSheet>
      <ActionSheet
        ref={majorActionSheetRef}
        gestureEnabled={true}
        // snapPoints={[70, 100]}
        onClose={() => setSearchInput("")}
        containerStyle={styles.actionSheetContainer}
      >
        <Controller
          name="major"
          control={control}
          render={({ field }) => (
            <MultiSelectDropdown
              options={value}
              value={field.value || []}
              onChange={(val) => {
                field.onChange(val);
              }}
              placeholder="Add By Major"
              label="Major (Students)"
              err={false}
              search={true}
              //   filteredCount={filteredMajorsCount}
              parentCategory={studentYear}
            />
          )}
        />
      </ActionSheet>

      <ActionSheet
        ref={occupationActionSheetRef}
        gestureEnabled={true}
        // snapPoints={[70, 100]}
        onClose={() => setSearchInput("")}
        containerStyle={styles.actionSheetContainer}
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
              label="Occupation (Faculty)"
              err={false}
              search={true}
              multiSelect={false}
              //   filteredCount={filteredOccupationCount}
            />
          )}
        />
      </ActionSheet>
      <ActionSheet
        ref={affiliationActionSheetRef}
        gestureEnabled={true}
        // snapPoints={[70, 100]}
        onClose={() => setSearchInput("")}
        containerStyle={styles.actionSheetContainer}
      >
        <Controller
          name="affiliation"
          control={control}
          render={({ field }) => (
            <MultiSelectDropdown
              options={value}
              value={field.value || []}
              onChange={(val) => {
                field.onChange(val);
              }}
              placeholder="Add By Major"
              label="Affiliation/Department (Faculty)"
              err={false}
              search={true}
              //   filteredCount={filteredAffiliationCount}
              parentCategory={occupation}
            />
          )}
        />
      </ActionSheet>
    </ScrollView>
  );
};

export default NewCommunityGroupUsersSelectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  paddingContainer: {
    paddingHorizontal: 16,
    marginTop: 32,
  },

  inputLabels: {
    fontSize: 14,
    fontFamily: FONTS.inter.medium,

    color: "#171717",
  },

  individualsContainer: {
    display: "flex",
    marginBottom: 32,
    paddingTop: 8,
  },
  bulkContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginTop: 32,
  },
  addUsersContainer: {
    marginTop: 32,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  actionSheetContainer: {
    height: "100%",
  },
  bulkButtonText: {
    fontSize: 16,
    fontFamily: FONTS.inter.medium,
    color: "#6744FF",
  },
  bulkButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
