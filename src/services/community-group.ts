import { getToken } from "@/storage/token";
import { CommunityGroupType } from "@/types/CommunityGroup";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { client } from "./api-client";
import { Toast } from "react-native-toast-notifications";
import { notificationStatus as notificationStatusEnum } from "@/types/notifications";
import { showToast } from "@/utils/toastWrapper";
import { CommunityPostData } from "@/types/constant";

export async function getAllCommunityGroups(
  communityId: string,
  communityGroupId: string,
  token: any
) {
  const response: any = await client(
    `/communitygroup/${communityId}?${communityGroupId ? `communityGroupId=${communityGroupId}` : ""}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response;
}

export function useGetCommunityGroup(
  communityId: string,
  communityGroupId: string = ""
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
  data: any
) {
  const response = await client(`/communitygroup/${communityId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
  return response;
}

export const useCreateCommunityGroup = (isCommunityAdmin: boolean) => {
  const cookieValue = getToken() as string;

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ communityId, data }: any) =>
      CreateCommunityGroup(communityId, cookieValue, data),
    onSuccess: (response: any, req) => {
      //   queryClient.invalidateQueries({ queryKey: ["communityGroups"] });
      queryClient.invalidateQueries({
        queryKey: ["useGetSubscribedCommunties"],
      });
      Toast.hideAll();

      if (req.isOfficial && !isCommunityAdmin) {
        Toast.show(
          "Your official group has been created and is pending admin approval.",
          {
            placement: "top",
            textStyle: { color: "#220B6A" },
            normalColor: "#E9E8FF",
          }
        );
      } else if (req.isOfficial && isCommunityAdmin) {
        Toast.show(
          "Your official group has been created and is pending admin approval.",
          {
            placement: "top",
            textStyle: { color: "#220B6A" },
            normalColor: "#E9E8FF",
          }
        );
      } else {
        Toast.show("Your casual group has been created.", {
          placement: "top",
          textStyle: { color: "#220B6A" },
          normalColor: "#E9E8FF",
        });
      }
    },
    onError: (error: any) => {
      Toast.hideAll();

      if (!error.response.data.for) {
        Toast.show(error.response.data.message);
      }
    },
  });
};

export async function UpdateCommunityGroup(data: any, id: string, token: any) {
  const response = await client(`/communitygroup/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
  return response;
}

export const useUpdateCommunityGroup = () => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      communityId,
      payload,
    }: {
      communityId: string;
      payload: any;
    }) => UpdateCommunityGroup(payload, communityId, cookieValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityGroup"] });

      queryClient.invalidateQueries({
        queryKey: ["useGetSubscribedCommunties"],
      });
      Toast.hideAll();
      Toast.show("Updated Sucessfully");
    },
    onError: (res: any) => {
      Toast.hideAll();
      const err = JSON.parse(res.response.data.message);
      if (!err.for) {
        Toast.show(res.response.data.message);
      }
    },
  });
};

export async function CreateGroupPost(data: any, token: string) {
 console.log("dalkljjhta",data);
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
    // mutationFn: (data: any) => CreateGroupPost(data, cookieValue),
    mutationFn: (data: CommunityPostData) => {
      const { requirePostApproval: _, ...postData } = data
      return CreateGroupPost(postData, cookieValue)
    },
    onSuccess: (_, req) => {
      queryClient.invalidateQueries({ queryKey: ["communityGroupsPost"] });
      Toast.hideAll();
      if (req?.requirePostApproval) {
        Toast.show("Your post has been submitted for approval.", {
          placement: "top",
          textStyle: { color: "#220B6A" },
          normalColor: "#E9E8FF",
        });
      } else {
        Toast.show("Post created successfully.", {
          placement: "top",
          type: "success",
        });
      }
    },
    onError: (res: any) => {
      Toast.hideAll();
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
    mutationFn: ({communityGroupId,value}: {communityGroupId: string,value?: string}) =>
      joinCommunityGroupAPI(communityGroupId, cookieValue),

    onSuccess: (response: any,req: {communityGroupId: string,value?: string}) => {
      queryClient.invalidateQueries({ queryKey: ["communityGroup"] });
      if(req.value !== "request"){
      queryClient.invalidateQueries({ queryKey: ["communityGroupsPost"] });
      }
      if (response.success && response.isGroupPrivate) {
        return showToast({ message: response.message });
      }
    },

    onError: (error: any) => {
      Toast.hideAll();
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
      queryClient.invalidateQueries({ queryKey: ["communityGroupsPost"] });
      Toast.hideAll();
      Toast.show("Community left successfully");
    },

    onError: (error: any) => {
      Toast.hideAll();
      Toast.show(error.response?.data.message || "Something went wrong");
    },
  });
};

async function deleteCommunityGroupAPI(
  communityGroupId: string,
  token: string
) {
  return await client(`/communitygroup/${communityGroupId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
export const useDeleteCommunityGroup = () => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (communityGroupId: string) =>
      deleteCommunityGroupAPI(communityGroupId, cookieValue),

    onSuccess: () => {
      Toast.hideAll();
      Toast.show(`Community group deleted`, {
        type: "success",
        placement: "top",
      });
      queryClient.invalidateQueries({ queryKey: ["communityGroup"] });
      queryClient.invalidateQueries({
        queryKey: ["useGetSubscribedCommunties"],
      });
    },

    onError: (error: any) => {
      Toast.hideAll();
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      console.error("Error deleting community group:", errorMessage);
      Toast.show(errorMessage, { type: "danger", placement: "top" });
    },
  });
};

