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
import { NavArrowDown, Search } from "iconoir-react-native";
import { useGetCommunity } from "@/services/university-community";
import {
  filterData,
  filterFacultyData,
  getUniqueById,
} from "@/lib/communityGroup";
import { useNewCommunityGroupStatesContext } from "@/context/NewCommunityGroupStatesProvider/NewCommunityGroupStatesProvider";
import { useNavigation } from "@react-navigation/native";
import { useCommunityUsers } from "@/services/community";

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
  const { data: communityUsersData, hasNextPage:communityHasNextPage, isFetchingNextPage:communityIsFetchingNextPage, fetchNextPage:communityFetchNextPage } = useCommunityUsers(communityId, true, "")

    const communityUsers = communityUsersData?.pages.flatMap((page) => page.data).filter((user) => user.users_id !== userProiledata?.users_id) || []

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
        <Text style={styles.inputLabels}>Individuals</Text>

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
          variant="border_primary"
          height="large"
        />

        {showbulk ? (
          <View style={styles.bulkContainer}>
            <DummyButton
              label="University"
              //   onPress={() => universityActionSheetRef.current?.show()}
              toShowCross={!!community.name}
              //   text={
              //     community.name
              //       ? community.name
              //       : "If you are a student choose your current year"
              //   }
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
        ) : (
          <View></View>
        )}

        <View style={styles.addUsersContainer}>
          <ReusableButton
            onPress={() => handleAddUsers()}
            buttonText="Add Users"
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
              onChange={field.onChange}
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
              onChange={field.onChange}
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
              onChange={field.onChange}
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
              onChange={field.onChange}
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
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 8,
  },

  content: {
    padding: 16,
  },
  section: {
    marginBottom: 12,
  },
  photoSection: {
    alignItems: "flex-start",
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 16,
    color: "#1F2937",
  },
  profileImageContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  photoUpload: {
    width: 160,
    height: 160,
    borderRadius: 200,
    borderWidth: 2,
    borderColor: "#9685FF",
    alignItems: "center",
    justifyContent: "center",
  },
  photoUploadText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
  },

  bannerUpload: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#9685FF",
    alignItems: "center",
    justifyContent: "center",
  },

  inputLabels: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 4,
    color: "#1F2937",
  },
  selectedChipContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",

    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#6744FF",
    backgroundColor: "#6647FF",
    marginRight: 8,

    height: 28,
    width: "auto",
    marginVertical: 8,
  },
  filterChipText: {
    color: "white",
    marginRight: 4,
  },
  individualsContainer: {
    display: "flex",
    marginBottom: 16,
    gap: 16,
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
});
