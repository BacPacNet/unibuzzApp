import { UserMainNotificationsProps } from "@/types/notifications";
import { client } from "./api-client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getToken } from "@/storage/token";

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
