import React, { memo, useCallback, useRef } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import RenderHtml from "react-native-render-html";
import ActionSheet, {
  ActionSheetRef,
  FlatList,
} from "react-native-actions-sheet";
import CommentBottomSheet from "../CommentBottomSheet";
import { PostType } from "@/types/postType";
import { useLikeUnlikeTimelinePost } from "@/services/timeline";
import { useLikeUnilikeGroupPost } from "@/services/communityPost";
import { getUserStore } from "@/storage/user";

type NavigationProp = StackNavigationProp<RootStackParamList, "Timeline">;

type Props = {
  data: {
    user: {
      firstName: string;
      lastName: string;
      _id: string;
    };
    _id: string;
    university: string;
    adminId: string;
    year: string;
    text: string;
    link?: string;
    date: string;
    avatarLink: string;
    communityGroupId?: string;
    communityId?: string;
    commentCount: number;
    content?: string;
    // likes: Like[]
    // postID: string
    // type: PostType.Community | PostType.Timeline
    userProfile: {
      study_year: string;
      degree: string;
      university_name: string;
      profile_dp: {
        imageUrl: string;
      };
      major: string;
    };

    imageUrl: {
      imageUrl: string;
    }[];
    createdAt: string;
    likeCount: string[];
  };
};

const PostCard = memo(({ data }: Props) => {
  const { navigate } = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();
  const userData: any = getUserStore();
  const commentBottomSheet = useRef<ActionSheetRef>(null);
  const { mutate: LikeUnlikeGroupPost, isPending: isLikeUnlikeGroupPending } =
    useLikeUnilikeGroupPost(
      data.communityId,
      data.communityGroupId,
      !!data?.communityId
    );
  const { mutate: LikeUnlikeTimelinePost, isPending: isLikeUnlikePending } =
    useLikeUnlikeTimelinePost();
  const sharePost = async () => {
    try {
      const result = await Share.share({
        message:
          "Hey, check out this amazing post! https://example.com/post/123",
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type:", result.activityType);
        } else {
          console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const LikeUnlikeHandler = (postId: string) => {
    if (!data?.communityId) {
      LikeUnlikeTimelinePost(postId);
    } else if (data?.communityId) {
      LikeUnlikeGroupPost(postId);
    }
  };

  return (
    <View className=" bg-white  flex gap-4 mt-10">
      <PostCardUserDetails
        name={data?.user?.firstName + " " + data?.user?.lastName}
        year={data?.userProfile?.study_year}
        degree={data?.userProfile?.degree}
        major={data?.userProfile?.major}
        dp={data?.userProfile?.profile_dp?.imageUrl || " "}
        postId={data._id}
        type={data?.communityId ? PostType.Community : PostType.Timeline}
        isAdmin={data.user?._id == userData?._j?.id}
      />

      <ImageGridLayout imagesData={data?.imageUrl || []} />

      {data?.content && (
        <View className=" py-2 px-4">
          <RenderHtml
            contentWidth={width}
            source={{ html: data?.content }}
            tagsStyles={{ body: { color: "black" } }}
            ignoredDomTags={["label", "input"]}
          />
        </View>
      )}

      <View className="py-2 px-4">
        <Text>
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
            <ThumbsUp
              color={
                data?.likeCount?.some(
                  (like: any) => like.userId == userData?._j?.id
                )
                  ? "#6647FF"
                  : "black"
              }
              height={24}
              width={24}
            />
            <Text>{data?.likeCount?.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => commentBottomSheet.current?.show()}
            className="flex flex-row gap-2 items-center"
          >
            <ChatBubbleEmpty height={24} width={24} />
            <Text>{data?.commentCount}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={sharePost}
          className="flex flex-row gap-2 items-center"
        >
          <ShareAndroid height={24} width={24} />
        </TouchableOpacity>
      </View>

      <ActionSheet
        ref={commentBottomSheet}
        gestureEnabled={true}
        // snapPoints={[40, 100]}
        drawUnderStatusBar
        containerStyle={{
          height: "100%",
        }}
      >
        <CommentBottomSheet
          postId={data?._id}
          type={data?.communityId ? PostType.Community : PostType.Timeline}
          width={width}
          adminID={data?.user?._id}
        />
      </ActionSheet>
    </View>
  );
});

export default PostCard;
