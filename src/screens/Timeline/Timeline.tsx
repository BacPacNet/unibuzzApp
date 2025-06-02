import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";

import PostCard from "@/components/molecules/Timeline/PostCard";
import { useGetTimelinePosts } from "@/services/timeline";
import { RefreshControl } from "react-native-gesture-handler";
import { useQueryClient } from "@tanstack/react-query";

import { useNavigation } from "@react-navigation/native";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import CreatePostButton from "@/components/atoms/CreatePostButton";

type NavigationProp = StackNavigationProp<RootStackParamList, "Timeline">;
const Timeline = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation<NavigationProp>();
  const {
    isLoading,
    data: TimelinePosts,
    error,
    fetchNextPage: timelinePostsNextpage,
    isFetchingNextPage: timelinePostIsFetchingNextPage,
    hasNextPage: timelinePostHasNextPage,
    isFetching,
  } = useGetTimelinePosts(10);

  const queryClient = useQueryClient();

  const timlineDatas =
    TimelinePosts?.pages.flatMap((page) => page?.allPosts) || [];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    queryClient.invalidateQueries({ queryKey: ["timelinePosts"] });
    setRefreshing(false);
  }, []);

  return (
    <View style={{ position: "relative" }} className="bg-white flex-1 relative">
      <CreatePostButton
        isAllowed={true}
        onPress={() => navigation.navigate("NewPost")}
      />
      <FlatList
        data={timlineDatas}
        style={{
          width: "100%",
          height: "100%",
        }}
        // onScroll={handleScroll}
        keyExtractor={(item, index) => item._id + index}
        renderItem={({ item }) => <PostCard data={item} isTimeline={true} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={() => {
          if (timelinePostHasNextPage && !timelinePostIsFetchingNextPage) {
            timelinePostsNextpage();
          }
        }}
        ListFooterComponent={
          timelinePostIsFetchingNextPage && timelinePostHasNextPage ? (
            <View>
              <ActivityIndicator size="large" color="#7367f0" />
            </View>
          ) : (
            <View></View>
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

export default Timeline;
