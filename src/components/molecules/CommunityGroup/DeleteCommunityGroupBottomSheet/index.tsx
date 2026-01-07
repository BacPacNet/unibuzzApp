import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import ReusableButton from "@/components/atoms/ReusableButton";
import { FONTS } from "@/constants/fonts";
import { ActionSheetRef } from "react-native-actions-sheet";
import { WarningCircle } from "iconoir-react-native";
import { useDeleteCommunityGroup } from "@/services/community-group";
import { useGetFilteredSubscribedCommunities } from "@/services/university-community";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
type NavigationProp = StackNavigationProp<RootStackParamList, "CommunityGroup">;

const DeleteCommunityGroupBottomSheet = ({
  deleteCommunityGroupBottomSheet,
  communityId,
  communityGroupId,
}: {
  deleteCommunityGroupBottomSheet: React.RefObject<ActionSheetRef>;
  communityId: string;
  communityGroupId: string;
}) => {
  const { navigate } = useNavigation<NavigationProp>();
  const {
    mutate: handleDeleteCommunityGroup,
    isPending: isDeleteCommunityGroupPending,
  } = useDeleteCommunityGroup();
  const { mutate } = useGetFilteredSubscribedCommunities(communityId);
  const handleDeleteCommunityGroupFunction = () => {
    const data = {
      selectedType: [],
      selectedFilters: [],
      sort: "",
    };

    handleDeleteCommunityGroup(communityGroupId as string, {
      onSuccess: () => {
        mutate(data);
        navigate("Groups", {
          screen: "SearchCommunityGroupScreen",

          params: { communityId: communityId },
        });
      },
    });
  };
  return (
    <View style={styles.container}>
      <WarningCircle width={"90%"} height={100} color="#111827" />
      <Text style={styles.title}>
        Are you sure you want to delete community group?
      </Text>

      <View style={styles.buttonContainer}>
        <ReusableButton
          buttonText="Delete"
          onPress={handleDeleteCommunityGroupFunction}
          variant="danger"
          isLoading={isDeleteCommunityGroupPending}
          disabled={isDeleteCommunityGroupPending}
          activityIndicatorColor=""
          size="w-1/2"
          height="medium"
        />
        <ReusableButton
          buttonText="Cancel"
          onPress={() => deleteCommunityGroupBottomSheet.current?.hide()}
          variant="primary"
          activityIndicatorColor=""
          disabled={isDeleteCommunityGroupPending}
          size="w-1/2"
          height="medium"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
  title: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 16,
    fontFamily: FONTS.poppins.bold,
    textAlign: "center",
  },

  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginTop: 16,
  },
});

export default DeleteCommunityGroupBottomSheet;
