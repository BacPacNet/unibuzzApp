import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { getUserStore } from "@/storage/user";
import { useGetUserData, useGetUserPosts } from "@/services/user";
import PostCard from "@/components/molecules/Timeline/PostCard";
import { useQueryClient } from "@tanstack/react-query";
import { FlatListProfileHeaderPart } from "@/components/molecules/Profile/FlatListProfileHeader";

const Profile = ({ route }: any) => {
  const { userId } = route.params;

  const userData = getUserStore();
  const { data: userProfileData, isLoading: isUserProfileDataLoading } =
    useGetUserData(userId);

  const {
    isLoading,
    data: userSelfPosts,
    error,
    fetchNextPage: userSelfPostsFetchNextpage,
    isFetchingNextPage: userSelfIsFetchingNextPage,
    hasNextPage: userSelfHasNextPage,
    isFetching,
  } = useGetUserPosts(userId, 5);
  const userSelfPostData =
    userSelfPosts?.pages.flatMap((page) => page?.data) || [];

  const [refreshing, setRefreshing] = React.useState(false);

  const [lastOffset, setLastOffset] = useState(0);

  const queryClient = useQueryClient();

  const {
    profile,
    firstName,
    lastName,

    university_id,
    university,
  } = userProfileData || {};

  const {
    bio,
    university_name,
    universityLogo,
    followers,
    following,
    study_year,
    major,
    degree,
    phone_number,
    country,
    dob,
    city,
    affiliation,
    occupation,
    role,
    display_email,
  } = profile || {};

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    queryClient.invalidateQueries({ queryKey: ["userPosts", userId] });
    setRefreshing(false);
  }, []);

  const handleScroll = (event: any) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;

    setLastOffset(contentOffsetY);
  };

  if (isUserProfileDataLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#7367f0" />
      </View>
    );
  }

  return (
    <View className="bg-white flex-1 ">
      <FlatList
        data={userSelfPostData}
        style={{
          width: "100%",
        }}
        onScroll={handleScroll}
        keyExtractor={(item, index) => item?._id + index}
        ListHeaderComponent={
          <FlatListProfileHeaderPart
            firstName={firstName}
            lastName={lastName}
            profile={profile}
            university_name={university_name}
            study_year={study_year}
            degree={degree}
            userId={userId}
            bio={bio}
            logos={universityLogo}
            following={following}
            followers={followers}
            major={major}
            affiliation={affiliation}
            occupation={occupation}
            email={display_email}
            phone_number={phone_number}
            city={city}
            dob={dob}
            country={country}
            role={role}
          />
        }
        renderItem={({ item }) => (
          <PostCard data={item} isSinglePost={false} isTimeline={false} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={() => {
          if (userSelfHasNextPage && !userSelfIsFetchingNextPage) {
            userSelfPostsFetchNextpage();
          }
        }}
        ListFooterComponent={
          userSelfIsFetchingNextPage && userSelfHasNextPage ? (
            <View>
              <ActivityIndicator size="large" color="#7367f0" />
            </View>
          ) : (
            <View />
          )
        }
        ListEmptyComponent={
          isFetching ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#7367f0" />
            </View>
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text>No Result Found</Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  editButton: {
    paddingHorizontal: 10,
    margin: 10,
    borderColor: "#6744FF",
    borderWidth: 1,
    borderRadius: 8,
    width: 70,
    height: 30,
    display: "flex",
    flexDirection: "row",
    gap: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    display: "flex",
    gap: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
});

export default Profile;
