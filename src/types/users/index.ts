export interface userProfileType {
  users_id: string | null;
  profile_dp?: { imageUrl: string; publicId: string };
  email: EmailType[];
  cover_dp?: { imageUrl: string; publicId: string };
  bio?: string;
  phone_number?: string;
  dob?: string;
  country?: string;
  city?: string;
  university_name?: string;
  university_id: string;
  study_year?: string;
  degree?: string;
  major?: string;
  affiliation?: string;
  occupation?: string;
  following: following[];
  followers: following[];
  totalFilled: number;
  _id: string;
}

interface following {
  userId: string;
}

export interface EmailType {
  UniversityName: string;
  UniversityEmail?: string;
  communityId?: string;
  _id: string;
}
