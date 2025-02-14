import { ActivityIndicator, FlatList, Text, View } from "react-native";
import React, { useCallback, useState } from "react";

import PostCard from "@/components/molecules/Timeline/PostCard";
import { useGetTimelinePosts } from "@/services/timeline";
import { RefreshControl } from "react-native-gesture-handler";
import { useQueryClient } from "@tanstack/react-query";
import { useHeader } from "@/context/HeaderProvider/Header";
import { useFocusEffect } from "@react-navigation/native";

const Timeline = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const {
    isLoading,
    data: TimelinePosts,
    error,
    fetchNextPage: timelinePostsNextpage,
    isFetchingNextPage: timelinePostIsFetchingNextPage,
    hasNextPage: timelinePostHasNextPage,
    isFetching,
  } = useGetTimelinePosts(2);
  const queryClient = useQueryClient();
  const { changeHeaderShownStatus, setCurrScreen } = useHeader();
  const [lastOffset, setLastOffset] = useState(0);
  const timlineDatas =
    TimelinePosts?.pages.flatMap((page) => page?.allPosts) || [];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    queryClient.invalidateQueries({ queryKey: ["timelinePosts"] });
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setCurrScreen("timeline");

      return () => {
        setCurrScreen("");
      };
    }, [])
  );

  const handleScroll = (event: any) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    if (contentOffsetY > lastOffset) {
      changeHeaderShownStatus(false);
    } else if (contentOffsetY < lastOffset && contentOffsetY > 0) {
      changeHeaderShownStatus(true);
    }

    setLastOffset(contentOffsetY);
  };

  return (
    <View className="bg-white flex-1 ">
      <FlatList
        data={timlineDatas}
        style={{
          width: "100%",
          height: "100%",
        }}
        onScroll={handleScroll}
        keyExtractor={(item, index) => item._id + index}
        renderItem={({ item }) => <PostCard data={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={() => {
          if (timelinePostHasNextPage && !timelinePostIsFetchingNextPage) {
            timelinePostsNextpage();
          }
        }}
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
