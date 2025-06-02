import PostCard from "@/components/molecules/Timeline/PostCard";
import { useGetPost } from "@/services/university-community";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const SinglePost = ({ route }: any) => {
  const { postID, type } = route.params;

  const { data, isFetching, isPending, isError, isLoading } = useGetPost(
    postID,
    type,
    " ",
  );

  const item = data?.post;

  if (isError) {
    return (
      <View style={styles.errContainer}>
        <Text>Not Allowed</Text>
      </View>
    );
  }

  if (isLoading || (!data?.post && !isError)) {
    return (
      <View style={styles.errContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PostCard data={item} isTimeline={false} isSinglePost={true} />
    </View>
  );
};

export default SinglePost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "white",
  },
  errContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
