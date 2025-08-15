import { View, Text, FlatList, RefreshControl } from "react-native";
import React, { useState, useCallback } from "react";
import { getUserStore } from "@/storage/user";
import { useGetUserData, useGetUserPosts } from "@/services/user";
import PostCard from "@/components/molecules/Timeline/PostCard";
import { useQueryClient } from "@tanstack/react-query";
import { FlatListProfileHeaderPart } from "@/components/molecules/Profile/FlatListProfileHeader";
import { LoadingState } from "@/components/atoms/LoadingState";
import { styles } from "./styles";
import { ProfileProps } from "./types";
import { screenName } from "@/constant/screenName";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import useCustomBackHandler from "@/hooks/useCustomBackHandler";

type NavigationProp = StackNavigationProp<RootStackParamList, "SinglePost">;

const Profile = ({ route }: ProfileProps) => {
  const navigation = useNavigation<NavigationProp>();
  const { userId } = route.params;
  const chatId = (route?.params?.chatId as any) || null;
  const from = route?.params?.from || "";
  const userData = getUserStore();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [lastOffset, setLastOffset] = useState(0);

  const { data: userProfileData, isLoading: isUserProfileDataLoading } =
    useGetUserData(userId);

  const {
    isLoading,
    data: userSelfPosts,
    fetchNextPage: userSelfPostsFetchNextpage,
    isFetchingNextPage: userSelfIsFetchingNextPage,
    hasNextPage: userSelfHasNextPage,
    isFetching,
  } = useGetUserPosts(userId, 5);

  const userSelfPostData =
    userSelfPosts?.pages.flatMap((page) => page?.data) || [];

  const { profile, firstName, lastName, university_id, university } =
    userProfileData || {};

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
    displayEmail,
  } = profile || {};

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    queryClient.invalidateQueries({ queryKey: ["userPosts", userId] });
    setRefreshing(false);
  }, [queryClient, userId]);

  const handleBack = () => {
    console.log("sss", from);

    if (from === screenName.notifications) {
      navigation.navigate("Notifications");
    }
    if (from === screenName.message) {
      navigation.navigate("Messages", {
        screen: "Messages",
        params: { selectedUserId: chatId },
      });
    } else {
      navigation.goBack();
    }
  };
  useCustomBackHandler(handleBack);

  const handleScroll = (event: any) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    setLastOffset(contentOffsetY);
  };

  if (isUserProfileDataLoading || isUserProfileDataLoading) {
    return <LoadingState />;
  }

  const renderFooter = () => {
    if (userSelfIsFetchingNextPage && userSelfHasNextPage) {
      return <LoadingState />;
    }
    return <View />;
  };

  const renderEmpty = () => {
    if (isFetching) {
      return <LoadingState />;
    }
    return (
      <View style={styles.emptyContainer}>
        <Text className="text-neutral-500">No Result Found</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={userSelfPostData}
        style={styles.flatList}
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
            email={displayEmail}
            phone_number={phone_number}
            city={city}
            dob={dob || ""}
            country={country}
            role={role}
          />
        }
        renderItem={({ item }) => (
          <PostCard
            data={item}
            source="profile"
            isSinglePost={false}
            isTimeline={false}
            isProfile={true}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={() => {
          if (userSelfHasNextPage && !userSelfIsFetchingNextPage) {
            userSelfPostsFetchNextpage();
          }
        }}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};

export default Profile;
