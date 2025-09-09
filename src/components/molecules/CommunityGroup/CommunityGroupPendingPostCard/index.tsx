import React, { memo, useCallback, useMemo, useRef, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { PostCardType, PostType } from "@/types/postType";

import ImageGridLayout from "../../ImageGridLayout";
import {
  communityPostStatus,
  communityPostUpdateStatus,
} from "@/types/CommunityGroup";
import { getUserStore } from "@/storage/user";
import PostCardUserDetails from "../../Timeline/PostCardUserDetails";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import { useCreateGroupPostStatusChange } from "@/services/communityPost";
import PendingPostCardOption from "../CommunityGroupPendingPostCardOptions";

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

interface PendingPostCardType extends PostCardType {
  communityGroupAdminId: string;
  postStatus: string;
}

const PendingPostCard = ({
  source,
  data,
  isTimeline = true,
  communityGroupId = "",
  isSinglePost = false,
  initialComment,
  toShowInitial = false,
  isProfile = false,
  communityGroupAdminId,
  postStatus,
}: PendingPostCardType) => {
  const userData = getUserStore();
  const { mutate } = useCreateGroupPostStatusChange(data._id);
  const navigation = useNavigation<ScreenNavigationProp>();

  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const { width } = useWindowDimensions();

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

  const handleProfileClicked = useCallback(
    (adminId: string) => {
      navigation.navigate("Profile", { id: adminId });
    },
    [navigation]
  );

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const borderColorStyle = useMemo(() => {
    if (communityGroupAdminId.toString() === userData?.id?.toString()) {
      return styles.noBorder;
    }
    if (postStatus === communityPostStatus.REJECTED) {
      return styles.borderRed;
    }
    return styles.borderYellow;
  }, [postStatus, communityGroupAdminId]);

  const updatePostStatus = (status: communityPostUpdateStatus) => {
    mutate(status);
  };

  return (
    <View style={[styles.card, borderColorStyle]}>
      <View style={styles.content}>
        {/* User Header */}
        <PostCardUserDetails
          name={data?.user?.firstName + " " + data?.user?.lastName}
          year={
            isSinglePost
              ? data?.profile?.study_year || data?.userProfile?.study_year
              : data?.userProfile?.study_year || data?.profile?.study_year
          }
          major={
            isSinglePost
              ? data?.profile?.major || data?.userProfile?.major
              : data?.userProfile?.major || data?.profile?.major
          }
          degree={data?.userProfile?.degree || data?.profile?.degree}
          university={
            data?.userProfile?.university_name || data?.profile?.university_name
          }
          affiliation={
            isSinglePost
              ? data?.profile?.affiliation || data?.userProfile?.affiliation
              : data?.userProfile?.affiliation || data?.profile?.affiliation
          }
          occupation={
            isSinglePost
              ? data?.profile?.occupation || data?.userProfile?.occupation
              : data?.userProfile?.occupation || data?.profile?.occupation
          }
          role={data?.userProfile?.role || data?.profile?.role}
          communityName={
            isSinglePost ? data?.communityName : data?.community?.name
          }
          communityGroupName={
            isSinglePost ? data?.communityGroupName : data?.communityGroupName
          }
          dp={
            data?.userProfile?.profile_dp?.imageUrl ||
            data?.profile?.profile_dp?.imageUrl ||
            " "
          }
          postId={data?._id}
          type={resolvedPostType}
          isAdmin={
            isSinglePost
              ? data?.user_id == userData?.id
              : data?.user?._id == userData?.id
          }
          postAdminId={data?.user?._id}
          handleDeletePost={() => console.log("no")}
          isPostVerified={data.isPostVerified}
          isCommunityAdmin={data?.userProfile?.isCommunityAdmin}
          isPostOptionShown={false}
        />

        {/* Post Text */}
        {Number(data?.content?.length) > 1 && data?.content ? (
          <View className="px-4">
            <RenderHTML
              contentWidth={width}
              source={{ html: data?.content }}
              tagsStyles={{
                body: {
                  margin: 0,
                  padding: 0,
                  color: "#3A3B3C",
                },
                p: {
                  margin: 0,
                  padding: 0,
                  fontSize: 14,
                },
                div: {
                  margin: 0,
                  padding: 0,
                },
              }}
              ignoredDomTags={["label", "input"]}
            />
          </View>
        ) : (
          <View></View>
        )}

        {/* Images */}
        {data?.imageUrl?.length > 0 ? (
          <View style={{ flex: 1 }}>
            <ImageGridLayout imagesData={data?.imageUrl || []} />
          </View>
        ) : null}

        {/* Moderation Options */}
        {communityGroupAdminId.toString() === userData?.id?.toString() ? (
          <PendingPostCardOption
            variant="review"
            title="Admin Review Required: This post is awaiting moderation approval."
            text="Once you take action, the author will be notified of the decision."
            acceptLabel="Accept"
            rejectLabel="Reject"
            onAccept={() => updatePostStatus(communityPostUpdateStatus.LIVE)}
            onReject={() =>
              updatePostStatus(communityPostUpdateStatus.REJECTED)
            }
          />
        ) : postStatus === communityPostStatus.PENDING ? (
          <PendingPostCardOption
            variant="pending"
            text="This post is awaiting approval from the community admin. It will be visible to other members once approved."
          />
        ) : (
          <PendingPostCardOption
            variant="rejected"
            text="Post has been rejected and will not be visible to other group members."
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 8,
    // paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderLeftWidth: 4,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  content: {
    // paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "column",
    gap: 12,
  },
  postText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  borderYellow: {
    borderLeftColor: "#facc15",
  },
  borderRed: {
    borderLeftColor: "#ef4444",
  },
  noBorder: {
    borderLeftColor: "transparent",
  },
});

export default memo(PendingPostCard);
