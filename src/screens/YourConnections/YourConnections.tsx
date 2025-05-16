import { Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import ConnectionUserTabList from "@/components/organism/ConnectionUserTabList/ConnectionUserTabList";
import {
  useGetUserFollowers,
  useGetUserFollowing,
  useGetUserMutuals,
} from "@/services/connection";
import TabsPill from "@/components/molecules/TabsPill";
import { Filter, NavArrowLeft, Search } from "iconoir-react-native";
import { getUserProfileStore } from "@/storage/user";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useHeader } from "@/context/HeaderProvider/Header";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";

interface RouteParams {
  index?: number;
  userId?: string;
}
type NavigationProp = StackNavigationProp<
  RootStackParamList,
  "YourConnections"
>;
const YourConnections = () => {
  const route = useRoute();
  const params = (route.params as RouteParams) || {};
  const { index = 0, userId = "" } = params;
  const { changeHeaderShownStatus } = useHeader();
  const navigate = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const userProfileData = getUserProfileStore();
  const effectiveUserId =
    userId && userId.length > 0 ? userId : userProfileData?.users_id || "";
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
  } = useGetUserFollowing(searchQuery, 10, activeTab === 1, effectiveUserId);

  const {
    data: userFollowersProfilesData,
    refetch: fetchUserFollowersProfiles,
    fetchNextPage: fetchUserFollowersNextPage,
    isFetchingNextPage: isUserFollowersNextPage,
    hasNextPage: hasUserFollowersNextPage,
    isLoading: isUserFollowersLoading,
    isFetching: isUserFollowersFetching,
  } = useGetUserFollowers(
    searchQuery,
    10,
    effectiveUserId !== userProfileData?.users_id
      ? activeTab === 1
      : activeTab === 2,
    effectiveUserId,
  );

  useEffect(() => {
    setActiveTab(index || 0);
  }, [index]);

  useFocusEffect(
    useCallback(() => {
      changeHeaderShownStatus(false);

      return () => {
        changeHeaderShownStatus(true);
      };
    }, []),
  );

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
  const othersTabs = [
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

  const handleBack = () => {
    if (userId?.length > 0) {
      navigate.navigate("ProfileStack", {
        screen: "Profile",
        params: { userId: userId },
      });
    } else {
      navigate.goBack();
    }
  };

  const tabToRender =
    userId?.length == 0 || undefined
      ? tabs
      : userProfileData?.users_id == userId
        ? tabs
        : othersTabs;

  return (
    <SafeAreaView className="flex-1 bg-white ">
      <View className="  flex flex-row gap-4 items-center justify-between border-b border-neutral-300 px-3 pb-3">
        <View className=" flex flex-row gap-4 items-center">
          <TouchableOpacity
            className="flex flex-row gap-2 items-center"
            onPress={() => handleBack()}
          >
            <NavArrowLeft height={24} width={24} />
            <Text className="text-lg">
              {userId?.length > 0 ? "Profile" : "Connections"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
      <TabsPill
        onTabChange={handleTabChange}
        tabs={tabToRender}
        index={index || 0}
      />
    </SafeAreaView>
  );
};

export default YourConnections;
