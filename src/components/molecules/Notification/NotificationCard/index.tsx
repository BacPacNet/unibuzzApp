import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import {
  notificationRoleAccess,
  notificationStatus,
} from "@/types/notifications";
import { NotificationMessage } from "../NotificationMessage";
import { timeAgo } from "@/utils";
import NotificationAvatars from "../NotificationAvatars";
import { NotificationActions } from "../NotificationActions";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "@/constant/screenName";

interface likedBy {
  totalCount: number;
  newFiveUsers: any[];
}

interface CommentedUser {
  _id: string;
  communityPostCommentId?: string;
  postCommentId?: string;
}

interface CommentedBy {
  totalCount: number;
  newFiveUsers: CommentedUser[];
}

type Props = {
  data: {
    _id: string;
    createdAt: string;
    isRead: boolean;
    message: string;
    receiverId: string;
    userPostId?: string;
    status: notificationStatus;
    sender_id: {
      _id: string;
      firstName: string;
      lastName: string;
      profileDp?: string;
    };
    communityGroupId?: {
      _id: string;
      title: string;
      communityId: string;
      communityGroupLogoUrl: string;
    };
    communityDetails?: {
      name: string;
    };
    communityPostId?: {
      _id?: string;
    };
    userPost: {
      likeCount: number;
      totalComments: number;
    };
    communityPost: {
      likeCount: number;
      totalComments: number;
    };
    type: string;
    likedBy: likedBy;
    commentedBy: CommentedBy;
    repliedBy: CommentedBy;
    parentCommentReplies: any;
    communityParentCommentReplies: any;
  };
};

type NavigationProp = StackNavigationProp<RootStackParamList, "Notifications">;

const NotificationCard = ({ data }: Props) => {
  const navigation = useNavigation<NavigationProp>();
  const handleUpdateIsRead = async (e: any, id: string) => {
    e.stopPropagation?.();

    switch (data?.type) {
      case notificationRoleAccess.FOLLOW:
        return navigation.navigate("ProfileStack", {
          screen: "Profile",
          params: {
            userId: data.sender_id?._id,
            from: screenName.notifications,
          },
        });
      case notificationRoleAccess.COMMENT:
        return navigation.navigate("SinglePost", {
          postID: data.userPostId,
          type: "Timeline",
          commentId: data?.commentedBy.newFiveUsers[0].postCommentId,
          from: screenName.notifications,
        });
      case notificationRoleAccess.REPLIED_TO_COMMENT:
        return navigation.navigate("SinglePost", {
          postID: data.userPostId,
          type: "Timeline",
          commentId: data?.parentCommentReplies[0].parentId,
          isReply: true,
          from: screenName.notifications,
        });
      case notificationRoleAccess.COMMUNITY_COMMENT:
        return navigation.navigate("SinglePost", {
          postID: data.communityPostId,
          type: "Community",
          commentId: data?.commentedBy.newFiveUsers[0].communityPostCommentId,
          from: screenName.notifications,
        });
      case notificationRoleAccess.REPLIED_TO_COMMUNITY_COMMENT:
        return navigation.navigate("SinglePost", {
          postID: data.communityPostId,
          type: "Community",
          commentId: data?.communityParentCommentReplies[0].parentId,
          isReply: true,
          from: screenName.notifications,
        });
      case notificationRoleAccess.REACTED_TO_POST:
        return navigation.navigate("SinglePost", {
          postID: data.userPostId,
          type: "Timeline",
          from: screenName.notifications,
        });
      case notificationRoleAccess.REACTED_TO_COMMUNITY_POST:
        return navigation.navigate("SinglePost", {
          postID: data.communityPostId,
          type: "Community",
          from: screenName.notifications,
        });
      case notificationRoleAccess.community_post_live_request_notification:
        return navigation.navigate("CommunityGroup", {
          communityId: data.communityGroupId?.communityId,
          communityGroupId: data.communityGroupId?._id,
          from: screenName.notifications,
          filterPostBy: "pendingPosts",
        });

      case notificationRoleAccess.OFFICIAL_GROUP_REQUEST:
        if (data?.status === notificationStatus.rejected) {
          return;
        }
        return navigation.navigate("CommunityGroup", {
          communityId: data.communityGroupId?.communityId,
          communityGroupId: data.communityGroupId?._id,
          from: screenName.notifications,
        });

      case notificationRoleAccess.REJECTED_OFFICIAL_GROUP_REQUEST:
        return;

      case notificationRoleAccess.PRIVATE_GROUP_REQUEST:
      case notificationRoleAccess.ACCEPTED_OFFICIAL_GROUP_REQUEST:
      case notificationRoleAccess.ACCEPTED_PRIVATE_GROUP_REQUEST:
      case notificationRoleAccess.OFFICIAL_GROUP_REQUEST:
      case notificationRoleAccess.GROUP_INVITE:
      case notificationRoleAccess.REJECTED_PRIVATE_GROUP_REQUEST:
      case notificationRoleAccess.community_post_accepted_notification:
      case notificationRoleAccess.community_post_rejected_notification:
        return navigation.navigate("CommunityGroup", {
          communityId: data.communityGroupId?.communityId,
          communityGroupId: data.communityGroupId?._id,
          from: screenName.notifications,
        });
      default:
        break;
    }
  };

  const handleRedirectCommunityComment = (user: any) => {
    return navigation.navigate("SinglePost", {
      postID: data.communityPostId,
      type: "Community",
      commentId: user?.communityPostCommentId,
      from: screenName.notifications,
    });
  };

  const handleRedirectPostComment = (user: any) => {
    return navigation.navigate("SinglePost", {
      postID: data.userPostId,
      type: "Timeline",
      commentId: user?.postCommentId,
      from: screenName.notifications,
    });
  };

  return (
    <TouchableOpacity
      onPress={(e) => handleUpdateIsRead(e, data._id)}
      style={[styles.container, data.isRead ? styles.read : styles.unread]}
    >
      <View style={styles.header}>
        <NotificationAvatars
          handleRedirectCommunityComment={handleRedirectCommunityComment}
          handleRedirectPostComment={handleRedirectPostComment}
          data={data}
          notificationType={data?.type}
        />
        {data?.createdAt?.length && (
          <Text style={styles.time}>{timeAgo(data?.createdAt)}</Text>
        )}
      </View>

      <View style={styles.body}>
        <NotificationMessage data={data} />

        <NotificationActions data={data} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  read: {
    backgroundColor: "#FFFFFF",
  },
  unread: {
    backgroundColor: "#F3F2FF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    marginRight: 16,
  },
  time: {
    fontSize: 10,
    color: "#6B7280",
  },
  body: {
    marginTop: 12,
    gap: 12,
  },
});

export default NotificationCard;
