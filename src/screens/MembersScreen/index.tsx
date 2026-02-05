import BackHeader from "@/components/atoms/BackHeader";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
} from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { getUserProfileStore } from "@/storage/user";
import MembersUserCard from "@/components/molecules/MembersUserCard";
import { CommunityGroupUsers, status } from "@/types/CommunityGroup";
import {
  useGetCommunityGroupMembersUser,
  useRemoveUserFromCommunityGroup,
} from "@/services/community-group";
import useCustomBackHandler from "@/hooks/useCustomBackHandler";
import Tabs from "@/components/molecules/Tabs";

type NavigationProp = StackNavigationProp<RootStackParamList, "MembersScreen">;

const MembersScreen = ({ route }: any) => {
  const navigate = useNavigation<NavigationProp>();
  const userId = route?.params?.userId ?? null;
  const communityGroupId = route?.params?.communityGroupId ?? null;
  const communityId = route?.params?.communityId ?? null;
  const CommunityGroupMember = route?.params?.CommunityGroupMember ?? null;
  const communityAdminId = route?.params?.communityAdminId ?? [];
  const isOfficialGroup = route?.params?.isOfficialGroup ?? false;
  const groupName = route?.params?.groupName ?? "Community";
  const adminId = route?.params?.adminId ?? null;
  const type = route?.params?.type ?? null;
  const userProfileData = getUserProfileStore();

  const [members, setMembers] =
    useState<CommunityGroupUsers[]>(CommunityGroupMember);
  const [userStatus, setUserStatus] = useState<string>(status.accepted);

  const { mutate: mutateRemoveUserFromCommunityGroup, isPending: isPending } =
    useRemoveUserFromCommunityGroup();

  const {
    data: communityGroupMembers,
    refetch: refetchCommunityGroupMembers,
    isFetching: isFetchingCommunityGroupMembers,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetCommunityGroupMembersUser(communityGroupId, userStatus, 10);
  const communityGroupMembersData = useMemo(() => {
    return communityGroupMembers?.pages?.flatMap((page) => page?.data) ?? [];
  }, [communityGroupMembers]);

  const handleRemoveUser = (id: string) => {
    mutateRemoveUserFromCommunityGroup(
      { communityGroupId, userId: id },
      {
        onSuccess: (response: any) => {
          refetchCommunityGroupMembers();
        },
      }
    );
  };

  useCallback(() => {
    setUserStatus(status.accepted);
    refetchCommunityGroupMembers();

    return () => {
      setUserStatus(status.accepted);
    };
  }, [communityGroupId]);

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

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const dummyTabs = [
    {
      label: "Joined",

      content: (
        <View style={styles.paddingContainer} className="   ">
          <FlatList
            data={communityGroupMembersData}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <MembersUserCard
                _id={item._id}
                firstName={item.firstName}
                lastName={item.lastName}
                isFollowing={userFollowing?.includes(item._id) || false}
                isSelfProfile={userProfileData?.users_id === item._id}
                isViewerAdmin={
                  adminId.toString() === userProfileData?.users_id?.toString()
                }
                isGroupAdmin={item?._id?.toString() === adminId.toString()}
                currentUserId={userId}
                role={item.role}
                profile_dp_imageUrl={item.profileImageUrl}
                study_year={item.year}
                major={item.major}
                occupation={item.occupation}
                affiliation={item.affiliation}
                handleRemoveClick={(id: string) => handleRemoveUser(id)}
                isOfficialGroup={isOfficialGroup}
                isCommunityAdmin={communityAdminId?.includes(
                  item?._id?.toString()
                )}
                isVerifiedUserOfCommunity={item?.isVerified}
                showRemoveButton={true}
                forCommunityGroup={true}
              />
            )}
            contentContainerStyle={styles.listContainer}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              (isFetchingNextPage || isFetchingCommunityGroupMembers) &&
              !communityGroupMembersData.length ? (
                <View className="py-4">
                  <ActivityIndicator size="small" color="#0000ff" />
                </View>
              ) : null
            }
            ListEmptyComponent={
              !isFetchingNextPage &&
              !isFetchingCommunityGroupMembers &&
              communityGroupMembersData.length === 0 ? (
                <View className="py-4">
                  <Text className="text-center">No Result Found</Text>
                </View>
              ) : null
            }
          />
        </View>
      ),
    },
    {
      label: "Invited",

      content: (
        <View style={styles.paddingContainer} className="   ">
          <FlatList
            data={communityGroupMembersData}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <MembersUserCard
                _id={item._id}
                firstName={item.firstName}
                lastName={item.lastName}
                isFollowing={userFollowing?.includes(item._id) || false}
                isSelfProfile={
                  userStatus === status.accepted
                    ? userProfileData?.users_id === item._id
                    : true
                }
                isViewerAdmin={
                  adminId.toString() === userProfileData?.users_id?.toString()
                }
                isGroupAdmin={item?._id?.toString() === adminId.toString()}
                currentUserId={userId}
                role={item.role}
                profile_dp_imageUrl={item.profileImageUrl}
                study_year={item.year}
                major={item.major}
                occupation={item.occupation}
                affiliation={item.affiliation}
                handleRemoveClick={(id: string) => handleRemoveUser(id)}
                isOfficialGroup={isOfficialGroup}
                isCommunityAdmin={communityAdminId?.includes(
                  item?._id?.toString()
                )}
                isVerifiedUserOfCommunity={item?.isVerified}
                showRemoveButton={true}
                forCommunityGroup={true}
              />
            )}
            contentContainerStyle={styles.listContainer}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              (isFetchingNextPage || isFetchingCommunityGroupMembers) &&
              !communityGroupMembersData.length ? (
                <View className="py-4">
                  <ActivityIndicator size="small" color="#0000ff" />
                </View>
              ) : null
            }
            ListEmptyComponent={
              !isFetchingNextPage &&
              !isFetchingCommunityGroupMembers &&
              communityGroupMembersData.length === 0 ? (
                <View className="py-4">
                  <Text className="text-center">No Result Found</Text>
                </View>
              ) : null
            }
          />
        </View>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <BackHeader label={groupName} onPress={() => handleBack()} />

      <Tabs
        tabs={dummyTabs}
        onChange={(index) => {
          setUserStatus(index === 0 ? status.accepted : status.pending);
        }}
      />
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
    padding: 16,
  },
  listContainer: { paddingBottom: 20 },
  emptyList: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});
