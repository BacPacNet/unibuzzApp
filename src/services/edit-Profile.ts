import {
  getUserProfileStore,
  storeUser,
  storeUserProfile,
} from "@/storage/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toast } from "react-native-toast-notifications";
import { client } from "./api-client";
import { getToken } from "@/storage/token";

const editProfile = async (data: any, id: string, token: string) => {
  const res = await client(`/userprofile/${id}`, {
    method: "PUT",
    data,
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

export const useEditProfile = () => {
  const userProfileData = getUserProfileStore();
  const queryClient = useQueryClient();
  const cookieValue = getToken() as string;
  return useMutation({
    mutationFn: (data: any) =>
      editProfile(data, userProfileData?._id || "", cookieValue),
    onSuccess: async (response: any) => {
      console.log("response", response);

      storeUserProfile(response.data);
      Toast.show("Profile Updated");

      queryClient.invalidateQueries({ queryKey: ["getRefetchUserData"] });
    },
    onError: (res: any) => {
      Toast.show(res.response?.data.message || "Something went wrong");
    },
  });
};

const addUniversityEmail = async (data: any, token: string) => {
  const res = await client(`/userprofile/addUniversityEmail`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
  return res;
};

export const useAddUniversityEmail = (redirect: boolean = false) => {
  // const setUserProfileData = useUniStore((state) => state.setUserProfileData)
  // const { setUserData, setUserProfileData } = useUniStore()

  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => addUniversityEmail(data, cookieValue),
    onSuccess: (response: any, variables) => {
      storeUserProfile(response);
      Toast.show("University Verification Complete");
    },
    onError: (res: any) => {
      return Toast.show(res.response.data.message);
    },
  });
};
