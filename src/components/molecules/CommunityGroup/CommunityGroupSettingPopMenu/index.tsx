import { FONTS } from "@/constants/fonts";
import { useDeleteCommunityGroup } from "@/services/community-group";
import { useGetFilteredSubscribedCommunities } from "@/services/university-community";
import { RootStackParamList } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  Edit,
  LogIn,
  LongArrowUpLeft,
  Prohibition,
  WarningCircleSolid,
  WhiteFlag,
} from "iconoir-react-native";
import React from "react";
import { View, Text, TouchableOpacity, Share, StyleSheet } from "react-native";
import { Toast } from "react-native-toast-notifications";

type CommunityGroupSettingPopMenuProps = {
  isPending: boolean;
  isGroupAdmin: boolean;
  leaveCommunityGroup: () => void;
  handleNavigateToEditCommunityGroupScreen: () => void;
  communityGroupId: string;
  communityId: string;
};

type NavigationProp = StackNavigationProp<RootStackParamList, "CommunityGroup">;

const CommunityGroupSettingPopMenu: React.FC<
  CommunityGroupSettingPopMenuProps
> = ({
  isPending,
  isGroupAdmin,
  leaveCommunityGroup,
  handleNavigateToEditCommunityGroupScreen,
  communityGroupId,
  communityId,
}) => {
  const { navigate } = useNavigation<NavigationProp>();
  const {
    mutate: deleteCommunityGroup,
    isPending: isDeleteCommunityGroupPending,
  } = useDeleteCommunityGroup();
  const { mutate } = useGetFilteredSubscribedCommunities(communityId);
  const handleDeleteCommunityGroup = () => {
    const data = {
      selectedType: [],
      selectedFilters: [],
      sort: "",
    };

    deleteCommunityGroup(communityGroupId as string, {
      onSuccess: () => {
        mutate(data);
        navigate("manageGroupStack", {
          screen: "SearchCommunityGroupScreen",

          params: { communityId: communityId },
        });
      },
    });

    // router.push(`/community/${communityId}`)
  };

  return (
    <View style={styles.container}>
      {isGroupAdmin && (
        <TouchableOpacity
          style={styles.textContainer}
          onPress={handleNavigateToEditCommunityGroupScreen}
        >
          <Edit height={16} width={16} color={"#6744FF"} />
          <Text style={styles.text}> Edit Group</Text>
          {isPending && (
            <WarningCircleSolid
              width={16}
              height={16}
              color="#F59E0B"
              strokeWidth={2}
            />
          )}
        </TouchableOpacity>
      )}

      {isGroupAdmin ? (
        <TouchableOpacity
          onPress={handleDeleteCommunityGroup}
          style={styles.textContainer}
        >
          <LogIn height={16} width={16} color={"#EF4444"} strokeWidth={2} />
          <Text style={styles.text}>Delete Group</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={leaveCommunityGroup}
          style={styles.textContainer}
        >
          <LogIn height={16} width={16} color={"#EF4444"} strokeWidth={2} />
          <Text style={styles.text}> Leave</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CommunityGroupSettingPopMenu;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    width: 144,
  },
  textContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  text: {
    color: "#3A3B3C",
    fontFamily: FONTS.inter.medium,
    fontSize: 12,
  },
});
