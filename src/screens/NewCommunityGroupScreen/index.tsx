import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Components
import BackHeader from "@/components/atoms/BackHeader";
import ReusableButton from "@/components/atoms/ReusableButton";

// Contexts
import { useCommunityFilterContext } from "@/context/CommunityFilterProvider/CommunityFilterProvider";

// Services
import {
  useGetCommunity,
  useGetFilteredSubscribedCommunities,
} from "@/services/university-community";

// Types
import { CreateCommunityGroupType } from "@/types/CommunityGroup";
import { RootStackParamList } from "@/types/navigation";

// Custom hooks

import { ImageUploadSection } from "@/components/molecules/CreateNewGroup/ImageUploadSection/ImageUploadSection";
import { FormFields } from "@/components/molecules/CreateNewGroup/FormFields/FormFields";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useGroupCreation } from "@/hooks/useGroupCreation";
import { useNewCommunityGroupStatesContext } from "@/context/NewCommunityGroupStatesProvider/NewCommunityGroupStatesProvider";

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  "NewCommunityGroupScreen"
>;

const NewCommunityGroupScreen = () => {
  const navigate = useNavigation<NavigationProp>();
  const route = useRoute();
  const { communityId } = route.params as any;

  // Data fetching
  const { data: communityData, isFetching } = useGetCommunity(communityId);
  const { mutate } = useGetFilteredSubscribedCommunities(communityId);

  // Form handling
  const {
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
      selectedFilters: [],
    },
  });

  // Custom hooks
  const {
    imageToUpload,
    bannerToUpload,
    previewProfileImage,
    previewBannerImage,
    handleImagePick,
  } = useImageUpload();
  const {
    createSelectedFilters,
    setCreateSelectedFilters,
    isPending,
    handleCreateGroup,
  } = useGroupCreation(communityId, communityData);
  const { setSelectedUsersState, selectedUsersState, resetFilters } =
    useNewCommunityGroupStatesContext();


  // Local state
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [showFilterError, setShowFilterError] = useState(false);

  const isFilterSelectionValid = (filters: Record<string, string[]>) => {
    return (
      Object.keys(filters).length > 0 &&
      Object.values(filters).some((arr) => arr.length > 0)
    );
  };

  const isSelectedUsersEmpty = selectedUsersState.length === 0;

  // Navigation handlers
  const handleNavigateToFilterScreen = () => {
    navigate.navigate("manageGroupStack", {
      screen: "NewCommunityGroupFilterScreen",
    });
  };

  const handleNavigateToUsersSelectScreen = () => {
    navigate.navigate("manageGroupStack", {
      screen: "NewCommunityGroupUsersSelectScreen",
      params: {
        universityName: communityData?.name,
        communityId: communityId,
      },
    });
  };

  // Form submission
  const onSubmit = async (data: CreateCommunityGroupType) => {
    const isValid = isFilterSelectionValid(createSelectedFilters);

    if (!isValid) {
      setShowFilterError(true);
      return;
    }

    setShowFilterError(false);

    setIsProfileLoading(true);

    try {
      const { payload, createGroup, setCreateSelectedFilters } =
        await handleCreateGroup(data, imageToUpload, bannerToUpload);

      createGroup(
        { communityId, data: payload },
        {
          onSuccess: () => {
            setCreateSelectedFilters([]);
            resetFilters();
            setIsProfileLoading(false);

            navigate.navigate("manageGroupStack", {
              screen: "SearchCommunityGroupScreen",
              params: { communityId, change: Date.now() },
            });
          },
          onError: () => {
            setIsProfileLoading(false);
          },
        },
      );
    } catch (error) {
      setIsProfileLoading(false);
      console.error("Error creating group:", error);
    }
  };

  useEffect(() => {
    if (showFilterError && isFilterSelectionValid(createSelectedFilters)) {
      setShowFilterError(false);
    }
  }, [createSelectedFilters, showFilterError]);

  // Loading state
  if (isFetching) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView>
          <BackHeader label="Manage Group" />
          <View style={styles.content}>
            <ImageUploadSection
              imageToUpload={imageToUpload}
              bannerToUpload={bannerToUpload}
              previewProfileImage={previewProfileImage}
              previewBannerImage={previewBannerImage}
              onImagePick={handleImagePick}
            />

            <FormFields
              control={control}
              errors={errors}
              createSelectedFilters={createSelectedFilters}
              setCreateSelectedFilters={setCreateSelectedFilters}
              isNewGroup={true}
            />

            <View style={styles.section}>
              <View style={styles.buttonContainer}>
                <ReusableButton
                  buttonText="Select Group Category"
                  variant="shade"
                  onPress={handleNavigateToFilterScreen}
                  height="large"
                />
                {showFilterError && (
                  <Text style={{ color: "red" }}>
                    Group category is required
                  </Text>
                )}

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
                onPress={handleGroupCreate(onSubmit)}
                buttonText="Create Group"
                variant="primary"
                isLoading={isProfileLoading || isPending}
                height="large"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
