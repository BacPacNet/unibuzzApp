import { AxiosError } from "axios";

export interface FollowingItemProps {
  _id: any;
  users_id: {
    firstName: string;
    lastName: string;
    id: string;
  };

  university: string;
  study_year: string;
  degree: string;
  major: string;
  occupation: string;
  profile_dp: {
    imageUrl: string;
  };
  type: string;
  userFollowingIDs: string[];
}

export interface FindUsers {
  firstName: string;
  lastName: string;
  _id: string;
  profile: {
    university: string;
    study_year: string;
    degree: string;
    major: string;
    occupation: string;
    profile_dp: {
      imageUrl: string;
    };
  };

  type: string;
  userFollowingIDs: string[];
}

export interface notificationInterface {
  _id: string;
  sender_id: {
    firstName: string;
  };
  receiverId: string;
  communityGroupId: {
    _id: string;
    title: string;
  };
  communityPostId: {
    _id: string;
  };
  userPostId: {
    _id: string;
    title: string;
  };
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export enum PostInputType {
  Community = "Community",
  Timeline = "Timeline",
}

export enum PostType {
  Community = "Community",
  Timeline = "Timeline",
  Profile = "Profile",
}
export enum CommunityPostType {
  PUBLIC = "PUBLIC",
  FOLLOWER_ONLY = "FOLLOWER_ONLY",
}

export enum UserPostType {
  PUBLIC = "PUBLIC",
  FOLLOWER_ONLY = "FOLLOWER_ONLY",
  MUTUAL = "MUTUAL",
  ONLY_ME = "ONLY_ME",
}

export interface PostInputData {
  content: string;
  imageUrl?: Array<{
    imageUrl: string | null;
    publicId: string | null;
  }>;
  PostType?: string;
  communityPostsType?: string;
}

export interface UserPostData extends PostInputData {}

export interface CommunityPostData extends PostInputData {
  communityId?: string | number;
}

export interface PostCommentData {
  postID?: string | undefined;
  content: string;
  imageUrl?: {
    imageUrl: string;
    publicId: string;
  };
  adminId?: string | number;
  commentId?: string | undefined;
  commenterProfileId: string;
}

interface ErrorResponse {
  message: string;
  // Add any other properties your API returns in errors
}

export type AxiosErrorType = AxiosError<ErrorResponse>;

export enum singlePostEnum {
  userPost = "userPost",
  CommunityPost = "CommunityPost",
}

export enum SocketEnums {
  SEND_MESSAGE = "new message",
  RECEIVED_MESSAGE = "message received",
  REACTED_MESSAGE = "reactedToMessage",
  REACTED_SEND_MESSAGE = "reaction received",
}

export enum SocketConnectionEnums {
  SETUP = "setup",
  CONNECTED = "connected",
  REQUESTONLINEUSERS = "requestOnlineUsers",
  ONLINEUSERS = "onlineUsers",
  ONLINEUSERS2 = "onlineUsers2",
  DISCONNECT = "disconnect",
  USER_DISCONNECT = "user-disconnected",
}

//chats types
type ChatUser = {
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    degree: string;
    profileDp: string;
    studyYear: string;
    universityName: string;
  };
  _id: string;
  firstName: string;
  lastName: string;
  ProfileDp: string | null;
  isOnline: boolean;
  isRequestAccepted: boolean;
  isStarred: boolean;
};

type GroupLogo = {
  imageUrl: string;
  publicId: string;
};

type media = {
  imageUrl: string;
  publicId: string;
};

export type Message = {
  chat: string;
  content: string;
  createdAt: string;
  media: media[];
  readByUsers: string[];
  sender: {
    firstName: string;
    id: string;
    lastName: string;
  };
  senderProfile: {
    profile_dp: media;
    _id: string;
  };
  updatedAt: string;
  _id: string;
  __v: number;
  reactions: {
    userId: string;
    emoji: string;
  }[];
};

export type messages = Message[];

export type LatestMessage = {
  chat: string;
  content: string;
  createdAt: string;
  media: media[];
  readByUsers: string[];
  sender: string;
  senderProfile: string;
  updatedAt: string;
  _id: string;
  __v: number;
};

export type Chat = {
  chatName: string;
  createdAt: string;
  groupAdmin: string;
  groupDescription: string;
  groupLogo: GroupLogo;
  groupLogoImage: string | undefined;
  latestMessage: LatestMessage;
  isBlock: boolean;
  isGroupChat: boolean;
  isRequestAccepted: boolean;
  unreadMessagesCount: number;
  updatedAt: string;
  users: ChatUser[];
  _id: string;
  __v: number;
};

export type ChatsArray = Chat[];
