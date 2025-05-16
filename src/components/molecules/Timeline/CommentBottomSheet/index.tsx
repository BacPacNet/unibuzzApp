import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlatList } from "react-native-actions-sheet";
import {
  useCreateUserPostComment,
  useCreateUserPostCommentReply,
  useGetUserPostComments,
  useLikeUnlikeUserPostComment,
} from "@/services/timeline";
import { PostType } from "@/types/postType";
import {
  DropCursorBridge,
  LinkBridge,
  PlaceholderBridge,
  RichText,
  TenTapStartKit,
  Toolbar,
  useEditorBridge,
} from "@10play/tentap-editor";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MediaImage, SendSolid, X, XmarkCircle } from "iconoir-react-native";
import { getUserProfileStore } from "@/storage/user";
import UserComment from "../UserComment";

import {
  useCreateGroupPostComment,
  useCreateGroupPostCommentReply,
  useGetCommunityPostComments,
  useLikeUnlikeGroupPostComment,
} from "@/services/communityPost";
import { launchImageLibrary } from "react-native-image-picker";
import { replaceImage } from "@/services/uploadImage";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  postId: string;
  type: PostType.Community | PostType.Timeline;
  width: any;
  adminID: string;
  hideBottomBar: () => void;
};

type ImageAsset = {
  uri: string;
  fileName?: string;
  fileSize?: number;
  height?: number;
  width?: number;
  type?: string;
};

