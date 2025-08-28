import BackHeader from "@/components/atoms/BackHeader";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import UsersScreenUserCardItem from "@/components/molecules/UsersScreenUserCards";
import { useEffect, useMemo } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import {
  useGetUserFollowers,
  useGetUserFollowing,
} from "@/services/connection";
import { getUserProfileStore } from "@/storage/user";
import useCustomBackHandler from "@/hooks/useCustomBackHandler";
import { screenName } from "@/constant/screenName";
import { useQueryClient } from "@tanstack/react-query";

type NavigationProp = StackNavigationProp<RootStackParamList, "UsersScreen">;

enum listType {
  followers = "followers",
  following = "following",
}

const UsersScreen = ({ route }: any) => {
  const navigate = useNavigation<NavigationProp>();
  const userId = route?.params?.userId ?? null;
  const type = route?.params?.type ?? null;
  const userProfileData = getUserProfileStore();
  const from = route?.params?.from || "";
  const queryClient = useQueryClient();
  const {
    data: userFollowData,
    isLoading: isFollowingLoading,
    fetchNextPage: fetchNextFollowing,
    isFetchingNextPage: isFetchingFollowingNextPage,
    hasNextPage: hasFollowingNextPage,
  } = useGetUserFollowing(
    "",
    userId,
    10,
    listType.following.toString() == type
  );

  const {
    data: userFollowersData,
    isLoading: isFollowersLoading,
    fetchNextPage: fetchNextFollowers,
    isFetchingNextPage: isFetchingFollowersNextPage,
    hasNextPage: hasFollowersNextPage,
    refetch: refetchUserFollowers,
  } = useGetUserFollowers(
    "",
    userId,
    10,
    listType.followers.toString() == type
  );

  const userFollow = useMemo(() => {
    const followingIds = new Set(
      userProfileData?.following?.map((f) => f.userId)
    );

    return (
      userFollowData?.pages.flatMap((page) =>
        page.users
          .filter((user) =>
            userProfileData?.users_id === userId
              ? user._id !== userProfileData?.users_id
              : true
          )
          .map((user) => ({
            ...user,
            isFollowing: followingIds.has(user._id),
          }))
      ) || []
    );
  }, [userFollowData, userProfileData, userId]);

  const userFollowers = useMemo(() => {
    const followingIds = new Set(
      userProfileData?.following?.map((f) => f.userId)
    );

    return (
      userFollowersData?.pages.flatMap((page) =>
        page.users
          .filter((user) =>
            userProfileData?.users_id === userId
              ? user._id !== userProfileData?.users_id
              : true
          )
          .map((user) => ({
            ...user,
            isFollowing: followingIds.has(user._id),
          }))
      ) || []
    );
  }, [userFollowersData, userProfileData, userId, type]);

  useFocusEffect(() => {
    if (
      type == listType.followers &&
      from == screenName.profile &&
      !isFetchingFollowersNextPage
    ) {
      queryClient.invalidateQueries({
        queryKey: ["getRefetchUserData"],
      });
      refetchUserFollowers();
    }
  });

  const handleBack = () => {
    navigate.navigate("ProfileStack", {
      screen: "Profile",
      params: { userId: userId },
    });
  };
  useCustomBackHandler(handleBack);

  const isLoading =
    listType.following.toString() == type
      ? isFollowingLoading
      : isFollowersLoading;
  const userList =
    listType.following.toString() == type ? userFollow : userFollowers;
  const isFetchingNextPage =
    listType.following.toString() == type
      ? isFetchingFollowingNextPage
      : isFetchingFollowersNextPage;

  if (isFollowingLoading || isFollowersLoading) {
    return (
      <View style={styles.emptyList}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <BackHeader label="User Profile" onPress={() => handleBack()} />

      <View style={styles.paddingContainer} className="   ">
        <FlatList
          data={userList}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <UsersScreenUserCardItem
              isFollowing={listType.following.toString() == type}
              item={item}
              currentUserId={userId}
              myUserId={userProfileData?.users_id || ""}
              from={from}
            />
          )}
          onEndReached={() => {
            if (
              hasFollowingNextPage &&
              !isFetchingFollowingNextPage &&
              type == listType.following
            ) {
              fetchNextFollowing();
            } else if (
              hasFollowersNextPage &&
              !isFetchingFollowersNextPage &&
              type == listType.followers
            ) {
              fetchNextFollowers();
            }
          }}
          ListFooterComponent={() =>
            isFetchingNextPage ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyList}>
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <Text className="text-neutral-500">No User Found</Text>
              )}
            </View>
          }
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

export default UsersScreen;

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  paddingContainer: {
    flex: 1,
    padding: 16,
  },
  listContainer: { paddingBottom: 20 },
  emptyList: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});
