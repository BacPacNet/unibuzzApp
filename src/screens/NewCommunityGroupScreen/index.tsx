import { FormInput } from "@/components/atoms/FormInput";
import MultiSelectDropdown from "@/components/atoms/MultiSelectDropDown";
import RadioInput from "@/components/atoms/RadioInput";
import ReusableButton from "@/components/atoms/ReusableButton";
import TextAreaWithWordCount from "@/components/atoms/TextAreaWIthWordCount";
import SelectCommunityUsersBottomSheet from "@/components/molecules/CreateNewGroup/SelectCommunityUsersBottomSheet";
import SelectedChip from "@/components/molecules/CreateNewGroup/SelectedChip";
import SelectedUserChips from "@/components/molecules/CreateNewGroup/SelectedUserChips";
import { useCommunityFilterContext } from "@/context/CommunityFilterProvider/CommunityFilterProvider";
import { useHeader } from "@/context/HeaderProvider/Header";
import {
  filterData,
  filterFacultyData,
  getUniqueById,
} from "@/lib/communityGroup";
import { useCreateCommunityGroup } from "@/services/community-group";
import {
  useGetCommunity,
  useGetFilteredSubscribedCommunities,
} from "@/services/university-community";
import { useUploadToS3 } from "@/services/upload";
import { replaceImage } from "@/services/uploadImage";
import { getUserStore } from "@/storage/user";
import { CommunityUsers } from "@/types/Community";
import { CreateCommunityGroupType } from "@/types/CommunityGroup";
import { RootStackParamList } from "@/types/navigation";
import {
  degreeAndMajors,
  occupationAndDepartment,
  value,
} from "@/types/register";
import { UPLOAD_CONTEXT } from "@/types/uploads";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MediaImage, NavArrowLeft, Xmark } from "iconoir-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { launchImageLibrary } from "react-native-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

type ImageAsset = {
  uri: string;
  fileName?: string;
  fileSize?: number;
  height?: number;
  width?: number;
  type?: string;
};

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  "NewCommunityGroupScreen"
>;

