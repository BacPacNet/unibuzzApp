import BackHeader from "@/components/atoms/BackHeader";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import UsersScreenUserCardItem from "@/components/molecules/UsersScreenUserCards";
import { useMemo } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import {
  useGetUserFollowers,
  useGetUserFollowing,
} from "@/services/connection";
import { getUserProfileStore } from "@/storage/user";
import useCustomBackHandler from "@/hooks/useCustomBackHandler";

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
    listType.following.toString() == type,
  );

  const {
    data: userFollowersData,
    isLoading: isFollowersLoading,
    fetchNextPage: fetchNextFollowers,
    isFetchingNextPage: isFetchingFollowersNextPage,
    hasNextPage: hasFollowersNextPage,
  } = useGetUserFollowers(
    "",
    userId,
    10,
    listType.following.toString() == type,
  );

  const userFollow = useMemo(() => {
    const followingIds = new Set(
      userProfileData?.following?.map((f) => f.userId),
    );

    return (
      userFollowData?.pages.flatMap((page) =>
        page.users
          .filter((user) =>
            userProfileData?.users_id === userId
              ? user._id !== userProfileData?.users_id
              : true,
          )
          .map((user) => ({
            ...user,
            isFollowing: followingIds.has(user._id),
          })),
      ) || []
    );
  }, [userFollowData, userProfileData, userId]);

  const userFollowers = useMemo(() => {
    const followingIds = new Set(
      userProfileData?.following?.map((f) => f.userId),
    );

    return (
      userFollowersData?.pages.flatMap((page) =>
        page.users
          .filter((user) =>
            userProfileData?.users_id === userId
              ? user._id !== userProfileData?.users_id
              : true,
          )
          .map((user) => ({
            ...user,
            isFollowing: followingIds.has(user._id),
          })),
      ) || []
    );
  }, [userFollowersData, userProfileData, userId]);

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

  return (
    <View style={styles.container}>
      <BackHeader label="User Profile" onPress={() => handleBack()} />
      <View style={styles.paddingContainer} className="   ">
        <FlatList
          data={userList}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <UsersScreenUserCardItem item={item} currentUserId={userId} />
          )}
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
                <Text>No University Found</Text>
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
