import BackHeader from "@/components/atoms/BackHeader";
import ReusableButton from "@/components/atoms/ReusableButton";
import { FormFields } from "@/components/molecules/CreateNewGroup/FormFields/FormFields";
import { ImageUploadSection } from "@/components/molecules/CreateNewGroup/ImageUploadSection/ImageUploadSection";
import ImageOptionSelectBottomSheet from "@/components/molecules/ImageOptionSelectBottomSheet";
import { useCommunityFilterContext } from "@/context/CommunityFilterProvider/CommunityFilterProvider";
import { useNewCommunityGroupStatesContext } from "@/context/NewCommunityGroupStatesProvider/NewCommunityGroupStatesProvider";
import useCustomBackHandler from "@/hooks/useCustomBackHandler";
import { useUpdateCommunityGroup } from "@/services/community-group";
import { useGetCommunity } from "@/services/university-community";
import { useUploadToS3 } from "@/services/upload";
import {
  CommunityGroupAccess,
  CreateCommunityGroupType,
  status,
} from "@/types/CommunityGroup";
import { isApplicantRole } from "@/lib/userProfileSubtitle";
import { RootStackParamList } from "@/types/navigation";

import { UPLOAD_CONTEXT } from "@/types/uploads";
import { handleTakePhoto, pickImage, scrollToField } from "@/utils";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { launchImageLibrary } from "react-native-image-picker";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Toast } from "react-native-toast-notifications";

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
  "EditCommunityGroupScreen"
>;

