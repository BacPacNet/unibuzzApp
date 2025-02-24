import { getUserProfileStore, storeUserProfile } from "@/storage/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toast } from "react-native-toast-notifications";
import { client } from "./api-client";

const editProfile = async (data: any, id: string) => {
  const res = await client(`/userprofile/${id}`, { method: "PUT", data });
  return res;
};

export const useEditProfile = () => {
  const userProfileData = getUserProfileStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => editProfile(data, userProfileData?._id || ""),
    onSuccess: async (response: any) => {
      await storeUserProfile(response.updatedUserProfile);
      Toast.show("Profile Updated");

      queryClient.invalidateQueries({ queryKey: ["getRefetchUserData"] });
    },
    onError: (res: any) => {
      Toast.show(res.response?.data.message || "Something went wrong");
    },
  });
};
