import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { CommunityGroupUsers } from "@/types/CommunityGroup";
import { getUserProfileStore } from "@/storage/user";
import UserListItem from "../../UserListItem";
import { ScrollView } from "react-native-actions-sheet";
import { useRemoveUserFromCommunityGroup } from "@/services/community-group";

interface Props {
  users: CommunityGroupUsers[];
  isGroupAdmin: boolean;
  communityGroupId: string;
  adminId: string;
  hideBottomBar: () => void;
}

export const CommunityGroupMembersModal = ({
  users,
  isGroupAdmin,
  communityGroupId,
  hideBottomBar,
  adminId,
}: Props) => {
  const userProfileData = getUserProfileStore();

  const [members, setMembers] = useState<CommunityGroupUsers[]>(users);
  const { mutate: mutateRemoveUserFromCommunityGroup, isPending } =
    useRemoveUserFromCommunityGroup();

  const handleRemoveUser = (id: string) => {
    mutateRemoveUserFromCommunityGroup(
      { communityGroupId, userId: id },
      {
        onSuccess: (response: any) => {
          setMembers(response.data.users);
          hideBottomBar();
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Members</Text>
      <ScrollView>
        {members?.map((user) => (
          <UserListItem
            key={user._id as string}
            id={user._id}
            firstName={user.firstName}
            lastName={user.lastName}
            university=""
            study_year={user.year}
            degree=""
            major={user.major}
            occupation={user.occupation}
            imageUrl={user.profileImageUrl}
            type=""
            isSelfProfile={userProfileData?.users_id === user._id}
            isFollowing={
              !!userProfileData?.following?.some((u) => u.userId === user._id)
            }
            role={user.role || "student"}
            affiliation={user.affiliation}
            showCommunityGroupMember
            isGroupAdmin={isGroupAdmin}
            isViewerAdmin={adminId === userProfileData?.users_id}
            handleRemoveClick={handleRemoveUser}
            isRemovePending={isPending}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullHeight: {
    display: "flex",
    justifyContent: "space-between",
  },
  container: { padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
});
