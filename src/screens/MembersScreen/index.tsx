import BackHeader from "@/components/atoms/BackHeader";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";

import { getUserProfileStore } from "@/storage/user";
import MembersUserCard from "@/components/molecules/MembersUserCard";
import { CommunityGroupUsers } from "@/types/CommunityGroup";
import { useRemoveUserFromCommunityGroup } from "@/services/community-group";
import useCustomBackHandler from "@/hooks/useCustomBackHandler";

type NavigationProp = StackNavigationProp<RootStackParamList, "MembersScreen">;

const MembersScreen = ({ route }: any) => {
  const navigate = useNavigation<NavigationProp>();
  const userId = route?.params?.userId ?? null;
  const communityGroupId = route?.params?.communityGroupId ?? null;
  const communityId = route?.params?.communityId ?? null;
  const CommunityGroupMember = route?.params?.CommunityGroupMember ?? null;
  const communityAdminId = route?.params?.communityAdminId ?? null;
  const isOfficialGroup = route?.params?.isOfficialGroup ?? false;
  const groupName = route?.params?.groupName ?? "Community";
  const adminId = route?.params?.adminId ?? null;
  const type = route?.params?.type ?? null;
  const userProfileData = getUserProfileStore();

  const [members, setMembers] =
    useState<CommunityGroupUsers[]>(CommunityGroupMember);
  const { mutate: mutateRemoveUserFromCommunityGroup, isPending: isPending } =
    useRemoveUserFromCommunityGroup();

  const handleRemoveUser = (id: string) => {
    mutateRemoveUserFromCommunityGroup(
      { communityGroupId, userId: id },
      {
        onSuccess: (response: any) => {
          const filteredMembers = response.data.communityGroup.users.filter(
            (item: any) => item.status == "accepted"
          );
          setMembers(filteredMembers);
        },
      }
    );
  };

  useEffect(() => {
    setMembers(CommunityGroupMember);
  }, [CommunityGroupMember]);

  const userFollowing = userProfileData?.following?.map(
    (item: any) => item.userId
  );

  const handleBack = () => {
    navigate.navigate("CommunityGroup", {
      communityId: communityId._id,
      communityGroupId: communityGroupId,
      from: "MembersScreen",
    });
  };

  useCustomBackHandler(handleBack);
  return (
    <View style={styles.container}>
      <BackHeader label={groupName} onPress={() => handleBack()} />
      <View style={styles.paddingContainer} className="   ">
        <FlatList
          data={members}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <MembersUserCard
              _id={item._id}
              firstName={item.firstName}
              lastName={item.lastName}
              isFollowing={userFollowing?.includes(item._id) || false}
              isSelfProfile={userProfileData?.users_id === item._id}
              isViewerAdmin={adminId === userProfileData?.users_id}
              isGroupAdmin={item._id === adminId}
              currentUserId={userId}
              role={item.role}
              profile_dp_imageUrl={item.profileImageUrl}
              study_year={item.year}
              major={item.major}
              occupation={item.occupation}
              affiliation={item.affiliation}
              handleRemoveClick={(id: string) => handleRemoveUser(id)}
              isOfficialGroup={isOfficialGroup}
              isCommunityAdmin={
                communityAdminId?.toString() === item?._id?.toString()
              }
              showRemoveButton={true}
              forCommunityGroup={true}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

export default MembersScreen;

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  paddingContainer: {
    flex: 1,
    padding: 16,
  },
  listContainer: { paddingBottom: 20 },
  emptyList: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});
