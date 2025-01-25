import { storage } from "@/App";

export enum userTypeEnum {
  Student = "Student",
  Faculty = "Faculty",
  Applicant = "Applicant",
}

enum StorageKeys {
  REGISTER_DATA = "registerData",
}

export const storeRegisterData = async (data: any): Promise<void> => {
  try {
    storage.set(StorageKeys.REGISTER_DATA, JSON.stringify(data));
  } catch (error) {
    // Handle error
    console.error("Failed to save Register Data", error);
  }
};

// export const getRegisterData  = async () => {
//   try {
//     const jsonUser = storage.getString(StorageKeys.REGISTER_DATA) as string;
//     const userObject = JSON.parse(jsonUser);
//     return userObject;
//   } catch (error) {

//     console.error("Failed to retrieve Register Data", error);
//     return null;
//   }
// };

export const getRegisterData = async () => {
  try {
    const jsonRegisterData = storage.getString(StorageKeys.REGISTER_DATA);
    if (!jsonRegisterData) {
      console.warn(
        "No data found in storage for key:",
        StorageKeys.REGISTER_DATA,
      );
      return null;
    }

    const registerDataObject = JSON.parse(jsonRegisterData);
    return registerDataObject;
  } catch (error) {
    console.error("Failed to retrieve Register Data", error);
    return null;
  }
};

export const removeRegisterData = async () => {
  storage.delete(StorageKeys.REGISTER_DATA);
};
