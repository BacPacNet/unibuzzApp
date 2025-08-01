import { getUserProfileStore } from "@/storage/user";
import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useGetUserMutuals } from "@/services/connection";
import MembersUserCard from "@/components/molecules/MembersUserCard";
import SearchInput from "@/components/atoms/SearchInput";

const ConnectionMutualUserTabList: React.FC<{}> = ({}) => {
  const userProfileData = useMemo(() => getUserProfileStore(), []);
  const [name, setName] = useState("");
  const {
    data: userProfilesData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading: isUserProfilesLoading,
    refetch: fetchUserProfiles,
    isFetching,
  } = useGetUserMutuals(name, userProfileData?.users_id || "", 10, true);

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

  if (isUserProfilesLoading && !name.length)
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );

  //   if (userProfiles?.length === 0) {
  //     return (
  //       <View className="py-4 ">
  //         <Text className="text-center">No Result Found</Text>
  //       </View>
  //     );
  //   }

  return (
    <FlatList
      data={userProfiles}
      keyExtractor={(item) => item._id}
      initialNumToRender={10}
      ListHeaderComponent={
        <View>
          <View className="flex-1 relative p-4">
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
      //   ListEmptyComponent={
      //     !isFetching && userProfiles?.length === 0 ? (
      //       <View className="py-4">
      //         <Text className="text-center">No Result Found</Text>
      //       </View>
      //     ) : null
      //   }
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

export default ConnectionMutualUserTabList;