const EditCommunityGroupScreen = () => {
  const navigate = useNavigation<NavigationProp>();
  const route: any = useRoute();

  const communityId = route.params?.communityId ?? "";
  const communityGroups = (route.params?.communityGroups as any) ?? "";
  const groupStatus = (route.params?.groupStatus as any) ?? "";
  const { data: communityData, isLoading } = useGetCommunity(communityId);
  const { createSelectedFilters, setCreateSelectedFilters } =
    useCommunityFilterContext();
  const { mutateAsync: uploadToS3 } = useUploadToS3();
  const { mutate: mutateEditGroup, isPending } = useUpdateCommunityGroup();

  const {
    watch,
    control,
    handleSubmit: handleGroupUpdate,
    formState: { errors },
    setValue,
    reset,
    setError,
  } = useForm<CreateCommunityGroupType>({
    defaultValues: {
      communityGroupLogoUrl: null,
      communityGroupLogoCoverUrl: null,
      title: "",
      description: "",
      communityGroupAccess: "",
      communityGroupType: "",
      communityGroupLabel: "",
      selectedUsers: [],
      selectedFilters: [],
    },
  });

  type FieldRefs = {
    title: React.RefObject<View>;
    description: React.RefObject<View>;
    communityGroupAccess: React.RefObject<View>;
    communityGroupType: React.RefObject<View>;
    communityGroupLabel: React.RefObject<View>;
  };

  const fieldRefs: FieldRefs = {
    title: useRef<View>(null),
    description: useRef<View>(null),
    communityGroupAccess: useRef<View>(null),
    communityGroupType: useRef<View>(null),
    communityGroupLabel: useRef<View>(null),
  };
  const scrollViewRef = useRef<ScrollView>(null);

  const title = watch("title") || "";
  const initialDescription = watch("description") || "";
  const communityGroupAccess = watch("communityGroupAccess") || "";
  const communityGroupLabel = watch("communityGroupLabel") || "";


  const imageOptionActionSheetRef = useRef<ActionSheetRef>(null);
  const insets = useSafeAreaInsets();

  const [previewProfileImage, setPreviewProfileImage] = useState<string | null>(
    communityGroups?.communityGroupLogoUrl?.imageUrl
  );
  const [previewBannerImage, setPreviewBannerImage] = useState<string | null>(
    null
  );
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [imageToUpload, setImageToUpload] = useState<ImageAsset | null>(null);
  const [bannerToUpload, setBannerToUpload] = useState<ImageAsset | null>(null);
  const [isRequestRequiredToJoinGroup, setIsRequestRequiredToJoinGroup] =
    useState(communityGroups?.isRequestRequiredToJoinGroup ?? false);

  const { selectedUsersState, setSelectedUsersState, resetFilters } =
    useNewCommunityGroupStatesContext();
  useFocusEffect(
    useCallback(() => {
      return () => {
        resetFilters();
      };
    }, [communityGroups])
  );

  useEffect(() => {
    setValue("title", communityGroups?.title ?? "");
    setValue("description", communityGroups?.description);
    setValue(
      "communityGroupAccess",
      communityGroups?.communityGroupAccess ?? ""
    );
    setValue("communityGroupType", communityGroups?.communityGroupType);
    setValue("communityGroupLabel", communityGroups?.communityGroupLabel);
    setValue("selectedUsers", communityGroups?.users ?? []);
    setValue("selectedFilters", communityGroups?.communityGroupCategory);
    setPreviewProfileImage(
      communityGroups?.communityGroupLogoUrl?.imageUrl ?? ""
    );
    setPreviewBannerImage(
      communityGroups?.communityGroupLogoCoverUrl?.imageUrl ?? ""
    );
    setCreateSelectedFilters(communityGroups?.communityGroupCategory);
    setSelectedUsersState(communityGroups?.users ?? []);
    setIsRequestRequiredToJoinGroup(
      communityGroups?.isRequestRequiredToJoinGroup ?? false
    );
  }, [communityGroups]);

  useEffect(() => {
    if (communityGroupAccess === CommunityGroupAccess.Hidden) {
      setIsRequestRequiredToJoinGroup(false);
    }
  }, [communityGroupAccess]);

  useEffect(() => {
    if (communityGroupAccess === CommunityGroupAccess.UniversityWide) {
      const filtered = selectedUsersState.filter(
        (user) => !isApplicantRole((user as any).role)
      );
      if (filtered.length !== selectedUsersState.length) {
        setSelectedUsersState(filtered);
      }
    }
  }, [communityGroupAccess]);

  const handleNavigateToFilterScreen = () => {
    navigate.navigate("Groups", {
      screen: "NewCommunityGroupFilterScreen",
    });
  };

  const handleImagePick = async (type: "profile" | "banner") => {
    launchImageLibrary({ mediaType: "photo" }, (response: any) => {
      if (!response.didCancel && !response.errorCode) {
        const imageObject = response.assets[0];
        if (type === "profile") {
          setImageToUpload(imageObject);
        } else {
          setBannerToUpload(imageObject);
        }
      }
    });
  };

  const onSubmit = async (data: CreateCommunityGroupType) => {
    if (Object.values(createSelectedFilters).flat()?.length < 1) {
      Toast.hideAll();
      return Toast.show("At least one group category is required.");
    }
    setIsProfileLoading(true);
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

    const payload = {
      title: title,
      description: initialDescription,
      communityGroupAccess: communityGroupAccess,
      communityGroupLabel: communityGroupLabel,
      ...communityGroupCategory,
      selectedUsers: selectedUsersState,
      isRequestRequiredToJoinGroup,
      ...(logoImageData && {
        communityGroupLogoUrl: logoImageData.data[0],
      }),
      ...(CoverImageData && {
        communityGroupLogoCoverUrl: CoverImageData.data[0],
      }),
    };

    mutateEditGroup(
      { communityId: communityGroups?._id, payload: payload },
      {
        onSuccess: () => {
          setCreateSelectedFilters([]);
          setIsProfileLoading(false);
          setImageToUpload(null);
          setBannerToUpload(null);
          navigate.navigate("CommunityGroup", {
            communityId: communityId,
            communityGroupId: communityGroups?._id,
            from: "edit",
          });
        },
        onError: (error) => {
          setIsProfileLoading(false);
          const err = JSON.parse(error.response?.data?.message ?? "{}");
          setError(err.for, { message: err.message });
          scrollToField(err.for, fieldRefs, scrollViewRef);
        },
      }
    );
  };

  const handleGOBack = () => {
    navigate.navigate("CommunityGroup", {
      communityId: communityId,
      communityGroupId: communityGroups?._id,
      from: "edit",
    });
  };
  useCustomBackHandler(handleGOBack);
  const handleNavigateToUsersSelectScreen = () => {
    navigate.navigate("Groups", {
      screen: "NewCommunityGroupUsersSelectScreen",
      params: {
        universityName: communityData?.name,
        communityId: communityId,
        isEditGroup: true,
        communityGroupId: communityGroups?._id,
        communityGroupAccess,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView ref={scrollViewRef}>
          <BackHeader label=" Group" onPress={handleGOBack} />
          <View style={styles.content}>
            {/* Profile Photo */}
            <ImageUploadSection
              imageToUpload={imageToUpload}
              bannerToUpload={bannerToUpload}
              previewProfileImage={previewProfileImage}
              previewBannerImage={previewBannerImage}
              onImagePick={handleImagePick}
              onLogoPick={() => imageOptionActionSheetRef.current?.show()}
            />

            <FormFields
              control={control}
              errors={errors}
              createSelectedFilters={createSelectedFilters}
              setCreateSelectedFilters={setCreateSelectedFilters}
              isPending={groupStatus === status.pending}
              groupType={communityGroups?.communityGroupType}
              fieldRefs={fieldRefs}
              communityGroupAccess={communityGroupAccess}
              isRequestRequiredToJoinGroup={isRequestRequiredToJoinGroup}
              onRequestRequiredChange={setIsRequestRequiredToJoinGroup}
              readOnlyGroupAccess
            />
            <View style={styles.section}>
              <View style={styles.buttonContainer}>
                <ReusableButton
                  buttonText="Select Group Category"
                  variant="shade"
                  onPress={handleNavigateToFilterScreen}
                  height="large"
                />

                <View>
                  <View style={styles.flexRowContainer}>
                    <Text style={styles.inputLabels}>Add Members</Text>
                  </View>
                  <ReusableButton
                    buttonText="Select People"
                    variant="shade"
                    onPress={handleNavigateToUsersSelectScreen}
                    height="large"
                  />
                </View>
              </View>
            </View>

            <View style={styles.submitButtonContainer}>
              <ReusableButton
                onPress={handleGroupUpdate(onSubmit)}
                buttonText="Update Group"
                variant="primary"
                isLoading={isProfileLoading || isPending}
                height="large"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ActionSheet
        ref={imageOptionActionSheetRef}
        gestureEnabled={true}
        safeAreaInsets={insets}
      >
        <ImageOptionSelectBottomSheet
          onTakePhoto={() => handleTakePhoto(setImageToUpload)}
          onUploadFromPhotos={() => pickImage(setImageToUpload)}
          onClose={() => imageOptionActionSheetRef.current?.hide()}
          title="Add Group Logo "
        />
      </ActionSheet>
    </View>
  );
};

export default EditCommunityGroupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardAvoid: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 12,
  },
  inputLabels: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 16,
  },

  flexRowContainer: {
    flexDirection: "row",
    alignContent: "center",
    gap: 2,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: 32,
  },
  submitButtonContainer: {
    marginTop: 32,
  },
});
