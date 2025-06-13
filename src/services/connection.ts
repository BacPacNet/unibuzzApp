import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import useDebounce from "@/hooks/useDebounce";
import { getToken } from "@/storage/token";
import { ProfileConnection } from "@/types/connections";
import { client } from "./api-client";
import { getUserStore, updateUserProfileFollowing } from "@/storage/user";
import { UsersProfileForConnectionsResponse } from "@/types/generic";

export async function getUserMututal(
  token: string,
  page: number,
  limit: number,
  name: string,
  userId: string,
) {
  const response: ProfileConnection = await client(
    `/userprofile/mutuals?page=${page}&limit=${limit}&name=${name}&userId=${userId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response;
}

export async function getUserFollowing(
  token: string,
  page: number,
  limit: number,
  name: string,
  userId: string,
) {
  const response: ProfileConnection = await client(
    `/userprofile/following?page=${page}&limit=${limit}&name=${name}&userId=${userId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response;
}
export async function getUserFollowers(
  token: string,
  page: number,
  limit: number,
  name: string,
  userId: string,
) {
  const response: ProfileConnection = await client(
    `/userprofile/followers?page=${page}&limit=${limit}&name=${name}&userId=${userId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response;
}

export async function toggleFollow(id: string, token: any) {
  const response = await client(`/userprofile?userToFollow=${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}

export const useToggleFollow = () => {
  const cookieValue = getToken() as string;

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleFollow(id, cookieValue),

    onSuccess: (response: any, userId: string) => {
      //  storeUserProfile(response);
      updateUserProfileFollowing(response.following);
      //setUserfollowing(response.followed.following)
      //  if (type == "Following") {
      //    queryClient.invalidateQueries({ queryKey: ["getUserFollow"] });
      //  }
      //  else {

      queryClient.setQueryData(
        ["usersProfileForConnections"],
        (userProfileConnection: UsersProfileForConnectionsResponse) => {
          if (!userProfileConnection || !userProfileConnection.pages)
            return userProfileConnection;
          return {
            ...userProfileConnection,
            pages: userProfileConnection.pages.map((page: any) => ({
              ...page,
              users: page.users.map((user: any) =>
                user._id === userId
                  ? {
                      ...user,
                      isFollowing: !user.isFollowing,
                    }
                  : user,
              ),
            })),
          };
        },
      );
      queryClient.invalidateQueries({
        queryKey: ["getUserFollowers"],
      });
    },
    onError: (res: any) => {
      console.log(res.response.data.message, "res");
    },
  });
};

export function useGetUserMutuals(
  name: string,
  userId: string,
  limit: number,
  enabled: boolean,
) {
  const cookieValue = getToken() as string;
  const debouncedSearchTerm = useDebounce(name, 1000);

  return useInfiniteQuery({
    queryKey: ["getUserMutuals", debouncedSearchTerm],
    queryFn: ({ pageParam = 1 }) =>
      getUserMututal(
        cookieValue,
        pageParam,
        limit,
        debouncedSearchTerm,
        userId,
      ),
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

export function useGetUserFollowing(
  name: string,
  limit: number,
  enabled: boolean,
  userId: string,
) {
  const cookieValue = getToken() as string;
  const debouncedSearchTerm = useDebounce(name, 1000);

  return useInfiniteQuery({
    queryKey: ["getUserFollowing", debouncedSearchTerm, userId],
    queryFn: ({ pageParam = 1 }) =>
      getUserFollowing(
        cookieValue,
        pageParam,
        limit,
        debouncedSearchTerm,
        userId,
      ),
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
  enabled: boolean,
  userId: string,
) {
  const cookieValue = getToken() as string;
  const debouncedSearchTerm = useDebounce(name, 1000);

  return useInfiniteQuery({
    queryKey: ["getUserFollowers", debouncedSearchTerm, userId],
    queryFn: ({ pageParam = 1 }) =>
      getUserFollowers(
        cookieValue,
        pageParam,
        limit,
        debouncedSearchTerm,
        userId,
      ),
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
