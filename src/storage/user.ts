import { storage } from "@/App";
import { User } from "@/models/auth";
import { UserCommunities, userProfileType } from "@/types/users";
import { userTypeEnum } from "./register";

enum StorageKeys {
  USER = "user",
  USER_PROFILE = "userProfile",
}

export const storeUser = async (user: any): Promise<void> => {
  try {
    storage.set(StorageKeys.USER, JSON.stringify(user));
  } catch (error) {
    // Handle error
    console.error("Failed to save token", error);
  }
};

export const getUserStore = (): User | null => {
  try {
    const jsonUser = storage.getString(StorageKeys.USER);

    if (!jsonUser) {
      return null;
    }

    return JSON.parse(jsonUser);
  } catch (error) {
    console.error("Failed to retrieve user data", error);
    return null;
  }
};

export const updateUserStoreUserName = async (
  firstName: string,
  lastName: string
) => {
  try {
    const rawUser = storage.getString(StorageKeys.USER);
    if (!rawUser) {
      console.warn("No existing user found in storage.");
      return;
    }
    const user: User = JSON.parse(rawUser);
    user.firstName = firstName;
    user.lastName = lastName;
    storage.set(StorageKeys.USER, JSON.stringify(user));
  } catch (error) {
    console.error("Failed to update user data", error);
  }
};

export const removeUserStore = () => {
  storage.delete(StorageKeys.USER);
};

export const storeUserProfile = async (
  userProfile: userProfileType
): Promise<void> => {
  try {
    storage.set(StorageKeys.USER_PROFILE, JSON.stringify(userProfile));
  } catch (error) {
    // Handle error
    console.error("Failed to save token", error);
  }
};

export const updateUserProfileCommunities = async (
  communities: UserCommunities[]
): Promise<void> => {
  try {
    const rawProfile = storage.getString(StorageKeys.USER_PROFILE);

    if (!rawProfile) {
      console.warn("No existing user profile found in storage.");
      return;
    }

    const profile: userProfileType = JSON.parse(rawProfile);

    const updatedProfile: userProfileType = {
      ...profile,
      communities: communities,
    };

    storage.set(StorageKeys.USER_PROFILE, JSON.stringify(updatedProfile));
  } catch (error) {
    console.error("Failed to update communities in user profile", error);
  }
};
export const updateUserProfileFollowing = async (
  followings: any
): Promise<void> => {
  try {
    const rawProfile = storage.getString(StorageKeys.USER_PROFILE);

    if (!rawProfile) {
      console.warn("No existing user profile found in storage.");
      return;
    }

    const profile: userProfileType = JSON.parse(rawProfile);

    const updatedProfile: userProfileType = {
      ...profile,
      following: followings,
    };

    storage.set(StorageKeys.USER_PROFILE, JSON.stringify(updatedProfile));
  } catch (error) {
    console.error("Failed to update following in user profile", error);
  }
};

export const updateUserProfileStoreUserUniversityPosition = ({
  role,
  study_year,
  major,
  affiliation,
  occupation,
}: {
  role: string;
  study_year: string;
  major: string;
  affiliation: string;
  occupation: string;
}) => {
  try {
    const rawProfile = storage.getString(StorageKeys.USER_PROFILE);
    const isStudent = role === userTypeEnum.Student;
    if (!rawProfile) {
      console.warn("No existing user profile found in storage.");
      return;
    }

    const profile: userProfileType = JSON.parse(rawProfile);

    if (
      isStudent &&
      (profile.study_year !== study_year || profile.major !== major)
    ) {
      profile.study_year = study_year;
      profile.major = major;
    } else if (
      !isStudent &&
      (profile.affiliation !== affiliation || profile.occupation !== occupation)
    ) {
      profile.affiliation = affiliation;
      profile.occupation = occupation;
    }
    storage.set(StorageKeys.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error("Failed to update user profile", error);
  }
};

// Function to retrieve a JWT token
export const getUserProfileStore = (): Partial<userProfileType> | null => {
  try {
    const jsonUser = storage.getString(StorageKeys.USER_PROFILE) as string;
    if (!jsonUser) {
      return null;
    }
    const userObject = JSON.parse(jsonUser);
    return userObject;
  } catch (error) {
    // Handle error
    console.error("Failed to retrieve token", error);
    return null;
  }
};

export const removeUserProfileStore = () => {
  storage.delete(StorageKeys.USER_PROFILE);
};