const CommentBottomSheet = ({
  postId,
  type,
  width,
  adminID,
  hideBottomBar,
}: Props) => {
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const [showReply, setShowReply] = useState(false);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [showTotalReply, setShowTotalReply] = useState(4);
  const userProfileData = getUserProfileStore();
  const [images, setImages] = useState<ImageAsset[]>([]);
  const navigate = useNavigation<any>();
  const editor = useEditorBridge({
    // autofocus: true,
    avoidIosKeyboard: true,

    bridgeExtensions: [
      ...TenTapStartKit,
      PlaceholderBridge.configureExtension({
        placeholder: "Hey there! Start typing...",
      }),
      LinkBridge.configureExtension({ openOnClick: false }),
      DropCursorBridge.configureExtension({
        color: "#84affe",
        width: 2,
      }),
    ],
  });
  const {
    data: commentsData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetching,
  } = useGetUserPostComments(postId, type == PostType.Timeline, 5);

  const {
    mutate: CreateUserPostComment,
    isPending: CreateUserPostCommentLoading,
  } = useCreateUserPostComment(false);
  const {
    mutate: CreateUserPostCommentReply,
    isPending: CreateUserPostCommentReplyLoading,
  } = useCreateUserPostCommentReply(true, PostType.Timeline);

  const { mutate: likeUserPostComment } = useLikeUnlikeUserPostComment();

  // community
  const {
    data: communityCommentsData,
    fetchNextPage: communityCommentsNextpage,
    isFetchingNextPage: communityCommentsIsFetchingNextPage,
    hasNextPage: communityCommentsHasNextPage,
    isFetching: communityCommentsIsFetching,
  } = useGetCommunityPostComments(postId, type == PostType.Community, 5);
  const {
    mutate: CreateGroupPostComment,
    isPending: CreateGroupPostCommentLoading,
  } = useCreateGroupPostComment();
  const {
    mutate: CreateGroupPostCommentReply,
    isPending: useCreateGroupPostCommentReplyLoading,
  } = useCreateGroupPostCommentReply();
  const { mutate: likeGroupPostComment } = useLikeUnlikeGroupPostComment();

  const userCommentsData =
    commentsData?.pages.flatMap((page) => page.finalComments) || [];
  const communityPostCommentsData =
    communityCommentsData?.pages.flatMap((page) => page.finalComments) || [];

  useEffect(() => {
    const keyboardDidShow = (event: any) => {
      setKeyboardOffset(event.endCoordinates.height);
    };
    const keyboardDidHide = () => {
      setKeyboardOffset(0);
    };

    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      keyboardDidShow,
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      keyboardDidHide,
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const processImages = async (imagesData: any[]) => {
    const promises = imagesData.map((image) => replaceImage(image, ""));
    const results = await Promise.all(promises);
    return results.map((result) => ({
      imageUrl: result?.imageUrl,
      publicId: result?.publicId,
    }));
  };

  const handleImagePick = useCallback(() => {
    launchImageLibrary(
      { mediaType: "photo", selectionLimit: 0 },
      (response: any) => {
        if (response.assets && response.assets.length > 0) {
          setImages((prevImages) => [...prevImages, ...response.assets]);
        }
      },
    );
  }, []);

  const handleImageRemove = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleNavigate = (userID: string) => {
    console.log("test");

    navigate.navigate("ProfileStack", {
      screen: "Profile",
      params: { userId: userID },
    });
    hideBottomBar();
  };

  const handleComment = async () => {
    const text = await editor.getHTML();
    let fileLinks;
    if (images && images.length > 0) {
      fileLinks = await processImages(images);
    }
    const data: any = {
      postID: postId,
      content: text,
      commenterProfileId: userProfileData?._id,
      imageUrl: fileLinks,
    };

    if (type == PostType.Timeline) {
      if (replyingTo?.name) {
        data.level = 1;
        data.commentId = replyingTo?.commentId;
        CreateUserPostCommentReply(data);
      } else {
        CreateUserPostComment(data);
      }
    }

    // for community comments
    if (type == PostType.Community) {
      data.adminId = adminID;
      if (replyingTo?.name) {
        data.level = 1;
        data.commentId = replyingTo?.commentId;

        CreateGroupPostCommentReply(data);
      } else {
        CreateGroupPostComment(data);
      }
    }

    setImages([]);
  };

  const likePostCommentHandler = (commentId: string) => {
    if (type === PostType.Timeline) {
      likeUserPostComment(commentId);
    } else if (type === PostType.Community) {
      likeGroupPostComment(commentId);
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
    <SafeAreaView>
      <View style={styles.fullHeight}>
        <View style={{ marginBottom: keyboardOffset ? 150 : 80 }}>
          <FlatList
            data={
              type == PostType.Community
                ? communityPostCommentsData
                : userCommentsData
            }
            style={styles.flatList}
            keyExtractor={(item, index) => item._id + index}
            renderItem={({ item }) =>
              UserComment({
                item,
                width: width,
                setShowReply,
                showReply,
                setReplyingTo,
                likePostCommentHandler,
                setShowTotalReply,
                showTotalReply,
                handleNavigate,
              })
            }
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
                <View />
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

        <View style={styles.centered}>
          <View
            style={[
              styles.commentContainer,
              {
                height: keyboardOffset > 0 ? 100 : 50,
              },
            ]}
          >
            {replyingTo?.name ? (
              <View style={styles.replyingToContainer}>
                <TouchableOpacity
                  onPress={handleImagePick}
                  style={styles.mediaIcon}
                >
                  <MediaImage height={20} width={20} color={"#a3a3a3"} />
                </TouchableOpacity>
                <Text>Replying to {replyingTo?.name}</Text>
                <TouchableOpacity onPress={() => setReplyingTo(null)}>
                  <XmarkCircle
                    height={18}
                    width={18}
                    color={"black"}
                    style={styles.closeIcon}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.replyingToContainer}>
                <TouchableOpacity
                  onPress={handleImagePick}
                  style={styles.mediaIcon}
                >
                  <MediaImage height={20} width={20} color={"#a3a3a3"} />
                </TouchableOpacity>
                <Text>Commenting on Post</Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  bottom: keyboardOffset > 0 ? -45 : -45,
                },
              ]}
              onPress={() => handleComment()}
            >
              {CreateGroupPostCommentLoading ||
              CreateUserPostCommentReplyLoading ||
              CreateUserPostCommentLoading ||
              useCreateGroupPostCommentReplyLoading ? (
                <ActivityIndicator color={"white"} />
              ) : (
                <SendSolid height={18} width={18} color={"white"} />
              )}
            </TouchableOpacity>
            <RichText style={styles.richText} editor={editor} />

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.keyboardAvoidingView}
            >
              <Toolbar editor={editor} />
            </KeyboardAvoidingView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CommentBottomSheet;

const styles = StyleSheet.create({
  fullHeight: {
    display: "flex",
    justifyContent: "space-between",
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
});
