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
    //   onSuccess: (response: any) => {
    //     const communityData: any = queryClient.getQueryData(['useGetSubscribedCommunties'])

    //     if (communityData) {
    //       const updatedCommunityData = communityData.map((item: any) => {
    //         if (item._id === response._id) {
    //           return {
    //             ...item,
    //             communityGroups: response.communityGroups,
    //           }
    //         }
    //         return item
    //       })

    //       queryClient.setQueryData(['useGetSubscribedCommunties'], updatedCommunityData)
    //     }
    //   },
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityGroupsPost"] });
      queryClient.invalidateQueries({
        queryKey: ["useGetSubscribedCommunties"],
      });
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
    onSuccess: () => {
      //   queryClient.invalidateQueries({ queryKey: ["communityGroupsPost"] });
      queryClient.invalidateQueries({
        queryKey: ["useGetSubscribedCommunties"],
      });
      //   queryClient.setQueryData(["community"], []);
      Toast.show(`Left Community`);
    },
    onError: (res: any) => {
      Toast.show(res.response?.data.message || "Something went wrong");
    },
  });
};

// export async function getAllCommunityGroupPost(
//   communityId: string,
//   communityGroupID: string,
//   token: any,
//   page: number,
//   limit: number,
// ) {
//   const response: any = await client(
//     `/communitypost/${communityId}/${communityGroupID ? communityGroupID : ""}?page=${page}&limit=${limit}`,
//     {
//       headers: { Authorization: `Bearer ${token}` },
//     },
//   );
//   return response;
// }

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
