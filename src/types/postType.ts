export enum PostType {
  Community = "Community",
  Timeline = "Timeline",
  Profile = "Profile",
}
export enum UserPostType {
  PUBLIC = "PUBLIC",
  FOLLOWER_ONLY = "FOLLOWER_ONLY",
  MUTUAL = "MUTUAL",
  ONLY_ME = "ONLY_ME",
}

export type PostCardType = {
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

export type CommentsProp = {
  item: {
    _id: string;
    replies: CommentsProp[];
    likeCount: string[];
    level: number;
    commenterId: {
      firstName: string;
      lastName: string;
      _id: string;
    };
    commenterProfileId: {
      profile_dp: {
        imageUrl: string;
      };

      university_name: string;
      study_year: string;
      degree: string;
      major: string;
    };
    content: string;
    createdAt: string;
    totalCount: string;
    imageUrl: any;
  };
  width: any;
  setShowReply?: any;
  showReply?: any;
  setReplyingTo: (value: any) => void;
  likePostCommentHandler: (value: string) => void;
  setShowTotalReply: (value: number) => void;
  showTotalReply: number;
  handleNavigate?: any;
};
