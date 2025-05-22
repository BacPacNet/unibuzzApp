export interface Community {
  _id: string;
  communityCoverUrl: { imageUrl: string; publicId: string };
  communityLogoUrl: { imageUrl: string; publicId: string };
  name: string;
  adminId: string;
  university_id: string;
  numberOfStudent: number;
  numberOfFaculty: number;
  about: string;
  users: CommunityUsers[];
  isVerified?: boolean;
  assistantId: string;
  communityGroups: CommunityGroup[];
}

export interface CommunityUsers {
  id?: string;
  userId?: string;
  isRequestAccepted: boolean;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  universityName: string;
  year: string;
  degree: string;
  major: string;
  occupation: string;
  affiliation: string;
  role: string;
}

export interface CommunityGroup {
  _id: string;
  adminUserId: string;
  communityId: string;
  communityGroupLogoUrl: {
    imageUrl: string;
    publicId?: string;
  };
  communityGroupLogoCoverUrl: {
    imageUrl: string;
    publicId?: string;
  };
  title: string;
  memberCount: number;
  communityGroupType: string;
  about: string;
  users: CommunityUsers[];
}

export interface communityPostType {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    _id: string;
  };
  userProfile: {
    university_name: string;
    study_year: string;
    degree: string;
    profile_dp: {
      imageUrl: string;
    };
  };
  content: string;
  createdAt: string;
  likeCount: [];
  comments: [];
  imageUrl: [];
  commentCount: number;
  communityId?: string;
}
