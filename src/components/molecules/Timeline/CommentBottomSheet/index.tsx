import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { FlatList } from "react-native-actions-sheet";
import userComment from "../UserComment";
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
import Placeholder from "@tiptap/extension-placeholder";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SendSolid, X, XmarkCircle } from "iconoir-react-native";
import { getUserProfileStore } from "@/storage/user";
import UserComment from "../UserComment";
import {
  useCreateGroupPostComment,
  useCreateGroupPostCommentReply,
  useGetCommunityPostComments,
  useLikeUnlikeGroupPostComment,
} from "@/services/communityPost";

type Props = {
  postId: string;
  type: PostType.Community | PostType.Timeline;
  width: any;
  adminID: string;
};

const CommentBottomSheet = ({ postId, type, width, adminID }: Props) => {
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const [showReply, setShowReply] = useState(false);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [showTotalReply, setShowTotalReply] = useState(4);
  const userProfileData: any = getUserProfileStore();
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
      keyboardDidShow
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      keyboardDidHide
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleComment = async () => {
    const text = await editor.getHTML();
    const data: any = {
      postID: postId,
      content: text,
      commenterProfileId: userProfileData._id,
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
      <View
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
        className="relative"
      >
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#7367f0" />
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
      }}
      className="relative"
    >
      <View style={{ marginBottom: keyboardOffset ? 150 : 100 }}>
        <FlatList
          data={
            type == PostType.Community
              ? communityPostCommentsData
              : userCommentsData
          }
          style={{ width: "100%" }}
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
              <View></View>
            )
          }
          ListEmptyComponent={
            isFetching || communityCommentsIsFetching ? (
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

      <View className="w-full flex justify-center items-center">
        <View
          style={{
            bottom: 0,
            height: keyboardOffset > 0 ? 100 : 60,
            marginBottom: 6,
            width: "95%",
          }}
          className="absolute w-11/12   bg-white p-2 border rounded-lg border-neutral-300 "
        >
          {replyingTo?.name && (
            <View
              style={{ top: -12, left: 10 }}
              className="absolute flex flex-row w-40 justify-between"
            >
              <Text className="  text-black bg-white">
                Replying to {replyingTo?.name}
              </Text>
              <TouchableOpacity onPress={() => setReplyingTo(null)}>
                <XmarkCircle
                  height={18}
                  width={18}
                  color={"black"}
                  style={{ backgroundColor: "#f5f5f5", padding: 5 }}
                />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={{
              backgroundColor: "#6744FF",
              position: "absolute",
              bottom: keyboardOffset > 0 ? -40 : -50,
              zIndex: 100,
              right: 0,
              height: 40,
              width: 40,
              //   borderRadius: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
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
          <RichText style={{ marginRight: 40 }} editor={editor} />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{
              position: "absolute",
              width: "100%",
              bottom: 0,
            }}
          >
            <Toolbar editor={editor} />
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  );
};

export default CommentBottomSheet;
