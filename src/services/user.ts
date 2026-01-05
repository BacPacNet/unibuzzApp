import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { client } from "./api-client";
import { getToken } from "@/storage/token";
import { Toast } from "react-native-toast-notifications";
import { storeUser } from "@/storage/user";
import { IUserProfileResponse, ReferralsResponse } from "@/types/users";

export async function getUserData(token: any, id: string) {
  const response: IUserProfileResponse = await client(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}

export function useGetUserData(userId: string) {
  const cookieValue = getToken() as string;
  return useQuery({
    queryKey: ["getRefetchUserData", userId],
    queryFn: () => getUserData(cookieValue, userId),
    enabled: !!cookieValue && !!userId,
  });
}

export async function getAllUserPosts(
  token: string,
  userId: string,
  page: number,
  limit: number
) {
  const response: any = await client(
    `/userpost?userId=${userId}&page=${page}&limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response;
}

export function useGetUserPosts(userId: string, limit: number) {
  const cookieValue = getToken() as string;

  return useInfiniteQuery({
    queryKey: ["userPosts", userId],
    queryFn: ({ pageParam = 1 }) =>
      getAllUserPosts(cookieValue, userId, pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!cookieValue,
  });
}

const changeUserPassword = async (data: any, token: string) => {
  const res = await client(`/users/changeUserPassword`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
  return res;
};
export const useChangeUserPassword = () => {
  const cookieValue = getToken() as string;
  return useMutation({
    mutationFn: (data: any) => changeUserPassword(data, cookieValue),
    onError: (res: any) => {
      Toast.hideAll();
      Toast.show(res.response?.data.message || "Something went wrong", {
        type: "danger",
        placement: "top",
      });
    },
  });
};

const changeUserEmail = async (data: any, token: string) => {
  const res = await client(`/users/changeUserEmail`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
  return res;
};

export const useChangeUserEmail = () => {
  const cookieValue = getToken() as string;
  return useMutation({
    mutationFn: (data: any) => changeUserEmail(data, cookieValue),
    onSuccess: (response: any) => {
      // setUserData(response)
      storeUser(response);
    },
    onError: (res: any) => {
      console.error(res.response.data.message, "res");
    },
  });
};

const changeUserName = async (data: any, token: string) => {
  const res = await client(`/users/changeUserName`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
  return res;
};
export const useChangeUserName = () => {
  // const setUserData = useUniStore((state) => state.setUserData)
  const cookieValue = getToken() as string;
  return useMutation({
    mutationFn: (data: any) => changeUserName(data, cookieValue),
    onSuccess: (response: any) => {
      storeUser(response);
    },
    onError: (res: any) => {
      Toast.hideAll();
      Toast.show(res.response.data.message);
    },
  });
};

const deActivateUserAccount = async (data: any, token: string) => {
  const res = await client(`/users/deActivateUserAccount`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
  return res;
};
export const useDeActivateUserAccount = () => {
  const cookieValue = getToken() as string;
  return useMutation({
    mutationFn: (data: any) => deActivateUserAccount(data, cookieValue),

    onError: (res: any) => {
      Toast.hideAll();
      Toast.show(res.response.data.message, {
        placement: "top",
        type: "warning",
      });
    },
  });
};

const newUserTrue = async (token: string) => {
  const res = await client(`/users/new-user`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

export const useNewUserTrue = () => {
  const cookieValue = getToken() as string;

  return useMutation({
    mutationFn: () => newUserTrue(cookieValue),

    onSuccess: async (response: any) => {
      await storeUser(response.UserData);
    },

    onError: (res: any) => {
      Toast.hideAll();
      Toast.show(res.response.data.message, {
        placement: "top",
        type: "warning",
      });
    },
  });
};

const softDeleteUserAccount = async (token: string, data: any) => {
  const res = await client(`/users`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
  return res;
};

export const useDeleteUserAccount = () => {
  const cookieValue = getToken() as string;
  return useMutation({
    mutationFn: (data: any) => softDeleteUserAccount(cookieValue, data),

    onSuccess: (res: any) => {
      Toast.hideAll();
      Toast.show(res.response.data.message, {
        placement: "top",
        type: "success",
      });
    },
    onError: (res: any) => {
      Toast.hideAll();
      Toast.show(res.response.data.message, {
        placement: "top",
        type: "warning",
      });
    },
  });
};

export async function getUserReferrals(
  token: string
): Promise<ReferralsResponse> {
  const response = await client<ReferralsResponse, any>(`/users/referrals`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}

export function useGetUserReferrals() {
  const cookieValue = getToken() as string;
  return useQuery({
    queryKey: ["getUserReferrals"],
    queryFn: () => getUserReferrals(cookieValue),
    enabled: !!cookieValue,
  });
}
