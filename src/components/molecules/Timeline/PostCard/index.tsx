import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import PostActionModal from "../../PostOptions";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { RenderCreatedAt } from "@/components/atoms/CreatedAt";
import { defaultBottomSheetSnapPoints } from "@/types/constant";

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

const PostCard = memo(
  ({
    data,
    isTimeline = true,
    communityGroupId = "",
    isSinglePost = false,
    initialComment,
    toShowInitial = false,
  }: PostCardType) => {
    const navigation = useNavigation<ScreenNavigationProp>();
    const [visible, setVisible] = useState(false);
    const { width } = useWindowDimensions();
    const userData = getUserStore();
    const commentBottomSheet = useRef<ActionSheetRef>(null);
    const [showInitial, setShowInitial] = useState(false);
    const insets = useSafeAreaInsets();
    const { mutate: mutateDeletePost } = useDeleteUserPost();
    const { mutate: mutateDeleteCommunityPost } = useDeleteCommunityPost();

    const isSelfLike = useMemo(() => {
      return data?.likeCount?.some((like: any) => like.userId == userData?.id);
    }, [data]);

    const resolvedPostType = isSinglePost
      ? data?.communityId || data?.community?._id
        ? PostType.Community
        : PostType.Timeline
      : data?.communityId || data?.community?._id
        ? PostType.Community
        : PostType.Timeline;

    const { mutate: LikeUnlikeGroupPost, isPending: isLikeUnlikeGroupPending } =
      useLikeUnilikeGroupPost(
        data?.communityId,
        communityGroupId,
        isTimeline,
        isSinglePost,
      );
    const { mutate: LikeUnlikeTimelinePost, isPending: isLikeUnlikePending } =
      useLikeUnlikeTimelinePost("" as string, data?.user?._id, isSinglePost);

    const sharePost = async (
      message = "Hey, check out this amazing post! https://example.com/post/123",
    ) => {
      try {
        await Share.share({ message });
      } catch (error: any) {
        Toast.show(error || "Something went wrong");
      }
    };

    const LikeUnlikeHandler = (postId: string) => {
      if (
        isSinglePost || !isTimeline ? !data?.communityId : !data?.community?._id
      ) {
        LikeUnlikeTimelinePost(postId);
      } else if (
        isSinglePost || !isTimeline ? data?.communityId : data?.community?._id
      ) {
        LikeUnlikeGroupPost(postId);
      }
    };

    const handleDeletePost = () => {
      if (
        isSinglePost || !isTimeline ? data?.communityId : data?.community?._id
      ) {
        mutateDeleteCommunityPost(data?._id);
      } else {
        mutateDeletePost(data?._id);
      }

      setVisible(false);
      if (isSinglePost) {
        navigation.goBack();
      }
    };

    const hideBottomBar = () => {
      commentBottomSheet.current?.hide();
    };

    useFocusEffect(
      useCallback(() => {
        if (toShowInitial) {
          setShowInitial(true);
          commentBottomSheet.current?.show();
        }

        return () => {
          setShowInitial(false);
        };
      }, [data, toShowInitial]),
    );

    const postSourceText = useMemo(() => {
      if (
        (data?.community?.name || data?.communityName) &&
        data?.communityGroupName
      ) {
        return `Posted in ${data?.communityGroupName} group at ${data?.community?.name || data?.communityName}`;
      }
      if (data?.community?.name || data?.communityName) {
        return `Posted from ${data?.community?.name || data?.communityName}`;
      }
      return "";
    }, [data, communityGroupId]);

    return (
      <View
        className={`relative bg-white ${isSinglePost ? "flex-1 " : ""} flex   gap-4 my-4 z-1`}
      >
        <PostCardUserDetails
          visible={visible}
          setVisible={setVisible}
          name={data?.user?.firstName + " " + data?.user?.lastName}
          year={
            isSinglePost
              ? data?.profile?.study_year
              : data?.userProfile?.study_year
          }
          major={isSinglePost ? data?.profile?.major : data?.userProfile?.major}
          degree={data?.userProfile?.degree}
          university={data?.userProfile?.university_name}
          affiliation={
            isSinglePost
              ? data?.profile?.affiliation
              : data?.userProfile?.affiliation
          }
          occupation={
            isSinglePost
              ? data?.profile?.occupation
              : data?.userProfile?.occupation
          }
          role={data?.userProfile?.role}
          communityName={
            isSinglePost ? data?.communityName : data?.community?.name
          }
          communityGroupName={
            isSinglePost ? data?.communityGroupName : data?.communityGroupName
          }
          dp={data?.userProfile?.profile_dp?.imageUrl || " "}
          postId={data?._id}
          type={resolvedPostType}
          isAdmin={
            isSinglePost
              ? data?.user_id == userData?.id
              : data?.user?._id == userData?.id
          }
          postAdminId={data?.user?._id}
          handleDeletePost={handleDeletePost}
          isPostVerified={data.isPostVerified}
          isCommunityAdmin={data?.userProfile?.isCommunityAdmin}
        />
        {Number(data?.content?.length) > 1 && data?.content ? (
          <View className="px-4">
            <RenderHtml
              contentWidth={width}
              source={{ html: data?.content }}
              tagsStyles={{ body: { color: "black" } }}
              ignoredDomTags={["label", "input"]}
            />
          </View>
        ) : (
          <View></View>
        )}
        <View style={{ flex: 1 }}>
          <ImageGridLayout imagesData={data?.imageUrl || []} />
        </View>

        <View className="px-4">
          <RenderCreatedAt
            date={data?.createdAt}
            postSourceText={postSourceText}
          />
        </View>

        <View className="flex flex-row justify-between py-2 px-4 border-t border-b border-neutral-300">
          <View className="flex flex-row gap-4">
            <TouchableOpacity
              onPress={() => LikeUnlikeHandler(data?._id)}
              className="flex flex-row gap-2 items-center"
            >
              <Text className="text-sm font-bold text-neutral-500">
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
              onPress={() => {
                commentBottomSheet.current?.show();
                setShowInitial(false);
              }}
              className="flex flex-row gap-2 items-center"
            >
              <Text className="text-sm font-bold text-neutral-500">
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
          snapPoints={defaultBottomSheetSnapPoints}
          containerStyle={{
            paddingTop: 10,
          }}
        >
          <CommentBottomSheet
            postId={data?._id}
            type={resolvedPostType}
            width={width}
            adminID={isSinglePost ? data?.user_id : data?.user?._id}
            level={data?.level}
            hideBottomBar={hideBottomBar}
            postAuthorName={data?.user?.firstName + " " + data?.user?.lastName}
            setShowInitial={setShowInitial}
            showInitial={showInitial}
            initialComment={initialComment}
          />
        </ActionSheet>
      </View>
    );
  },
);

export default PostCard;