async function removeUserFromCommunityGroupAPI(
  communityGroupId: string,
  userId: string,
  token: string
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
      Toast.hideAll();
      Toast.show("User removed successfully");
    },

    onError: (error: any) => {
      Toast.hideAll();
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      Toast.show(errorMessage);
    },
  });
};

async function ChangeCommunityGroupStatusAPI(
  data: { status: string },
  communityGroupId: string,
  token: string
) {
  return await client(`/communitygroup/status/${communityGroupId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
}

export const useChangeCommunityGroupStatus = (communityGroupId: string) => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      status: string;
      notificationId: string;
      communityGroupId: string;
      adminId: string;
      userId: string;
      text: string;
    }) => ChangeCommunityGroupStatusAPI(data, communityGroupId, cookieValue),

    onSuccess: (_, req) => {
      //   queryClient.invalidateQueries({ queryKey: ["user_notification"] });
      queryClient.invalidateQueries({ queryKey: ["userNotification"] });
      Toast.hideAll();
      if (req.status == notificationStatusEnum.accepted) {
        Toast.show(
          "You’ve approved the official group request. The group is now active.",
          {
            placement: "top",
            textStyle: { color: "#220B6A" },
            normalColor: "#E9E8FF",
          }
        );
      } else {
        Toast.show(
          "You’ve rejected the official group request. The group has been deleted.",
          {
            placement: "top",
            type: "danger",
          }
        );
      }
    },

    onError: (error: any) => {
      Toast.hideAll();
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      console.error("Error changing status:", errorMessage);
    },
  });
};

async function acceptRejectPrivateGroupAPI(
  data: { status: string },
  communityGroupId: string,
  token: string
) {
  return await client(`/communitygroup/join-request/${communityGroupId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
}

export const useJoinRequestPrivateGroup = (communityGroupId: string) => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      status: string;
      notificationId: string;
      userId: string;
      adminId: string;
      communityGroupId: string;
    }) => acceptRejectPrivateGroupAPI(data, communityGroupId, cookieValue),

    onSuccess: () => {
      //   queryClient.invalidateQueries({ queryKey: ["user_notification"] });
      queryClient.invalidateQueries({ queryKey: ["userNotification"] });
      //showCustomSuccessToast(`status of Community Group changed`)
    },

    onError: (error: any) => {
      Toast.hideAll();
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      console.error("Error changing status:", errorMessage);
    },
  });
};

export async function getAllCommunityGroupMembersUser(
  token: string,
  communityGroupId: string,
  userStatus: string,
  page: number,
  limit: number
) {
  if (!token || token.length === 0) {
    console.error("Token is empty, cannot make API call");
    throw new Error("Authentication token is required");
  }

  const response: any = await client(
    `/communitygroup/members?communityGroupId=${communityGroupId}&userStatus=${userStatus}&page=${page}&limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response;
}

export function useGetCommunityGroupMembersUser(
  communityGroupId: string,
  userStatus: string,
  limit: number
) {
  const cookieValue = getToken() as string;

  return useInfiniteQuery({
    queryKey: [
      "community-group-members",
      communityGroupId,
      userStatus,
      limit,
      cookieValue,
    ],
    queryFn: ({ pageParam = 1 }) => {
      return getAllCommunityGroupMembersUser(
        cookieValue,
        communityGroupId,
        userStatus,
        pageParam,
        limit
      );
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!communityGroupId && !!cookieValue && cookieValue.length > 0,
  });
}
