import PostCard from "@/components/molecules/Timeline/PostCard";
import { screenName } from "@/constant/screenName";
import { useGetPost } from "@/services/university-community";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import useCustomBackHandler from "@/hooks/useCustomBackHandler";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import ErrorContainer from "@/components/molecules/ErrorContainer";
import { MESSAGES } from "@/content/constant";

type NavigationProp = StackNavigationProp<RootStackParamList, "SinglePost">;

const SinglePost = ({ route }: any) => {
  const navigation = useNavigation<NavigationProp>();
  const { postID, type, commentId } = route.params;
  const isReply = route.params.isReply || false;
  const from = route?.params?.from || "";
  const { data, isFetching, isPending, isError, isLoading, refetch } =
    useGetPost(postID, type, commentId || "");

  const item = data?.post;
  const comment = data?.comment;

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );
  const handleBack = () => {
    if (from === screenName.notifications) {
      navigation.navigate("Notifications");
    } else {
      navigation.goBack();
    }
  };
  useCustomBackHandler(handleBack);

  if (isError) {
    return (
      <ErrorContainer
        title={MESSAGES.POST_NOT_FOUND}
        description={MESSAGES.POST_NOT_FOUND_DESCRIPTION}
      />
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
    <ScrollView style={styles.container}>
      <PostCard
        data={item}
        isTimeline={false}
        isSinglePost={true}
        initialComment={comment}
        toShowInitial={!!commentId}
        isReply={isReply}
        commentId={commentId}
      />
    </ScrollView>
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
