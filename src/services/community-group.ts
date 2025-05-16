import { getToken } from "@/storage/token";
import { CommunityGroupType } from "@/types/CommunityGroup";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { client } from "./api-client";
import { Toast } from "react-native-toast-notifications";

export async function getAllCommunityGroups(
  communityId: string,
  communityGroupId: string,
  token: any,
) {
  const response: any = await client(
    `/communitygroup/${communityId}?${communityGroupId ? `communityGroupId=${communityGroupId}` : ""}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response;
}

export function useGetCommunityGroup(
  communityId: string,
  communityGroupId: string = "",
) {
  const cookieValue = getToken() as string;

  return useQuery({
    enabled: !!communityId && !!cookieValue && !!communityGroupId,
    queryKey: ["communityGroup", communityId, communityGroupId],
    queryFn: () =>
      getAllCommunityGroups(communityId, communityGroupId, cookieValue),
  }) as UseQueryResult<CommunityGroupType>;
}

export async function CreateCommunityGroup(
  communityId: string,
  token: any,
  data: any,
) {
  const response = await client(`/communitygroup/${communityId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
  return response;
}

export const useCreateCommunityGroup = () => {
  const cookieValue = getToken() as string;

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ communityId, data }: any) =>
      CreateCommunityGroup(communityId, cookieValue, data),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["communityGroups"] });
      queryClient.invalidateQueries({
        queryKey: ["useGetSubscribedCommunties"],
      });

      Toast.show("Community created successfully");
    },
    onError: (error: any) => {
      Toast.show(error.response.data.message);
    },
  });
};

export async function CreateGroupPost(data: any, token: string) {
  const response = await client(`/communitypost`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
  return response;
}
export const useCreateGroupPost = () => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => CreateGroupPost(data, cookieValue),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityGroupsPost"] });

      Toast.show("Post created successfully");
    },
    onError: (res: any) => {
      Toast.show(res.response?.data?.message as string);
    },
  });
};

async function joinCommunityGroupAPI(communityGroupId: string, token: string) {
  return await client(`/communitygroup/${communityGroupId}/join`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export const useJoinCommunityGroup = () => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (communityGroupId: string) =>
      joinCommunityGroupAPI(communityGroupId, cookieValue),

    onSuccess: () => {
      // Invalidate relevant query caches

      //   queryClient.invalidateQueries({
      //     queryKey: ["useGetSubscribedCommunties"],
      //   });
      //   queryClient.invalidateQueries({ queryKey: ["communityGroupsPost"] });
      queryClient.invalidateQueries({ queryKey: ["communityGroup"] });

      Toast.show("Joined Community Group");
    },

    onError: (error: any) => {
      Toast.show(error.response?.data.message || "Something went wrong");
    },
  });
};

async function leaveCommunityGroupAPI(communityGroupId: string, token: string) {
  return await client(`/communitygroup/${communityGroupId}/leave`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export const useLeaveCommunityGroup = () => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (communityGroupId: string) =>
      leaveCommunityGroupAPI(communityGroupId, cookieValue),

    onSuccess: () => {
      // Invalidate relevant query caches
      //   queryClient.invalidateQueries({
      //     queryKey: ["useGetSubscribedCommunties"],
      //   });
      //   queryClient.invalidateQueries({ queryKey: ["communityGroupsPost"] });
      queryClient.invalidateQueries({ queryKey: ["communityGroup"] });
      Toast.show("Left Community Group!");
    },

    onError: (error: any) => {
      Toast.show(error.response?.data.message || "Something went wrong");
    },
  });
};

async function removeUserFromCommunityGroupAPI(
  communityGroupId: string,
  userId: string,
  token: string,
) {
  return await client(`/communitygroup/${communityGroupId}/user/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
export const useRemoveUserFromCommunityGroup = () => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      communityGroupId,
      userId,
    }: {
      communityGroupId: string;
      userId: string;
    }) =>
      removeUserFromCommunityGroupAPI(communityGroupId, userId, cookieValue),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityGroup"] });
      Toast.show("User removed successfully");
    },

    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      Toast.show(errorMessage);
    },
  });
};
