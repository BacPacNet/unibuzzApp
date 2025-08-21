import { client } from "./api-client";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getToken } from "@/storage/token";
import { UserMainNotificationsProps } from "@/types/notifications";
import axios from "axios";
import { Toast } from "react-native-toast-notifications";

export async function getUserMainNotification(
  token: string,
  page: number,
  limit: number
) {
  const response: UserMainNotificationsProps = await client(
    `/notification/user?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response;
}

export function useGetUserNotification(limit: number, toCall: boolean) {
  const cookieValue = getToken() as string;

  return useInfiniteQuery({
    queryKey: ["userNotification"],
    queryFn: ({ pageParam = 1 }) =>
      getUserMainNotification(cookieValue, pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!cookieValue && toCall,
  });
}

export async function getUserNotificationTotalCount(token: string) {
  const response: any = await client(`/notification/user/total-count`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}

export function useGetUserNotificationTotalCount() {
  const cookieValue = getToken() as string;
  const state = useQuery({
    queryKey: ["user_notification_total_count"],
    queryFn: () => getUserNotificationTotalCount(cookieValue),
    enabled: !!cookieValue,
  });

  let errorMessage = null;
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data;
  }

  return { ...state, error: errorMessage };
}

export async function getMessageNotificationTotalCount(token: string) {
  const response: { messageTotalCount: string } = await client(
    `/chat/notification-count`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response;
}
export function useGetUserUnreadMessagesTotalCount() {
  const cookieValue = getToken() as string;
  const state = useQuery({
    queryKey: ["getMessageNotificationTotalCount"],
    queryFn: () => getMessageNotificationTotalCount(cookieValue),
    enabled: !!cookieValue,
  });

  let errorMessage = null;
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data;
  }

  return { ...state, error: errorMessage };
}

export async function JoinCommunityGroup(
  data: { groupId: string; id: string },
  token: string
) {
  const response = await client(`/notification/join/`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
  return response;
}
export const useJoinCommunityGroup = () => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { groupId: string; id: string; isAccepted?: boolean }) =>
      JoinCommunityGroup(data, cookieValue),

    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["userNotification"] });
      queryClient.invalidateQueries({
        queryKey: ["user_notification_total_count"],
      });
    },
    onError: (res: any) => {
      Toast.hideAll();
      Toast.show(res.response.data.message);
    },
  });
};

export async function markAllNotificationAsRead(token: string) {
  const response = await client(`/notification/user/read-all`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}
export const useMarkAllNotificationAsRead = () => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationAsRead(cookieValue),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user_notification_total_count"],
      });
    },
    onError: (res: any) => {
      console.log(res.response.data.message, "res");
    },
  });
};
