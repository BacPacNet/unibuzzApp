import { storage } from "@/App";

enum StorageKeys {
  NOTIFICATION_TOKEN = "notificationToken",
}

export const storeNotificationToken = async (token: string): Promise<void> => {
  try {
    storage.set(StorageKeys.NOTIFICATION_TOKEN, JSON.stringify(token));
  } catch (error) {
    // Handle error
    console.error("Failed to save token", error);
  }
};

export const getNotificationToken = (): string | null => {
  try {
    const jsonToken = storage.getString(StorageKeys.NOTIFICATION_TOKEN);

    if (!jsonToken) {
      return null;
    }

    return JSON.parse(jsonToken);
  } catch (error) {
    console.error("Failed to retrieve notification token", error);
    return null;
  }
};
