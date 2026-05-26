import { storage } from "@/App";

enum StorageKeys {
  LOGIN_DATA = "loginData",
}

export type LoginDataStorage = {
  email: string;
  password: string;
};

export const storeLoginData = (data: LoginDataStorage): void => {
  try {
    storage.set(StorageKeys.LOGIN_DATA, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save login data", error);
  }
};

export const getLoginData = (): LoginDataStorage | null => {
  try {
    const json = storage.getString(StorageKeys.LOGIN_DATA);
    if (!json) return null;
    return JSON.parse(json);
  } catch (error) {
    console.error("Failed to retrieve login data", error);
    return null;
  }
};

export const removeLoginData = (): void => {
  storage.delete(StorageKeys.LOGIN_DATA);
};
