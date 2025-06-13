export interface editProfileInputs {
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  users_id: string;
  profile_dp?: string;
  display_email?: string;
  cover_dp?: string;
  bio?: string;
  gender: string;
  phone_number?: string;
  dob?: string;
  country?: string;
  city?: string;
  university_name?: string;
  study_year?: string;
  degree?: string;
  major?: string;
  affiliation?: string;
  occupation?: string;
  totalFilled: number;
  _id: string;
}

export const GenderOptions = ["Male", "Female"];

export const userType = ["Student", "Faculty", "Applicant"];
