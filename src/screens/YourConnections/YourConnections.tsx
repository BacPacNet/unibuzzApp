import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import ConnectionUserTabList from "@/components/organism/ConnectionUserTabList/ConnectionUserTabList";
import Tabs from "@/components/molecules/Tabs";
import { UserType } from "@/types/connections";
import { useUsersProfileForConnections } from "@/services/users";
import {
  useGetUserFollowers,
  useGetUserFollowing,
} from "@/services/connection";
import { getUserStore } from "@/storage/user";

const YourConnections = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: userProfilesData,
    refetch: fetchUserProfiles,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading: isUserProfilesLoading,
    isFetching: isUserProfilesFetching,
  } = useUsersProfileForConnections(searchQuery, 10, activeTab === 0);

  const {
    data: userFollowingProfilesData,
    refetch: fetchUserFollowingProfiles,
    fetchNextPage: fetchUserFollowingNextPage,
    isFetchingNextPage: isUserFollowingNextPage,
    hasNextPage: hasUserFollowingNextPage,
    isLoading: isUserProfilesFollowingLoading,
    isFetching: isUserProfilesFollowingFetching,
  } = useGetUserFollowing(searchQuery, 10, activeTab === 1);

  const {
    data: userFollowersProfilesData,
    refetch: fetchUserFollowersProfiles,
    fetchNextPage: fetchUserFollowersNextPage,
    isFetchingNextPage: isUserFollowersNextPage,
    hasNextPage: hasUserFollowersNextPage,
    isLoading: isUserFollowersLoading,
    isFetching: isUserFollowersFetching,
  } = useGetUserFollowers(searchQuery, 10, activeTab === 2);

  const tabs = [
    {
      label: "Mutuals",
      content: (
        <ConnectionUserTabList
          userProfilesData={userFollowingProfilesData}
          fetchUserProfiles={fetchUserFollowingProfiles}
          fetchNextPage={fetchUserFollowingNextPage}
          isFetchingNextPage={isUserFollowingNextPage}
          hasNextPage={hasUserFollowingNextPage}
          isUserProfilesLoading={isUserProfilesFollowingLoading}
          isFetching={isUserProfilesFetching}
        />
      ),
    },
    {
      label: "Following",
      content: (
        <ConnectionUserTabList
          userProfilesData={userProfilesData}
          fetchUserProfiles={fetchUserProfiles}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          isUserProfilesLoading={isUserProfilesLoading}
          isFetching={isUserProfilesFollowingFetching}
        />
      ),
    },
    {
      label: "Follower",
      content: (
        <ConnectionUserTabList
          userProfilesData={userFollowersProfilesData}
          fetchUserProfiles={fetchUserFollowersProfiles}
          fetchNextPage={fetchUserFollowersNextPage}
          isFetchingNextPage={isUserFollowersNextPage}
          hasNextPage={hasUserFollowersNextPage}
          isUserProfilesLoading={isUserFollowersLoading}
          isFetching={isUserFollowersFetching}
        />
      ),
    },
  ];

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  return (
    <View className="flex-1 bg-white ">
      <Tabs onTabChange={handleTabChange} tabs={tabs} />
    </View>
  );
};

export default YourConnections;
