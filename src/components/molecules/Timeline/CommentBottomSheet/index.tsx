import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-actions-sheet";
import {
  useGetUserPostComments,
  useLikeUnlikeUserPostComment,
} from "@/services/timeline";
import { PostType } from "@/types/postType";

import UserComment from "../UserComment";

import {
  useGetCommunityPostComments,
  useLikeUnlikeGroupPostComment,
} from "@/services/communityPost";

import { useNavigation } from "@react-navigation/native";

import NewComment from "../../NewComment";
import ReusableButton from "@/components/atoms/ReusableButton";

type Props = {
  postId: string;
  type: PostType.Community | PostType.Timeline;
  width: any;
  adminID: string;
  hideBottomBar: () => void;
  level: string;
  postAuthorName?: string;
  setShowInitial: (value: boolean) => void;
  showInitial: boolean;
  initialComment: any;
};

const CommentBottomSheet = ({
  postId,
  type,
  width,
  adminID,
  hideBottomBar,
  level,
  postAuthorName,
  showInitial,
  setShowInitial,
  initialComment,
}: Props) => {
  const [showReply, setShowReply] = useState(false);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [showTotalReply, setShowTotalReply] = useState(4);

  const [isModalVisible, setModalVisible] = useState(false);

  const navigate = useNavigation<any>();

  const {
    data: commentsData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetching,
  } = useGetUserPostComments(postId, type == PostType.Timeline, 5);

  const { mutate: likeUserPostComment } = useLikeUnlikeUserPostComment(
    showInitial,
    postId,
  );

  // community
  const {
    data: communityCommentsData,
    fetchNextPage: communityCommentsNextpage,
    isFetchingNextPage: communityCommentsIsFetchingNextPage,
    hasNextPage: communityCommentsHasNextPage,
    isFetching: communityCommentsIsFetching,
  } = useGetCommunityPostComments(postId, type == PostType.Community, 5);

  const { mutate: likeGroupPostComment } = useLikeUnlikeGroupPostComment(
    showInitial,
    postId,
  );

  const userCommentsData =
    commentsData?.pages.flatMap((page) => page.finalComments) || [];
  const communityPostCommentsData =
    communityCommentsData?.pages.flatMap((page) => page.finalComments) || [];

  const handleNavigate = (userID: string) => {
    navigate.navigate("ProfileStack", {
      screen: "Profile",
      params: { userId: userID },
    });
    hideBottomBar();
  };

  const likePostCommentHandler = (commentId: string, level: string) => {
    if (type === PostType.Timeline) {
      likeUserPostComment({ userPostCommentId: commentId, level });
    } else if (type === PostType.Community) {
      likeGroupPostComment({ communityGroupPostCommentId: commentId, level });
    }
  };

  if (
    (isFetching && !userCommentsData.length) ||
    (communityCommentsIsFetching && !communityPostCommentsData.length)
  ) {
    return (
      <View style={styles.fullHeight} className="relative">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#7367f0" />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ minHeight: 400 }}>
      <View style={styles.fullHeight}>
        <View>
          <FlatList
            data={
              showInitial
                ? [initialComment]
                : type == PostType.Community
                  ? communityPostCommentsData
                  : userCommentsData
            }
            style={styles.flatList}
            keyExtractor={(item, index) => item?._id + index}
            ListHeaderComponent={
              showInitial && [initialComment]?.length > 1 ? (
                <View className="flex flex-row justify-end px-4">
                  <TouchableOpacity
                    onPress={() => setShowInitial(false)}
                    className="bg-primary-500 px-2 py-1 rounded-lg"
                  >
                    <Text className="text-white text-md">See All</Text>
                  </TouchableOpacity>
                </View>
              ) : null
            }
            renderItem={({ item }) => (
              <UserComment
                item={item}
                width={width}
                setShowReply={setShowReply}
                showReply={showReply}
                setReplyingTo={setReplyingTo}
                likePostCommentHandler={likePostCommentHandler}
                setShowTotalReply={setShowTotalReply}
                showTotalReply={showTotalReply}
                handleNavigate={handleNavigate}
                setModalVisible={setModalVisible}
                type={type}
              />
            )}
            onEndReached={() => {
              if (
                hasNextPage &&
                !isFetchingNextPage &&
                type == PostType.Timeline
              ) {
                fetchNextPage();
              }
              if (
                communityCommentsHasNextPage &&
                !communityCommentsIsFetchingNextPage &&
                type == PostType.Community
              ) {
                communityCommentsNextpage();
              }
            }}
            ListFooterComponent={
              communityCommentsIsFetchingNextPage || isFetchingNextPage ? (
                <View>
                  <ActivityIndicator size="large" color="#7367f0" />
                </View>
              ) : (
                <View></View>
              )
            }
            ListEmptyComponent={
              isFetching || communityCommentsIsFetching ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#7367f0" />
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text>No Result Found</Text>
                </View>
              )
            }
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <ReusableButton
          onPress={() => {
            setReplyingTo(null), setModalVisible(true);
          }}
          buttonText="Add Comment"
          variant="primary"
          size="w-full "
          containerStyle="mt-2 "
        />
      </View>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <NewComment
          setModalVisible={setModalVisible}
          showInitial={showInitial}
          type={type}
          postId={postId}
          adminID={adminID}
          level={replyingTo?.commentId?.length ? true : false}
          commentData={replyingTo}
          postAuthorName={postAuthorName || ""}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default CommentBottomSheet;

const styles = StyleSheet.create({
  fullHeight: {
    display: "flex",
    justifyContent: "space-between",
    minHeight: 400,
    marginBottom: 80,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatList: {
    width: "100%",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centered: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  commentContainer: {
    bottom: 0,
    marginBottom: 6,
    width: "95%",
    position: "absolute",
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#d4d4d4",
    paddingLeft: 10,
  },
  replyingToContainer: {
    position: "absolute",
    top: -12,
    left: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: 160,
    zIndex: 20,
  },
  closeIcon: {
    backgroundColor: "#f5f5f5",
    padding: 5,
  },
  mediaIcon: {
    marginStart: 16,
    position: "absolute",
    left: -24,
  },
  sendButton: {
    backgroundColor: "#6744FF",
    position: "absolute",
    zIndex: 100,
    right: 0,
    height: 40,
    width: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 300,
  },
  richText: {
    marginRight: 40,
    paddingLeft: 20,
  },
  keyboardAvoidingView: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },

  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
});
