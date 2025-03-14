import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";

import PostCard from "@/components/molecules/Timeline/PostCard";
import { useGetTimelinePosts } from "@/services/timeline";
import { RefreshControl } from "react-native-gesture-handler";
import { useQueryClient } from "@tanstack/react-query";
import { useHeader } from "@/context/HeaderProvider/Header";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";

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
  const { changeHeaderShownStatus, setCurrScreen } = useHeader();
  const [lastOffset, setLastOffset] = useState(0);
  const timlineDatas =
    TimelinePosts?.pages.flatMap((page) => page?.allPosts) || [];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    queryClient.invalidateQueries({ queryKey: ["timelinePosts"] });
    setRefreshing(false);
  }, []);

  //   useFocusEffect(
  //     useCallback(() => {
  //       setCurrScreen("timeline");

  //       return () => {
  //         setCurrScreen("");
  //       };
  //     }, [])
  //   );

  //   const handleScroll = (event: any) => {
  //     const contentOffsetY = event.nativeEvent.contentOffset.y;
  //     if (contentOffsetY > lastOffset) {
  //       changeHeaderShownStatus(false);
  //     } else if (contentOffsetY < lastOffset && contentOffsetY > 0) {
  //       changeHeaderShownStatus(true);
  //     }

  //     setLastOffset(contentOffsetY);
  //   };

  return (
    <View style={{ position: "relative" }} className="bg-white flex-1 relative">
      <View style={styles.plusButtonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("NewPost")}
          style={styles.createButton}
        >
          <Text style={{ color: "white", fontSize: 24 }}>+</Text>
        </TouchableOpacity>
      </View>
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

export default Timeline;

const styles = StyleSheet.create({
  plusButtonContainer: {
    position: "absolute",
    right: 20,
    top: "80%",
    zIndex: 200,
  },
  createButton: {
    backgroundColor: "#6744FF",
    padding: 15,
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
