import React, { useEffect, useState } from "react";
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
import { MessageTextSolid, NavArrowDown } from "iconoir-react-native";
import DropdownWrapper from "../../SelectDropDownWrapper";
import CommentSortDropDownMenu from "../CommentSortDropDownMenu";
import { Sortby } from "@/types/constant";
import { SafeScreen } from "@/components/template";
import { FONTS } from "@/constants/fonts";
import CommentButtonIcon from "@/assets/icons/comment-button-icon.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ContentType } from "@/types/report-content";

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
  isReply?: boolean;
  commentId?: string;
  communityId?: string;
  communityGroupId?: string;
  postContentType: ContentType;
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
  isReply = false,
  commentId = "",
  communityId,
  communityGroupId,
  postContentType,
}: Props) => {
  const [showReply, setShowReply] = useState(false);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [showTotalReply, setShowTotalReply] = useState(4);
  const [selectedOption, setSelectedOption] = useState<string>("Newest First");
  const [selectedSortValue, setSelectedSortValue] = useState(Sortby.DESC);
  const [isModalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const navigate = useNavigation<any>();

  const {
    data: commentsData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isInitialLoading,
    refetch: refetchUserPostComment,
  } = useGetUserPostComments(
    postId,
    type == PostType.Timeline,
    5,
    selectedSortValue
  );

  const { mutate: likeUserPostComment } = useLikeUnlikeUserPostComment(
    showInitial,
    postId,
    selectedSortValue
  );

  // community
  const {
    data: communityCommentsData,
    fetchNextPage: communityCommentsNextpage,
    isFetchingNextPage: communityCommentsIsFetchingNextPage,
    hasNextPage: communityCommentsHasNextPage,
    isFetching: communityCommentsIsFetching,
    isLoading: communityCommentsIsLoading,
    isInitialLoading: communityCommentsIsInitialLoading,
    refetch: refetchCommunityPostComment,
  } = useGetCommunityPostComments(
    postId,
    type == PostType.Community,
    5,
    selectedSortValue
  );

  const { mutate: likeGroupPostComment } = useLikeUnlikeGroupPostComment(
    showInitial,
    postId,
    selectedSortValue,
    communityId || "",
    communityGroupId || ""
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

  const likePostCommentHandler = (
    commentId: string,
    level: string,
    isSelfLike: boolean
  ) => {
    if (type === PostType.Timeline) {
      likeUserPostComment({ userPostCommentId: commentId, level, isSelfLike });
    } else if (type === PostType.Community) {
      likeGroupPostComment({
        communityGroupPostCommentId: commentId,
        level,
        isSelfLike,
      });
    }
  };

  useEffect(() => {
    if (isReply) {
      setShowReply(commentId as any);
    }
  }, [isReply]);

  const handleSelect = (option: { value: string; label: string }) => {
    setSelectedOption(option.label);

    setSelectedSortValue(option.value as Sortby);
    if (type === PostType.Timeline) {
      refetchUserPostComment();
    } else {
      refetchCommunityPostComment();
    }
  };

  const isUserCommentsLoading =
    isLoading || isInitialLoading || (isFetching && !userCommentsData.length);
  const isCommunityCommentsLoading =
    communityCommentsIsLoading ||
    communityCommentsIsInitialLoading ||
    (communityCommentsIsFetching && !communityPostCommentsData.length);

  if (isUserCommentsLoading || isCommunityCommentsLoading) {
    return (
      <View style={styles.fullHeight} className="relative">
        <View className="flex-1  items-center">
          <ActivityIndicator size="large" color="#6744ff" />
        </View>
      </View>
    );
  }

  return (
    <View style={{ paddingBottom: insets.bottom }}>
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
              ) : (
                <View style={styles.commentHeader}>
                  <View>
                    <DropdownWrapper
                      position="bottom"
                      extraBottom={-40}
                      viewLeftPosition={2}
                      renderDropdown={(closeDropdown) => (
                        <CommentSortDropDownMenu
                          handleSelect={(option) => {
                            handleSelect(option);
                            closeDropdown();
                          }}
                        />
                      )}
                    >
                      <TouchableOpacity style={styles.dropDown}>
                        <View>
                          <Text style={styles.dropDownText}>
                            {selectedOption}
                          </Text>
                        </View>

                        <NavArrowDown
                          height={20}
                          width={20}
                          color={"#242526"}
                          strokeWidth={2}
                        />
                      </TouchableOpacity>
                    </DropdownWrapper>
                  </View>
                  <ReusableButton
                    onPress={() => {
                      setReplyingTo(null), setModalVisible(true);
                    }}
                    buttonContent={
                      <View className="flex flex-row items-center  justify-center gap-2">
                        <CommentButtonIcon
                          width={16}
                          height={16}
                          color="#fff"
                        />
                        <Text style={styles.commentButtonText}>Comment</Text>
                      </View>
                    }
                    variant="primary"
                    size={108}
                    height="small"
                    containerStyle=" "
                  />
                </View>
              )
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
                communities={item?.commenterProfileId?.communities}
                postId={postId}
                postContentType={postContentType}
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
              isUserCommentsLoading || isCommunityCommentsLoading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#7367f0" />
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text className="text-neutral-500">No Result Found</Text>
                </View>
              )
            }
          />
        </View>
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
          setShowReply={setShowReply}
          sortby={selectedSortValue}
        />
      </Modal>
    </View>
  );
};

export default CommentBottomSheet;

const styles = StyleSheet.create({
  fullHeight: {
    display: "flex",
    justifyContent: "space-between",
    minHeight: "100%",
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

  commentHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  commentButtonText: {
    fontSize: 12,
    color: "#FFF",
    fontFamily: FONTS.inter.medium,
    textAlignVertical: "center",
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

  dropDown: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    width: 125,
  },
  dropDownText: {
    fontSize: 12,
    fontFamily: FONTS.inter.medium,
    color: "#3A3B3C",
  },
});
