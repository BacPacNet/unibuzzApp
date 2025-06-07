import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import ProfileCard from "@/components/molecules/RightSIdeBar/ProfileCard";

import { getUserStore } from "@/storage/user";
import universityPlaceHolder from "@/assets/unibuzz-orange.png";
import { useGetUserData, useGetUserPosts } from "@/services/user";
import ProfileInfo from "@/components/molecules/Profile/UserInformation";
import PostCard from "@/components/molecules/Timeline/PostCard";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";

type NavigationProp = StackNavigationProp<RootStackParamList, "Timeline">;

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

  const { navigate } = useNavigation<NavigationProp>();
  const { profile, firstName, lastName, email, university_id, university } =
    userProfileData || {};

  const {
    bio,
    university_name,
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
  } = profile || {};
  const { logos } = university || {};

  const handleNavigate = (index: number) => {
    navigate("Connection", {
      screen: "YourConnections",
      params: { index: index, userId },
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    queryClient.invalidateQueries({ queryKey: ["userPosts", userId] });
    setRefreshing(false);
  }, []);

  const handleScroll = (event: any) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;

    setLastOffset(contentOffsetY);
  };

  const FlatListProfileHeaderPart = () => {
    return (
      <View className="bg-white flex-1">
        <View className="flex-1 ">
          <ProfileCard
            name={firstName + " " + lastName}
            avatarUrl={profile?.profile_dp?.imageUrl || ""}
            university={university_name}
            year={study_year || ""}
            degree={degree || ""}
            isSelfProfile={userData?.id == userId}
            toShow={true}
          />
        </View>
        <View className="p-4 text-neutral-700 flex gap-4">
          <Text className="text-neutral-700">{bio}</Text>
          <View className="flex flex-row items-center gap-2">
            <Image
              source={logos?.[0] ? { uri: logos?.[0] } : universityPlaceHolder}
              style={styles.UniversityLogoPic}
            />
            <Text className="text-neutral-700">{university_name}</Text>
          </View>
          <View className="flex flex-row gap-4">
            {userData?.id == userId && (
              <TouchableOpacity onPress={() => handleNavigate(0)}>
                <Text className="text-primary-500 font-bold">4 Mutuals</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => handleNavigate(userData?.id == userId ? 1 : 0)}
            >
              <Text className="text-primary-500 font-bold">
                {following?.length || 0} Following
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNavigate(userData?.id == userId ? 2 : 1)}
            >
              <Text className="text-primary-500 font-bold">
                {followers?.length || 0} Followers
              </Text>
            </TouchableOpacity>
          </View>

          <ProfileInfo
            year={study_year || ""}
            degree={degree || ""}
            major={major || ""}
            affiliation={affiliation || ""}
            occupation={occupation || ""}
            email={email || ""}
            phone={phone_number || ""}
            location={city}
            birthday={dob || ""}
            country={country || ""}
          />
        </View>
      </View>
    );
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
          height: "100%",
        }}
        onScroll={handleScroll}
        keyExtractor={(item, index) => item?._id + index}
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
        ListHeaderComponent={<FlatListProfileHeaderPart />}
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

  UniversityLogoPic: {
    width: 30,
    height: 30,
    borderRadius: 30,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 3,
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
