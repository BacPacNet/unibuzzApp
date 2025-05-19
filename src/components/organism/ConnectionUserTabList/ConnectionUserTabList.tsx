import { getUserProfileStore } from "@/storage/user";
import { ProfileConnection, Users } from "@/types/connections";
import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import avatar from "@/assets/avatar.png";
import { InfiniteData } from "@tanstack/react-query";
import { useToggleFollow } from "@/services/connection";

const ConnectionUserTabList: React.FC<{
  userProfilesData: InfiniteData<ProfileConnection, unknown> | undefined;
  fetchUserProfiles: any;
  fetchNextPage: any;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isUserProfilesLoading: boolean;
  isFetching: boolean;
}> = ({
  userProfilesData,
  fetchUserProfiles,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
  isUserProfilesLoading,
  isFetching,
}) => {
  const userProfileData = useMemo(() => getUserProfileStore(), []);
  const { mutate: toggleFollow, isPending } = useToggleFollow();

  const userProfiles = useMemo(
    () =>
      userProfilesData?.pages
        ?.flatMap(({ users }) => users)
        .filter(({ _id }) => _id !== userProfileData?.users_id) ?? [],
    [userProfilesData, userProfileData?.users_id],
  );

  const handleRefresh = useCallback(() => {
    fetchUserProfiles();
  }, [fetchUserProfiles]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleFollowClick = (id: string) => {
    toggleFollow(id);
  };

  // Move RenderCTA inside useCallback to prevent re-creation
  const RenderCTA = useCallback(
    ({ id, isFollowing }: { id: string; isFollowing: boolean }) => {
      if (userProfileData?.users_id === id) {
        return null;
      }

      return isFollowing ? (
        <TouchableOpacity className="px-4 py-2 bg-white border border-neutral-300 rounded-md">
          <Text className="text-neutral-700">View Profile</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="px-4 py-2 bg-primary-500 rounded-md"
          onPress={() => handleFollowClick(id)}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className="text-white">Follow</Text>
          )}
        </TouchableOpacity>
      );
    },
    [userProfileData?.users_id],
  );

  //  Ensure renderItem only includes necessary dependencies
  const renderItem = useCallback(
    ({ item }: { item: Users }) => (
      <View className="flex-row items-center p-4 border-b border-neutral-300">
        <Image
          source={
            item?.profile?.profile_dp?.imageUrl
              ? { uri: item.profile.profile_dp.imageUrl }
              : avatar
          }
          className="w-12 h-12 rounded-full bg-pink-300"
        />
        <View className="flex-1 ml-4">
          <Text className="text-lg">
            {`${item?.firstName || ""} ${item?.lastName || ""}`}
          </Text>
          <View className="flex-row gap-1">
            {item?.profile?.study_year && (
              <Text className="text-sm text-neutral-500">
                {item.profile.study_year} Yr.
              </Text>
            )}
            {item?.profile?.degree && (
              <Text className="text-sm text-neutral-500">
                {item.profile.degree}
              </Text>
            )}
          </View>

          {item?.profile?.major && (
            <Text className="text-sm text-neutral-500">
              {item.profile.major}
            </Text>
          )}
        </View>
        <RenderCTA isFollowing={item.isFollowing} id={item._id} />
      </View>
    ),
    [RenderCTA],
  );

  if (isFetching && !isFetchingNextPage)
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );

  if (userProfiles?.length === 0) {
    return (
      <View className="py-4 ">
        <Text className="text-center">No Result Found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={userProfiles}
      keyExtractor={(item) => item._id}
      initialNumToRender={10}
      renderItem={renderItem}
      getItemLayout={(_, index) => ({ length: 80, offset: 80 * index, index })}
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

export default ConnectionUserTabList;
