import React from "react";
import { User, ChatBubble, ThumbsUp, Community } from "iconoir-react-native";
import { notificationRoleAccess } from "@/types/notifications";

type NotificationIconProps = {
  type: string;
};

export const NotificationIcon = ({ type }: NotificationIconProps) => {
  const iconProps = { width: 24, height: 24, color: "#9685FF" };

  switch (type) {
    case notificationRoleAccess.FOLLOW:
      return <User {...iconProps} />;

    case notificationRoleAccess.GROUP_INVITE:
    case notificationRoleAccess.PRIVATE_GROUP_REQUEST:
    case notificationRoleAccess.OFFICIAL_GROUP_REQUEST:
    case notificationRoleAccess.REJECTED_OFFICIAL_GROUP_REQUEST:
    case notificationRoleAccess.ACCEPTED_OFFICIAL_GROUP_REQUEST:
    case notificationRoleAccess.ACCEPTED_PRIVATE_GROUP_REQUEST:
    case notificationRoleAccess.REJECTED_PRIVATE_GROUP_REQUEST:
    case notificationRoleAccess.community_post_live_request_notification:
    case notificationRoleAccess.community_post_accepted_notification:
    case notificationRoleAccess.DELETED_COMMUNITY_GROUP:
    case notificationRoleAccess.community_post_rejected_notification:
      return <Community {...iconProps} />;

    case notificationRoleAccess.COMMENT:
    case notificationRoleAccess.COMMUNITY_COMMENT:
    case notificationRoleAccess.REPLIED_TO_COMMENT:
    case notificationRoleAccess.REPLIED_TO_COMMUNITY_COMMENT:
      return <ChatBubble {...iconProps} />;

    case notificationRoleAccess.REACTED_TO_POST:
    case notificationRoleAccess.REACTED_TO_COMMUNITY_POST:
      return <ThumbsUp {...iconProps} />;

    default:
      return null;
  }
};
