import { useInfiniteQuery } from "@tanstack/react-query";
import useDebounce from "@/hooks/useDebounce";
import { getToken } from "@/storage/token";
import { ProfileConnection } from "@/types/connections";
import { client } from "./api-client";
import { getUserStore } from "@/storage/user";

export async function getUserFollowing(
  token: string,
  page: number,
  limit: number,
  name: string
) {
  const userData = await getUserStore();
  const response: ProfileConnection = await client(
    `/userprofile/following?page=${page}&limit=${limit}&name=${name}&userId=${userData?.id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response;
}
export async function getUserFollowers(
  token: string,
  page: number,
  limit: number,
  name: string
) {
  const userData = await getUserStore();
  const response: ProfileConnection = await client(
    `/userprofile/followers?page=${page}&limit=${limit}&name=${name}&userId=${userData?.id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response;
}

export function useGetUserFollowing(
  name: string,
  limit: number,
  enabled: boolean
) {
  const cookieValue = getToken() as string;
  const debouncedSearchTerm = useDebounce(name, 1000);

  return useInfiniteQuery({
    queryKey: ["usersProfileForConnections", debouncedSearchTerm],
    queryFn: ({ pageParam = 1 }) =>
      getUserFollowing(cookieValue, pageParam, limit, debouncedSearchTerm),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!cookieValue && enabled,
  });
}

export function useGetUserFollowers(
  name: string,
  limit: number,
  enabled: boolean
) {
  const cookieValue = getToken() as string;
  const debouncedSearchTerm = useDebounce(name, 1000);

  return useInfiniteQuery({
    queryKey: ["usersProfileForConnections", debouncedSearchTerm],
    queryFn: ({ pageParam = 1 }) =>
      getUserFollowers(cookieValue, pageParam, limit, debouncedSearchTerm),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!cookieValue && enabled,
  });
}
