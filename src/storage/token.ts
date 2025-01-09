import { storage } from "@/App";

enum StorageKeys {
  JWT_TOKEN = "jwt_token",
}

// Function to store a JWT token
export const storeToken = async (token: string): Promise<void> => {
  try {
    storage.set(StorageKeys.JWT_TOKEN, token);
  } catch (error) {
    // Handle error
    console.error("Failed to save token", error);
  }
};

// Function to retrieve a JWT token
export const getToken = (): string | null => {
  try {
    const token = storage.getString(StorageKeys.JWT_TOKEN);
    return token !== undefined ? token : null;
  } catch (error) {
    // Handle error
    console.error("Failed to retrieve token", error);
    return null;
  }
};

// Function to delete a JWT token
export const deleteToken = async (): Promise<void> => {
  try {
    storage.delete(StorageKeys.JWT_TOKEN);
  } catch (error) {
    // Handle error
    console.error("Failed to delete token", error);
  }
};
