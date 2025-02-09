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
