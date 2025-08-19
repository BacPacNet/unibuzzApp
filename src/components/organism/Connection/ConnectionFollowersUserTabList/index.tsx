import { getUserProfileStore } from "@/storage/user";
import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useGetUserFollowers, useGetUserMutuals } from "@/services/connection";
import MembersUserCard from "@/components/molecules/MembersUserCard";
import SearchInput from "@/components/atoms/SearchInput";

const ConnectionFollowersUserTabList: React.FC<{}> = ({}) => {
  const userProfileData = useMemo(() => getUserProfileStore(), []);
  const [name, setName] = useState("");
  const {
    data: userFollowersData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading: isUserProfilesLoading,
    isFetching,
    refetch: fetchUserProfiles,
  } = useGetUserFollowers(name, userProfileData?.users_id || "", 6, true);

  const userProfiles = useMemo(
    () =>
      userFollowersData?.pages
        ?.flatMap(({ users }) => users)
        .filter(({ _id }) => _id !== userProfileData?.users_id) ?? [],
    [userFollowersData, userProfileData?.users_id]
  );

  const handleRefresh = useCallback(() => {
    fetchUserProfiles();
  }, [fetchUserProfiles]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isUserProfilesLoading && !name.length)
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );

  return (
    <FlatList
      data={userProfiles}
      keyExtractor={(item) => item._id}
      initialNumToRender={10}
      ListHeaderComponent={
        <View>
          <View className="flex-1 relative py-4">
            <SearchInput
              value={name}
              onChangeText={setName}
              placeholder="Search User..."
            />
            {!isFetching && userProfiles?.length === 0 ? (
              <View className="py-4">
                <Text className="text-center">No Result Found</Text>
              </View>
            ) : null}
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <MembersUserCard
          _id={item._id}
          firstName={item.firstName}
          lastName={item.lastName}
          isFollowing={item.isFollowing}
          currentUserId={userProfileData?.users_id || ""}
          role={item.profile?.role || ""}
          profile_dp_imageUrl={item.profile?.profile_dp?.imageUrl || ""}
          study_year={item?.profile?.study_year || ""}
          major={item?.profile?.major || ""}
          occupation={item?.profile?.occupation || ""}
          affiliation={item?.profile?.affiliation || ""}
          isSelfProfile={userProfileData?.users_id === item._id}
          isViewerAdmin={userProfileData?.users_id === item._id}
          isGroupAdmin={false}
        />
      )}
      getItemLayout={(_, index) => ({ length: 80, offset: 80 * index, index })}
      contentContainerStyle={{
        paddingHorizontal: 16,
      }}
      removeClippedSubviews
      refreshing={isUserProfilesLoading}
      refreshControl={
        <RefreshControl
          refreshing={isUserProfilesLoading}
          onRefresh={handleRefresh}
        />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="py-4">
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        ) : null
      }
    />
  );
};

export default ConnectionFollowersUserTabList;
