import { ProfileStackParamList } from "@/navigators/ProfileStack";
import { RouteProp } from "@react-navigation/native";

export interface ProfileRouteParams {
  userId: string;
  from?: string;
  chatId?: string;
}

export interface ProfileProps {
  route: RouteProp<ProfileStackParamList, "Profile">;
}

export interface ProfileData {
  bio?: string;
  university_name?: string;
  universityLogo?: string;
  followers?: number;
  following?: number;
  study_year?: string;
  major?: string;
  degree?: string;
  phone_number?: string;
  country?: string;
  dob?: string;
  city?: string;
  affiliation?: string;
  occupation?: string;
  role?: string;
  display_email?: string;
}

export interface UserProfileData {
  profile?: ProfileData;
  firstName?: string;
  lastName?: string;
  university_id?: string;
  university?: string;
}
