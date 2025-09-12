type Notification = {
  _id: string;
  sender_id: {
    _id: string;
    firstName: string;
    lastName: string;
    profileDp?: string;
  };
  receiverId: string;
  communityGroupId?: string;
  communityPostId?: string;
  userPostId?: string;
  message: string;
  type: "GROUP_INVITE" | "FOLLOW";
  isRead: boolean;
  createdAt: string;
};

type NotificationsProps = {
  notifications: Notification[];
  currentPage: number;
  totalPages: number;
  totalNotifications: number;
};

type User = {
  _id: string;
  firstName: string;
  lastName: string;
};

type ChatUser = {
  userId: User;
  isRequestAccepted: boolean;
};

type LatestMessage = {
  content: string;
  media: string[];
  createdAt: string;
};

export type MessageNotification = {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  groupLogoImage?: string;
  users: ChatUser[];
  latestMessage: LatestMessage;
};

export type MessageNotificationsProps = {
  message: MessageNotification[];
  currentPage: number;
  totalPages: number;
  totalNotifications: number;
};

export enum notificationStatus {
  pending = "pending",
  rejected = "rejected",
  accepted = "accepted",
  default = "default",
}

interface likedBy {
  totalCount: number;
  newFiveUsers: any[];
}

export interface UserMainNotification {
  _id: string;
  createdAt: string;
  isRead: boolean;
  message: string;
  receiverId: string;
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
  type: string;
  likedBy: likedBy;
  commentedBy: likedBy;
}

export type UserMainNotificationsProps = {
  notifications: UserMainNotification[];
  currentPage: number;
  totalPages: number;
  totalNotifications: number;
};

export const notificationRoleAccess = {
  GROUP_INVITE: "GROUP_INVITE",
  FOLLOW: "FOLLOW",
  COMMENT: "COMMENT",
  COMMUNITY_COMMENT: "COMMUNITY_COMMENT",
  REACTED_TO_POST: "REACTED_TO_POST",
  REACTED_TO_COMMUNITY_POST: "REACTED_TO_COMMUNITY_POST",

  OFFICIAL_GROUP_REQUEST: "OFFICIAL_GROUP_REQUEST",
  PRIVATE_GROUP_REQUEST: "PRIVATE_GROUP_REQUEST",
  REJECTED_OFFICIAL_GROUP_REQUEST: "REJECTED_OFFICIAL_GROUP_REQUEST",
  ACCEPTED_OFFICIAL_GROUP_REQUEST: "ACCEPTED_OFFICIAL_GROUP_REQUEST",
  ACCEPTED_PRIVATE_GROUP_REQUEST: "ACCEPTED_PRIVATE_GROUP_REQUEST",
  REJECTED_PRIVATE_GROUP_REQUEST: "REJECTED_PRIVATE_GROUP_REQUEST",
  DELETED_COMMUNITY_GROUP: "DELETED_COMMUNITY_GROUP",

  MESSAGE_NOTIFICATION: "MESSAGE_NOTIFICATION",

  community_post_live_request_notification:
    "community_post_live_request_notification",
  community_post_accepted_notification: "community_post_accepted_notification",
  community_post_rejected_notification: "community_post_rejected_notification",
};
