import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "./api-client";
import { getToken } from "@/storage/token";
import axios from "axios";
import { showToast } from "@/utils/toastWrapper";

export async function getUserProfileVerifiedUniversityEmailData(token: any) {
  const response: any = await client(`/userprofile/verifiedUniversityEmails`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}

export function useGetUserProfileVerifiedUniversityEmailData() {
  const cookieValue = getToken() as string;

  return useQuery({
    queryKey: ["verifiedUniversityEmails"],
    queryFn: () => getUserProfileVerifiedUniversityEmailData(cookieValue),
    enabled: !!cookieValue,
  });
}

const blockUser = async (userToBlock: any, token: string) => {
  const res = await client(`/userprofile/block?userToBlock=${userToBlock}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};
export const useBlockUser = () => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userToBlock: any) => blockUser(userToBlock, cookieValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getRefetchUserData"] });
    },
    onError: (res: any) => {
      showToast({ message: res.response.data.message, type: "danger" });
    },
  });
};

export async function getUserBlockedList(token: any) {
  const response: any = await client(`/userprofile/blocked_users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}

export function useGetUserBlockedList() {
  const cookieValue = getToken() as string;

  const state = useQuery({
    queryKey: ["getUserBlockedList"],
    queryFn: () => getUserBlockedList(cookieValue),
    enabled: !!cookieValue,
  });

  let errorMessage = null;
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data;
  }

  return { ...state, error: errorMessage };
}
