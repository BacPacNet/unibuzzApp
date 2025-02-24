import { useQuery } from "@tanstack/react-query";
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

export async function getAllUserPosts(token: string, userId: string) {
  const response: any = await client(`/userpost?userId=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}

export function useGetUserPosts(userId: string) {
  const cookieValue = getToken() as string;

  return useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => getAllUserPosts(cookieValue, userId),
    enabled: !!userId,
  });
}
