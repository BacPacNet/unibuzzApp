export interface ProfileConnection {
  totalPages: number;
  currentPage: number;
  users: Users[];
}

export interface Users {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: string;
  dob?: string | null;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  joinedCommunity?: null[] | null;
  profile?: Profile | null;
  userUnVerifiedCommunities?: (UserUnVerifiedCommunitiesEntity | null)[] | null;
  userVerifiedCommunities?: (UserVerifiedCommunitiesEntity | null)[] | null;
  userName?: string | null;
  isFollowing: boolean;
}
export interface Profile {
  _id: string;
  users_id: string;
  dob: string;
  __v: number;
  followers?: FollowersEntity[] | null;
  phone_number?: string | null;
  totalFilled?: number | null;
  email?: (EmailEntity | null)[] | null;
  profile_dp?: ProfileDpOrCoverDp | null;
  affiliation?: string | null;
  bio?: string | null;
  city?: string | null;
  country?: string | null;
  degree?: string | null;
  major?: string | null;
  occupation?: string | null;
  study_year?: string | null;
  following?: FollowersEntityOrFollowingEntity[] | null;
  university?: string | null;
  cover_dp?: ProfileDpOrCoverDp1 | null;
}
export interface FollowersEntity {
  userId: string;
  _id: string;
  isBlock?: boolean | null;
}
export interface EmailEntity {
  UniversityName: string;
  UniversityEmail?: string | null;
  _id: string;
}
export interface ProfileDpOrCoverDp {
  imageUrl: string;
  publicId: string;
}
export interface FollowersEntityOrFollowingEntity {
  userId: string;
  isBlock: boolean;
  _id: string;
}
export interface ProfileDpOrCoverDp1 {
  imageUrl: string;
  publicId: string;
}
export interface UserUnVerifiedCommunitiesEntity {
  communityId: string;
  _id: string;
  communityGroups?: null[] | null;
}
export interface UserVerifiedCommunitiesEntity {
  communityId: string;
  communityName?: string | null;
  _id?: string | null;
  communityGroups?: CommunityGroupsEntity[] | null;
}
export interface CommunityGroupsEntity {
  communityGroupName: string;
  communityGroupId: string;
  _id: string;
  role?: string | null;
}

export enum UserType {
  ALL = "ALL",
  MUTUALS = "MUTUALS",
  FOLLOWING = "FOLLOWING",
  FOLLOWERS = "FOLLOWERS",
}
