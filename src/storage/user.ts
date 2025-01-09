import { storage } from "@/App";

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

export const getUserStore = async (): Promise<string | null> => {
  try {
    const jsonUser = storage.getString(StorageKeys.USER) as string;
    const userObject = JSON.parse(jsonUser);
    return userObject;
  } catch (error) {
    // Handle error
    console.error("Failed to retrieve token", error);
    return null;
  }
};

export const removeUserStore = () => {
  storage.delete(StorageKeys.USER);
};

export const storeUserProfile = async (userProfile: any): Promise<void> => {
  try {
    storage.set(StorageKeys.USER_PROFILE, JSON.stringify(userProfile));
  } catch (error) {
    // Handle error
    console.error("Failed to save token", error);
  }
};

// Function to retrieve a JWT token
export const getUserProfileStore = (): string | null => {
  try {
    const jsonUser = storage.getString(StorageKeys.USER_PROFILE) as string;
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