const NewCommunityGroupScreen = () => {
  const navigate = useNavigation<NavigationProp>();
  const route = useRoute();

  const { communityId } = route.params as any;
  const { changeHeaderShownStatus } = useHeader();
  const { data: communityData, isFetching } = useGetCommunity(communityId);
  const { createSelectedFilters, setCreateSelectedFilters } =
    useCommunityFilterContext();
  const { mutate: createGroup, isPending } = useCreateCommunityGroup();
  const { mutateAsync: uploadToS3 } = useUploadToS3();
  const { mutate } = useGetFilteredSubscribedCommunities(communityId);

  const {
    register: GroupRegister,
    watch,
    control,
    handleSubmit: handleGroupCreate,
    formState: { errors },
    setValue,
  } = useForm<CreateCommunityGroupType>({
    defaultValues: {
      communityGroupLogoUrl: null,
      communityGroupLogoCoverUrl: null,
      title: "",
      description: "",
      communityGroupAccess: "",
      communityGroupType: "",
      selectedUsers: [],
    },
  });
  const categoryRef = useRef<HTMLDivElement>(null);
  const SelectedUsers = watch("selectedUsers") as unknown as CommunityUsers[];
  const description = watch("description") || "";
  const studentYear = watch("studentYear") || "";
  const major = watch("major") || "";
  const occupation = watch("occupation") || "";
  const affiliation = watch("affiliation") || "";

  const [previewProfileImage, setPreviewProfileImage] = useState<string | null>(
    null,
  );
  const [previewBannerImage, setPreviewBannerImage] = useState<string | null>(
    null,
  );
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [imageToUpload, setImageToUpload] = useState<ImageAsset | null>(null);
  const [bannerToUpload, setBannerToUpload] = useState<ImageAsset | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [individualsUsers, setIndividualsUsers] = useState<any[]>([]);
  const [filteredUsers, setFilterUsers] = useState<any>();
  const [filteredFacultyUsers, setFilterFacultyUsers] = useState<any>();
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const yearActionSheetRef = useRef<ActionSheetRef>(null);
  const majorActionSheetRef = useRef<ActionSheetRef>(null);
  const occupationActionSheetRef = useRef<ActionSheetRef>(null);
  const affiliationActionSheetRef = useRef<ActionSheetRef>(null);
  useFocusEffect(
    useCallback(() => {
      changeHeaderShownStatus(false);

      return () => {
        changeHeaderShownStatus(true);
      };
    }, []),
  );

  const handleNavigateToFilterScreen = () => {
    navigate.navigate("manageGroupStack", {
      screen: "NewCommunityGroupFilterScreen",
    });
  };

  const handleImagePick = async () => {
    launchImageLibrary({ mediaType: "photo" }, (response: any) => {
      if (!response.didCancel && !response.errorCode) {
        const imageObject = response.assets[0];
        setImageToUpload(imageObject);
      }
    });
  };
  const handleBannerPick = async () => {
    launchImageLibrary({ mediaType: "photo" }, (response: any) => {
      if (!response.didCancel && !response.errorCode) {
        const imageObject = response.assets[0];
        setBannerToUpload(imageObject);
      }
    });
  };

  const handleRemove = (fieldName: any, itemToRemove: string) => {
    const currentValue = (watch(fieldName) as string[]) || [];
    const updatedValue = currentValue.filter((item) => item !== itemToRemove);
    setValue(fieldName, updatedValue);
  };
  const onSubmit = async (data: CreateCommunityGroupType) => {
    let logoImageData;
    let CoverImageData;

    if (bannerToUpload) {
      const uploadPayload = {
        files: [bannerToUpload],
        context: UPLOAD_CONTEXT.DP,
      };

      CoverImageData = await uploadToS3(uploadPayload);
      setValue("communityGroupLogoCoverUrl", CoverImageData.data[0]);
    }
    if (imageToUpload) {
      const uploadPayload = {
        files: [imageToUpload],
        context: UPLOAD_CONTEXT.COVER_DP,
      };
      logoImageData = await uploadToS3(uploadPayload);
      setValue("communityGroupLogoUrl", logoImageData as any);
    }

    const communityGroupCategory = {
      communityGroupCategory: createSelectedFilters,
    };

    const mergedUsers = [
      ...individualsUsers,
      ...SelectedUsers,
      ...filteredUsers,
      ...filteredFacultyUsers,
    ];
    const uniqueUsers = getUniqueById(mergedUsers);
    const payload = {
      ...data,
      ...communityGroupCategory,
      selectedUsers: uniqueUsers,
      communityGroupLogoUrl: logoImageData?.data[0],
      communityGroupLogoCoverUrl: CoverImageData?.data[0],
      universityAdminId: communityData?.adminId,
    };

    createGroup(
      { communityId: communityId, data: payload },
      {
        onSuccess: () => {
          setCreateSelectedFilters([]);
          setIsProfileLoading(false);

          navigate.navigate("manageGroupStack", {
            screen: "SearchCommunityGroupScreen",

            params: { communityId: communityId, change: Date.now() },
          });
        },
      },
    );
  };

  const removeUser = (userId: string) => {
    setIndividualsUsers((prev: any[]) => prev.filter((u) => u._id !== userId));
  };

  useEffect(() => {
    const allUsers = communityData?.users || [];
    const allStudentUsers = allUsers.filter((user) => user.role == "student");

    const filters = { year: studentYear, major: major };

    const filtered = filterData(allStudentUsers, filters);

    setFilterUsers(filtered);
  }, [studentYear, major, communityData]);

  useEffect(() => {
    const allUsers = communityData?.users || [];
    const allFacultyUsers = allUsers.filter((user) => user.role == "faculty");

    const filters = { occupation: occupation, affiliation: affiliation };
    const filtered = filterFacultyData(allFacultyUsers, filters);

    setFilterFacultyUsers(filtered);
  }, [occupation, affiliation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigate.goBack()}
          style={styles.backButton}
        >
          <NavArrowLeft width={24} height={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Group</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView>
          <View style={styles.content}>
            {/* Profile Photo */}
            <View style={styles.photoSection}>
              <Text style={styles.sectionTitle}>Profile Photo</Text>

              <View style={styles.profileImageContainer}>
                <TouchableOpacity
                  onPress={() => handleImagePick()}
                  style={styles.photoUpload}
                >
                  {imageToUpload ? (
                    <Image
                      source={{ uri: imageToUpload.uri }}
                      className="w-full h-full rounded-full absolute"
                    />
                  ) : (
                    previewProfileImage && (
                      <Image
                        source={{ uri: previewProfileImage }}
                        className="w-full h-full rounded-full absolute"
                      />
                    )
                  )}
                  <MediaImage width={32} height={32} color="#9CA3AF" />
                  <Text style={styles.photoUploadText}>Select Image</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* banner photo  */}
            <View style={styles.photoSection}>
              <Text style={styles.sectionTitle}>Banner Photo</Text>

              <View style={styles.profileImageContainer}>
                <TouchableOpacity
                  onPress={() => handleBannerPick()}
                  style={styles.bannerUpload}
                >
                  {bannerToUpload ? (
                    <Image
                      source={{ uri: bannerToUpload.uri }}
                      className="w-full h-full  absolute"
                    />
                  ) : (
                    previewBannerImage && (
                      <Image
                        source={{ uri: previewBannerImage }}
                        className="w-full h-full  absolute"
                      />
                    )
                  )}
                  <MediaImage width={32} height={32} color="#9CA3AF" />
                  <Text style={styles.photoUploadText}>Select Image</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Group Name */}
            <View style={styles.section}>
              <Text style={styles.inputLabels}>Group Name</Text>

              <FormInput
                placeholder="Enter Group Name"
                isLabelShown={false}
                required
                name="title"
                control={control}
                rules={{
                  required: "This field is required",
                }}
                isError={!!errors.title}
                errorMessage={errors.title?.message}
              />
            </View>
            {/* Group Name */}
            <View style={styles.section}>
              <Text style={styles.inputLabels}>Group Description</Text>

              <TextAreaWithWordCount
                control={control}
                name="description"
                maxChars={160}
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.inputLabels}>Group Access</Text>
              <RadioInput
                name="communityGroupAccess"
                control={control}
                options={[
                  {
                    label: "Public",
                    value: "Public",
                    details: "Anyone can join",
                  },
                  {
                    label: "Private",
                    value: "Private",
                    details: "Permission to join required",
                  },
                ]}
                required
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.inputLabels}>Group Type</Text>
              <RadioInput
                name="communityGroupType"
                control={control}
                options={[
                  {
                    label: "Casual",
                    value: "Casual",
                    details: "No approval required",
                  },
                  {
                    label: "Official",
                    value: "Official",
                    details: "Require university approval",
                  },
                ]}
                required
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.inputLabels}>Group Category</Text>
              {Object.values(createSelectedFilters).flat()?.length ? (
                <SelectedChip
                  selectedItem={[
                    Object.values(createSelectedFilters)
                      .flat()
                      ?.length?.toString() + " Categories Selected",
                  ]}
                  onRemove={() => setCreateSelectedFilters([])}
                />
              ) : (
                ""
              )}

              <ReusableButton
                buttonText="Select Group Category"
                variant="shade"
                onPress={() => handleNavigateToFilterScreen()}
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.inputLabels}>Add Members</Text>

              <View>
                <SelectedUserChips
                  selectedUsers={individualsUsers}
                  onRemove={(id) => removeUser(id as string)}
                />
                <ReusableButton
                  onPress={() => actionSheetRef.current?.show()}
                  buttonText="Add Individuals"
                  variant="shade"
                />
              </View>
              <View>
                <SelectedChip
                  selectedItem={studentYear}
                  //   onRemove={(id) => console.log(id as string)}
                  onRemove={(year) => handleRemove("studentYear", year)}
                />
                <ReusableButton
                  onPress={() => yearActionSheetRef.current?.show()}
                  buttonText="Add Year"
                  variant="shade"
                />
              </View>
              <View>
                <SelectedChip
                  selectedItem={major}
                  onRemove={(Major) => handleRemove("major", Major)}
                />
                <ReusableButton
                  onPress={() => majorActionSheetRef.current?.show()}
                  buttonText="Add Major"
                  variant="shade"
                />
              </View>
              <View>
                <SelectedChip
                  selectedItem={occupation}
                  onRemove={(occupation) =>
                    handleRemove("occupation", occupation)
                  }
                />
                <ReusableButton
                  onPress={() => occupationActionSheetRef.current?.show()}
                  buttonText="Add Occupation"
                  variant="shade"
                />
              </View>
              <View>
                <SelectedChip
                  selectedItem={affiliation}
                  onRemove={(affiliation) =>
                    handleRemove("affiliation", affiliation)
                  }
                />
                <ReusableButton
                  onPress={() => affiliationActionSheetRef.current?.show()}
                  buttonText="Add Affiliation"
                  variant="shade"
                />
              </View>
            </View>
            <ReusableButton
              //   onPress={handleSubmit(onSubmit)}
              onPress={handleGroupCreate(onSubmit)}
              buttonText="Create Group"
              variant="primary"
              isLoading={isProfileLoading || isPending}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ActionSheet
        ref={actionSheetRef}
        gestureEnabled={true}
        snapPoints={[70, 100]}
        onClose={() => setSearchInput("")}
      >
        <SelectCommunityUsersBottomSheet
          setSelectedUsers={setIndividualsUsers}
          selectedUsers={individualsUsers}
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
        containerStyle={{
          height: "100%",
        }}
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
        containerStyle={{
          height: "100%",
        }}
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
        containerStyle={{
          height: "100%",
        }}
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
    </SafeAreaView>
  );
};

export default NewCommunityGroupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
    marginBottom: 32,
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
});
