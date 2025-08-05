import { getToken } from "@/storage/token";
import { client } from "./api-client";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { Community } from "@/types/Community";
import { Toast } from "react-native-toast-notifications";
import { updateUserProfileCommunities } from "@/storage/user";

export async function getCommunity(communityId: string) {
  const response = await client(`/community/${communityId}`);
  return response;
}

export function useGetCommunity(communityId: string) {
  return useQuery({
    queryKey: ["community", communityId],
    queryFn: () => getCommunity(communityId),
    enabled: !!communityId,
  }) as UseQueryResult<Community>;
}

export async function getUserSubscribedCommunities(token: any) {
  const response = await client(`/community`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}

export function useGetSubscribedCommunities() {
  const cookieValue = getToken() as string;
  return useQuery({
    queryKey: ["useGetSubscribedCommunties"],
    queryFn: () => getUserSubscribedCommunities(cookieValue),
    enabled: !!cookieValue,
  }) as UseQueryResult<Community[]>;
}

export async function getUserFilteredSubscribedCommunities(
  communityId: string,
  token: string,
  data: any,
) {
  const response: any = await client(`/community/filtered/${communityId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
  return response;
}

export function useGetFilteredSubscribedCommunities(communityId: string = "") {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      getUserFilteredSubscribedCommunities(communityId, cookieValue, data),

    onError: (res: any) => {
      Toast.show(res.response?.data.message || "Something went wrong");
    },
  });
}


export async function joinCommunity(communityId: string, token: string) {
  const response = await client(`/community/${communityId}/join`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}
export const useJoinCommunity = () => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (communityId: string) =>
      joinCommunity(communityId, cookieValue),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["communityGroupsPost"] });
      queryClient.invalidateQueries({
        queryKey: ["useGetSubscribedCommunties"],
      });
      queryClient.invalidateQueries({
        queryKey: ["community"],
      });
      updateUserProfileCommunities(response.user.communities);
      Toast.show(`Joined Community `);
    },
    onError: (res: any) => {
      Toast.show(res.response?.data.message || "Something went wrong");
    },
  });
};

export async function leaveCommunity(communityId: string, token: any) {
  const response = await client(`/community/${communityId}/leave`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}

export const useLeaveCommunity = () => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (communityId: string) =>
      leaveCommunity(communityId, cookieValue),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({
        queryKey: ["useGetSubscribedCommunties"],
      });
      queryClient.invalidateQueries({
        queryKey: ["community"],
      });
      updateUserProfileCommunities(response.data.community);
      Toast.show(`Left Community`);
    },
    onError: (res: any) => {
      Toast.show(res.response?.data.message || "Something went wrong");
    },
  });
};

export async function joinCommunityFromUniversityAPI(
  universityId: string,
  token: string,
) {
  const response = await client(
    `/community/join?universityId=${universityId}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response;
}

export const useJoinCommunityFromUniversity = () => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (universityId: string) =>
      joinCommunityFromUniversityAPI(universityId, cookieValue),
    onSuccess: (response: any) => {
        queryClient.invalidateQueries({ queryKey: ["communityGroupsPost"] });
      queryClient.invalidateQueries({
        queryKey: ["useGetSubscribedCommunties"],
      });
      queryClient.invalidateQueries({
        queryKey: ["community"],
      });
    },
  });
};

export async function getAllCommunityGroupPost(
  communityId: string,
  communityGroupId: string,
  token: any,
  page: number,
  limit: number,
) {
  const response: any = await client(
    `/communitypost/group?communityId=${communityId}&communityGroupId=${communityGroupId}&page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response;
}

export function useGetCommunityGroupPost(
  communityId: string,
  communityGroupID: string,
  isCommunity: boolean,
  limit: number,
) {
  const cookieValue = getToken() as string;
  return useInfiniteQuery({
    queryKey: ["communityGroupsPost", communityId, communityGroupID],
    queryFn: ({ pageParam = 1 }) =>
      getAllCommunityGroupPost(
        communityId,
        communityGroupID,
        cookieValue,
        pageParam,
        limit,
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: isCommunity && !!cookieValue,
  });
}

export async function getAllCommunityPost(
  communityId: string,
  token: any,
  page: number,
  limit: number,
) {
  const response: any = await client(
    `/communitypost/timelinePost?communityId=${communityId}&page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response;
}
export function useGetCommunityPost(
  communityId: string,
  isCommunity: boolean,
  limit: number,
) {
  const cookieValue = getToken() as string;
  return useInfiniteQuery({
    queryKey: ["communityGroupsPost", communityId],
    queryFn: ({ pageParam = 1 }) =>
      getAllCommunityPost(communityId, cookieValue, pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: isCommunity && !!cookieValue,
    retry: false,
  });
}

export async function getPost(
  postID: string,
  isType: string | null,
  commentId: string,
  token: string,
) {
  const response: any = await client(
    `/communitypost/post/${postID}?isType=${isType}&commentId=${commentId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response;
}

export function useGetPost(
  postId: string,
  isType: string | null = "userPost",
  commentId: string = " ",
) {
  const cookieValue = getToken() as string;

  return useQuery({
    queryKey: ["getPost", postId],
    queryFn: () => getPost(postId, isType, commentId, cookieValue),
    enabled: !!postId && !!cookieValue,
  });
}
