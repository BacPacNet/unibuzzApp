import { TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import ConnectionUserTabList from "@/components/organism/ConnectionUserTabList/ConnectionUserTabList";
import { useUsersProfileForConnections } from "@/services/users";
import {
  useGetUserFollowers,
  useGetUserFollowing,
  useGetUserMutuals,
} from "@/services/connection";
import TabsPill from "@/components/molecules/TabsPill";
import { Filter, Search } from "iconoir-react-native";
import { getUserProfileStore } from "@/storage/user";

const YourConnections = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const userProfileData = getUserProfileStore();

  const {
    data: userMutualProfilesData,
    refetch: fetchUserMutualProfiles,
    fetchNextPage: fetchUserMutualNextPage,
    isFetchingNextPage: isUserMutualNextPage,
    hasNextPage: hasUserMutualNextPage,
    isLoading: isUserProfilesMutualLoading,
    isFetching: isUserProfilesMutualFetching,
  } = useGetUserMutuals(searchQuery, userProfileData?.users_id || "", 10, true);

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
          userProfilesData={userMutualProfilesData}
          fetchUserProfiles={fetchUserMutualProfiles}
          fetchNextPage={fetchUserMutualNextPage}
          isFetchingNextPage={isUserMutualNextPage}
          hasNextPage={hasUserMutualNextPage}
          isUserProfilesLoading={isUserProfilesMutualLoading}
          isFetching={isUserProfilesMutualFetching}
        />
      ),
    },
    {
      label: "Following",
      content: (
        <ConnectionUserTabList
          userProfilesData={userFollowingProfilesData}
          fetchUserProfiles={fetchUserFollowingProfiles}
          fetchNextPage={fetchUserFollowingNextPage}
          isFetchingNextPage={isUserFollowingNextPage}
          hasNextPage={hasUserFollowingNextPage}
          isUserProfilesLoading={isUserProfilesFollowingLoading}
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
      <View className="p-4 flex-row items-center gap-2">
        <View className="flex-1 relative">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search Messages"
            className="border border-neutral-200 p-2  rounded-lg"
            style={{ paddingEnd: 40 }}
          />
          <Search
            style={{
              position: "absolute",
              top: "50%",
              right: 10,
              transform: [{ translateY: -10 }],
            }}
            strokeWidth={2}
            height={20}
            width={20}
          />
        </View>
        <TouchableOpacity className="w-10 h-10 bg-secondary rounded-lg flex justify-center items-center">
          <Filter width={28} height={28} color={"#6744FF"} strokeWidth={2} />
        </TouchableOpacity>
      </View>
      <TabsPill onTabChange={handleTabChange} tabs={tabs} />
    </View>
  );
};

export default YourConnections;
