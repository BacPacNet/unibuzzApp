import { FormInput } from "@/components/atoms/FormInput";
import RadioInput from "@/components/atoms/RadioInput";
import ReusableButton from "@/components/atoms/ReusableButton";
import TextAreaWithWordCount from "@/components/atoms/TextAreaWIthWordCount";
import SelectUsersForGroupChat from "@/components/molecules/Message/SelectUsersForGroupChat";
import SelectCommunityUsersBottomSheet from "@/components/molecules/SelectCommunityUsersBottomSheet";
import { useCommunityFilterContext } from "@/context/CommunityFilterProvider/CommunityFilterProvider";
import { useHeader } from "@/context/HeaderProvider/Header";
import { useCreateCommunityGroup } from "@/services/community-group";
import { useGetCommunity } from "@/services/university-community";
import { replaceImage } from "@/services/uploadImage";
import { getUserStore } from "@/storage/user";
import { CreateCommunityGroupType } from "@/types/CommunityGroup";
import { RootStackParamList } from "@/types/navigation";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MediaImage, NavArrowLeft, User, Xmark } from "iconoir-react-native";
import React, { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
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
  const userData = getUserStore();
  const { communityId } = route.params as any;
  const { changeHeaderShownStatus } = useHeader();
  const { data: communityData, isFetching } = useGetCommunity(communityId);
  const { createSelectedFilters, setCreateSelectedFilters } =
    useCommunityFilterContext();
  const { mutate: createGroup, isPending } = useCreateCommunityGroup();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateCommunityGroupType>();

  const [previewProfileImage, setPreviewProfileImage] = useState<string | null>(
    null
  );
  const [previewBannerImage, setPreviewBannerImage] = useState<string | null>(
    null
  );
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [imageToUpload, setImageToUpload] = useState<ImageAsset | null>(null);
  const [bannerToUpload, setBannerToUpload] = useState<ImageAsset | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<any>([]);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  useFocusEffect(
    useCallback(() => {
      changeHeaderShownStatus(false);

      return () => {
        changeHeaderShownStatus(true);
      };
    }, [])
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

  const onSubmit = async (data: CreateCommunityGroupType) => {
    // return console.log("data", data, "fil", createSelectedFilters);
    let logoImageData;
    let CoverImageData;

    if (imageToUpload) {
      setIsProfileLoading(true);
      const UploadedImageLink = await replaceImage(imageToUpload, "");

      logoImageData = {
        imageUrl: UploadedImageLink?.imageUrl,
        publicId: UploadedImageLink?.publicId,
      };
    }
    if (bannerToUpload) {
      setIsProfileLoading(true);
      const UploadedImageLink = await replaceImage(bannerToUpload, "");

      CoverImageData = {
        imageUrl: UploadedImageLink?.imageUrl,
        publicId: UploadedImageLink?.publicId,
      };
    }

    const communityGroupCategory = {
      communityGroupCategory: createSelectedFilters,
    };

    const payload = {
      ...data,
      ...communityGroupCategory,
      communityGroupLogoUrl: logoImageData,
      communityGroupLogoCoverUrl: CoverImageData,
    };

    // return console.log("payy", payload);

    createGroup({ communityId: communityId, data: payload });
    setCreateSelectedFilters([]);
    setIsProfileLoading(false);
    navigate.goBack();
  };

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
                <TouchableOpacity style={styles.filterChip}>
                  <Text style={styles.filterChipText}>
                    {Object.values(createSelectedFilters).flat()?.length}{" "}
                    Categories Selected
                  </Text>
                  <Xmark
                    onPress={() => setCreateSelectedFilters([])}
                    width={24}
                    height={24}
                    color="#000"
                  />
                </TouchableOpacity>
              ) : (
                <View></View>
              )}
              <ReusableButton
                buttonText="Select Group Category"
                variant="shade"
                onPress={() => handleNavigateToFilterScreen()}
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.inputLabels}>Add Members</Text>
              {selectedUsers?.length ? (
                <TouchableOpacity style={styles.filterChip}>
                  <Text style={styles.filterChipText}>
                    {selectedUsers?.length} Users Selected
                  </Text>
                  <Xmark
                    onPress={() => setSelectedUsers([])}
                    width={24}
                    height={24}
                    color="#000"
                  />
                </TouchableOpacity>
              ) : (
                <View></View>
              )}
              <ReusableButton
                onPress={() => actionSheetRef.current?.show()}
                buttonText="Add to Group Chat"
                variant="shade"
              />
            </View>
            <ReusableButton
              onPress={handleSubmit(onSubmit)}
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
          data={communityData?.users?.filter(
            (user) => user?.id !== userData?.id
          )}
          isFetching={isFetching}
          setSearchInput={setSearchInput}
          setSelectedUsers={setSelectedUsers}
          selectedUsers={selectedUsers}
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
    backgroundColor: "white",
    marginRight: 8,

    height: 28,
    width: "auto",
    marginVertical: 8,
  },
  filterChipText: {
    color: "#6744FF",
    marginRight: 4,
  },
});
