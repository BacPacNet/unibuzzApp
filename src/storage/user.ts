import { storage } from "@/App";
import { User } from "@/models/auth";
import { userProfileType } from "@/types/users";

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

export const removeUserStore = () => {
  storage.delete(StorageKeys.USER);
};

export const storeUserProfile = async (
  userProfile: userProfileType,
): Promise<void> => {
  try {
    storage.set(StorageKeys.USER_PROFILE, JSON.stringify(userProfile));
  } catch (error) {
    // Handle error
    console.error("Failed to save token", error);
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
