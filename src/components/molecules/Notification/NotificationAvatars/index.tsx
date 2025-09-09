import React from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
} from "react-native";
import dummy from "@/assets/avatar.png";
import { notificationRoleAccess } from "@/types/notifications";
import { NotificationIcon } from "../NotificationIcons";
// import { NotificationIcon } from '../NotificationIcon'

interface User {
  id?: string;
  profileDp?: string;
}

interface LikedBy {
  totalCount: number;
  newFiveUsers: User[];
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
    type: string;
    likedBy: LikedBy;
    commentedBy: CommentedBy;
  };

  notificationType: string;
  handleRedirectPostComment: (value: any) => void;
  handleRedirectCommunityComment: (value: any) => void;
};

const NotificationAvatars = ({
  data,
  notificationType,
  handleRedirectPostComment,
  handleRedirectCommunityComment,
}: Props) => {
  const handlePostRedirect = (user: any) => {
    handleRedirectPostComment(user);
  };

  const handleCommunityPostRedirect = (user: any) => {
    handleRedirectCommunityComment(user);
  };

  const renderUsers = (users: any[] = []) =>
    users?.map((user, index) => (
      <TouchableOpacity
        key={user?.id || user?.profileDp || index}
        onPress={() => handlePostRedirect(user)}
        style={[
          styles.avatarContainer,
          { marginLeft: index === 0 ? 0 : -12, zIndex: users.length - index },
        ]}
      >
        <Image
          source={user?.profileDp ? { uri: user.profileDp } : dummy}
          style={styles.avatar}
        />
      </TouchableOpacity>
    ));

  const renderCommunityUsers = (users: any[] = []) =>
    users?.map((user, index) => (
      <TouchableOpacity
        key={user?._id || index}
        onPress={() => handleCommunityPostRedirect(user)}
        style={[
          styles.avatarContainer,
          { marginLeft: index === 0 ? 0 : -12, zIndex: users.length - index },
        ]}
      >
        <Image
          source={user?.profileDp ? { uri: user.profileDp } : dummy}
          style={styles.avatar}
        />
      </TouchableOpacity>
    ));

  const renderContent = () => {
    if (
      notificationType === notificationRoleAccess.REACTED_TO_POST ||
      notificationType === notificationRoleAccess.REACTED_TO_COMMUNITY_POST
    ) {
      return renderUsers(data?.likedBy?.newFiveUsers);
    } else if (notificationType === notificationRoleAccess.COMMENT) {
      return renderUsers(data?.commentedBy?.newFiveUsers);
    } else if (notificationType === notificationRoleAccess.COMMUNITY_COMMENT) {
      return renderCommunityUsers(data?.commentedBy?.newFiveUsers);
    } else if (
      notificationType ===
        notificationRoleAccess.ACCEPTED_PRIVATE_GROUP_REQUEST ||
      notificationType ===
        notificationRoleAccess.REJECTED_OFFICIAL_GROUP_REQUEST ||
      notificationType ===
        notificationRoleAccess.ACCEPTED_OFFICIAL_GROUP_REQUEST ||
      notificationType === notificationRoleAccess.OFFICIAL_GROUP_REQUEST ||
      notificationType ==
        notificationRoleAccess.community_post_live_request_notification
    ) {
      return (
        <Image
          source={
            data?.communityGroupId?.communityGroupLogoUrl
              ? { uri: data.communityGroupId.communityGroupLogoUrl }
              : dummy
          }
          style={styles.singleAvatar}
        />
      );
    } else {
      return (
        <Image
          source={
            data?.sender_id?.profileDp
              ? { uri: data.sender_id.profileDp }
              : dummy
          }
          style={styles.singleAvatar}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.iconWrapper}>
          <NotificationIcon type={data?.type} />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.avatarsRow}
        >
          {renderContent()}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    marginRight: 16,
  },
  avatarsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 24,
    overflow: "hidden",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 24,
    resizeMode: "cover",
  },
  singleAvatar: {
    width: 32,
    height: 32,
    borderRadius: 24,
    resizeMode: "cover",
  },
});

export default NotificationAvatars;
