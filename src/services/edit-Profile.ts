import {
  getUserProfileStore,
  storeUser,
  storeUserProfile,
} from "@/storage/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toast } from "react-native-toast-notifications";
import { client } from "./api-client";
import { getToken } from "@/storage/token";

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
      storeUserProfile(response.userProfile);
      if (redirect) {
        const community = response.userProfile.email.find(
          (community: any) =>
            community.UniversityName == variables.universityName,
        );
        if (community) {
          queryClient.invalidateQueries({
            queryKey: ["useGetSubscribedCommunties"],
          });
        }
      }

      if (
        !response.user.status.isAlreadyJoined &&
        response.user.status.isUniversityCommunity
      ) {
        storeUser(response.user.updatedUser);
        return queryClient.invalidateQueries({
          queryKey: ["useGetSubscribedCommunties"],
        });
      }

      if (response.user.isAlreadyJoined) {
        return Toast.show("Already Joined");
      }
      if (!response.user.isUniversityCommunity) {
        return Toast.show("No Community");
      }
    },
    onError: (res: any) => {
      return Toast.show(res.response.data.message);
    },
  });
};
