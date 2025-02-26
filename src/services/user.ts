import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { client } from "./api-client";
import { getToken } from "@/storage/token";

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
