export interface UserMainNotification {
  _id: string;
  createdAt: string;
  isRead: boolean;
  message: string;
  receiverId: string;
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
}

export type UserMainNotificationsProps = {
  notifications: UserMainNotification[];
  currentPage: number;
  totalPages: number;
  totalNotifications: number;
};
