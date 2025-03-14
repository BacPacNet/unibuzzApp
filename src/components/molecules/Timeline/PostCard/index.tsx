import React, { memo, useMemo, useRef, useState } from "react";
import {
  Share,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import PostCardUserDetails from "../PostCardUserDetails";
import ImageGridLayout from "../../ImageGridLayout";
import { ChatBubbleEmpty, ShareAndroid, ThumbsUp } from "iconoir-react-native";
import dayjs from "dayjs";

import RenderHtml from "react-native-render-html";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import CommentBottomSheet from "../CommentBottomSheet";
import { PostCardType, PostType } from "@/types/postType";
import {
  useDeleteUserPost,
  useLikeUnlikeTimelinePost,
} from "@/services/timeline";
import {
  useDeleteCommunityPost,
  useLikeUnilikeGroupPost,
} from "@/services/communityPost";
import { getUserStore } from "@/storage/user";
import { Toast } from "react-native-toast-notifications";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PostCardOption from "../PostCardOption";

const PostCard = memo(
  ({ data, isTimeline = true, communityGroupId = "" }: PostCardType) => {
    const [visible, setVisible] = useState(false);
    const { width } = useWindowDimensions();
    const userData = getUserStore();
    const commentBottomSheet = useRef<ActionSheetRef>(null);
    const insets = useSafeAreaInsets();
    const { mutate: mutateDeletePost } = useDeleteUserPost();
    const { mutate: mutateDeleteCommunityPost } = useDeleteCommunityPost();

    const isSelfLike = useMemo(() => {
      return data?.likeCount?.some((like: any) => like.userId == userData?.id);
    }, [data]);

    const { mutate: LikeUnlikeGroupPost, isPending: isLikeUnlikeGroupPending } =
      useLikeUnilikeGroupPost(
        data?.communityId,
        communityGroupId,
        !!data?.communityId && isTimeline
      );
    const { mutate: LikeUnlikeTimelinePost, isPending: isLikeUnlikePending } =
      useLikeUnlikeTimelinePost();

    const sharePost = async (
      message = "Hey, check out this amazing post! https://example.com/post/123"
    ) => {
      try {
        await Share.share({ message });
      } catch (error: any) {
        Toast.show(error || "Something went wrong");
      }
    };

    const LikeUnlikeHandler = (postId: string) => {
      if (!data?.communityId) {
        LikeUnlikeTimelinePost(postId);
      } else if (data?.communityId) {
        LikeUnlikeGroupPost(postId);
      }
    };

    const handleDeletePost = () => {
      if (data?.communityId) {
        mutateDeleteCommunityPost(data?._id);
      } else {
        mutateDeletePost(data?._id);
      }
      setVisible(false);
    };

    const hideBottomBar = () => {
      commentBottomSheet.current?.hide();
    };

    return (
      <View className="relative bg-white flex gap-4 my-4 z-1">
        {visible && (
          <PostCardOption
            handleDeletePost={handleDeletePost}
            isAdmin={data?.user?._id === userData?.id}
          />
        )}
        <PostCardUserDetails
          visible={visible}
          setVisible={setVisible}
          name={data?.user?.firstName + " " + data?.user?.lastName}
          year={data?.userProfile?.study_year}
          degree={data?.userProfile?.degree}
          university={data?.userProfile?.university_name}
          dp={data?.userProfile?.profile_dp?.imageUrl || " "}
          postId={data?._id}
          type={data?.communityId ? PostType.Community : PostType.Timeline}
          isAdmin={data?.user?._id == userData?.id}
          postAdminId={data?.user?._id}
        />

        <ImageGridLayout imagesData={data?.imageUrl || []} />

        {data?.content && (
          <View className="px-4">
            <RenderHtml
              contentWidth={width}
              source={{ html: data?.content }}
              tagsStyles={{ body: { color: "black" } }}
              ignoredDomTags={["label", "input"]}
            />
          </View>
        )}

        <View className="px-4">
          <Text className="text-neutral-400">
            {dayjs(data?.createdAt).format("h:mm A · MMM D, YYYY")}
            {data?.communityId
              ? `· Post from   ${data?.userProfile?.university_name} `
              : ""}
            <Text className=""> </Text>
          </Text>
        </View>
        <View className="flex flex-row justify-between py-2 px-4 border-t border-b border-neutral-300">
          <View className="flex flex-row gap-4">
            <TouchableOpacity
              onPress={() => LikeUnlikeHandler(data?._id)}
              className="flex flex-row gap-2 items-center"
            >
              <Text className="text-lg font-bold text-neutral-500">
                {data?.likeCount?.length}
              </Text>
              <ThumbsUp
                strokeWidth={2}
                color={isSelfLike ? "#6647FF" : "#6B7280"}
                height={20}
                width={20}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => commentBottomSheet.current?.show()}
              className="flex flex-row gap-2 items-center"
            >
              <Text className="text-lg font-bold text-neutral-500">
                {data?.commentCount}
              </Text>
              <ChatBubbleEmpty
                strokeWidth={2}
                color="#6B7280"
                height={20}
                width={20}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => sharePost()}
            className="flex flex-row gap-2 items-center"
          >
            <ShareAndroid
              strokeWidth={2}
              color="#6B7280"
              height={20}
              width={20}
            />
          </TouchableOpacity>
        </View>
        <ActionSheet
          useBottomSafeAreaPadding
          ref={commentBottomSheet}
          gestureEnabled={true}
          safeAreaInsets={insets}
          // snapPoints={[70, 100]}
          containerStyle={{
            //  height: "100%",
            //  marginBottom: insets.bottom, // Keeps it above the home indicator
            paddingTop: 10,
            //  borderTopLeftRadius: 20,
            //  borderTopRightRadius: 20,
          }}
        >
          <CommentBottomSheet
            postId={data?._id}
            type={data?.communityId ? PostType.Community : PostType.Timeline}
            width={width}
            adminID={data?.user?._id}
            hideBottomBar={hideBottomBar}
          />
        </ActionSheet>
      </View>
    );
  }
);

export default PostCard;
