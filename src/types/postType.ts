import { ContentType } from "./report-content";

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
  filterPostBy?: string;
  source?: string;
  data: {
    isPostVerified?: boolean;

    user: {
      firstName: string;
      lastName: string;
      _id: string;
    };
    user_id: string;
    _id: string;
    university: string;
    // adminId: string;
    year: string;
    text: string;
    link?: string;
    date: string;
    avatarLink: string;
    communityGroupId?: any;
    communityId?: any;
    community: any;
    commentCount: number;
    content?: string;
    level: string;
    userProfile: {
      isCommunityAdmin?: boolean;
      university_name: string;
      study_year: string;
      degree: string;
      major: string;
      affiliation: string;
      occupation: string;
      role: string;
      profile_dp: {
        imageUrl: string;
      };
      communities: {
        _id: string;
        name: string;
        logo: string;
        isVerifiedMember: boolean;
        isCommunityAdmin: boolean;
      }[];
    };

    profile: {
      university_name: string;
      study_year: string;
      degree: string;
      major: string;
      affiliation: string;
      occupation: string;
      role: string;
      profile_dp: {
        imageUrl: string;
      };
      communities: {
        _id: string;
        name: string;
        logo: string;
        isVerifiedMember: boolean;
        isCommunityAdmin: boolean;
      }[];
    };

    imageUrl: {
      imageUrl: string;
    }[];
    createdAt: string;
    likeCount: string[];
    communityName: string;
    communityGroupName: string;
  };
  isTimeline: boolean;
  communityGroupId?: string;
  isSinglePost: boolean;
  initialComment?: any;
  toShowInitial?: boolean;
  isProfile?: boolean;
  isReply?: boolean;
  commentId?: string;
};

export type CommentsProp = {
  postId: string;
  postContentType: ContentType;
  communities: {
    _id: string;
    name: string;
    logo: string;
    isVerifiedMember: boolean;
    isCommunityAdmin: boolean;
  }[];
  item: {
    _id: string;
    replies: CommentsProp[];
    likeCount: string[];
    level: number;
    commenterId: {
      firstName: string;
      lastName: string;
      _id: string;
      id: string;
    };
    commenterProfileId: {
      profile_dp: {
        imageUrl: string;
      };

      university_name: string;
      study_year: string;
      degree: string;
      major: string;
      role: string;
      occupation: string;
      affiliation: string;
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
  likePostCommentHandler: (
    value: string,
    value2: string,
    isSelfLike: boolean
  ) => void;
  setShowTotalReply: (value: number) => void;
  setModalVisible?: (value: boolean) => void;
  showTotalReply: number;
  handleNavigate?: any;
  type: PostType;
  showBorder?: boolean;
  commentId?: string;
  parentCommentId?: string;
};
