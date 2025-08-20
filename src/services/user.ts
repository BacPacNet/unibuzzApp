import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { client } from "./api-client";
import { getToken } from "@/storage/token";
import { Toast } from "react-native-toast-notifications";
import { storeUser } from "@/storage/user";

export async function getUserData(token: any, id: string) {
  const response: any = await client(`/users/${id}`, {
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
      Toast.show(res.response?.data.message || "Something went wrong");
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
      console.log(res.response.data.message, "res");
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
      console.log("response", response);
      storeUser(response);
      // setUserData(response)
    },
    onError: (res: any) => {
      console.log(res.response.data.message, "res");
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
      Toast.show(res.response.data.message, {
        placement: "top",
        type: "warning",
      });
    },
  });
};
