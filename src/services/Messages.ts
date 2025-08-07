import { messages } from "@/types/ChatType";
import { client } from "./api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getToken } from "@/storage/token";
import { Toast } from "react-native-toast-notifications";
import { ChatsArray } from "@/types/constant";
import { useGetUserUnreadMessagesTotalCount } from "./notification";

export async function getUserChats(token: any) {
  const response: ChatsArray = await client(`/chat`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response;
}

export function useGetUserChats() {
  const cookieValue = getToken();

  const state = useQuery({
    queryKey: ["userChats"],
    queryFn: () => getUserChats(cookieValue),
    enabled: !!cookieValue,
  });

  let errorMessage = null;
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data;
  }

  return { ...state, error: errorMessage };
}


export async function getChatMembers(token: any, chatId: string) {
    const response:any = await client(`/chat/group/${chatId}/members`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    return response;
  }
export function useGetChatMembers(chatId: string) {
  const cookieValue = getToken();


  const state = useQuery({
    queryKey: ["chatMembers",chatId],
    queryFn: () => getChatMembers(cookieValue, chatId),
    enabled: !!cookieValue,
  });

  let errorMessage = null;
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data;
  }

  return { ...state, error: errorMessage };
}

export async function userFollowingAndFollowers(name: string, token: any) {
  const response: any = await client(
    `/userprofile/following_and_followers?name=${name}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response;
}

export function useGetUserFollowingAndFollowers(name: string) {
  const cookieValue = getToken();
  const state = useQuery({
    queryKey: ["userFollowingAndFollowers", name],
    queryFn: () => userFollowingAndFollowers(name, cookieValue),
    enabled: !!cookieValue,
  });

  let errorMessage = null;
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data;
  }

  return { ...state, error: errorMessage };
}

// Messages

export async function createUserChat(token: any, data: any) {
  const response = await client(`/chat`, {
    headers: { Authorization: `Bearer ${token}` },
    method: "POST",
    data,
  });
  return response;
}

export const useCreateUserChat = () => {
  const cookieValue = getToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createUserChat(cookieValue, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
    },
    onError: (error: any) => {
      Toast.show(error.response?.data.message || "Something went wrong");
    },
  });
};

export async function getChatMessages(token: any, chatId: string) {
  const response: messages = await client(`/message/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}

export function useGetUserMessages(chatId: string) {
  const cookieValue = getToken();
  const state = useQuery({
    queryKey: ["chatMessages", chatId],
    queryFn: () => getChatMessages(cookieValue, chatId),
    enabled: !!cookieValue && !!chatId,
  });

  let errorMessage = null;
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data;
  }

  return { ...state, error: errorMessage };
}

export async function createChatMessage(token: any, data: any) {
  const response: any = await client(`/message`, {
    headers: { Authorization: `Bearer ${token}` },
    method: "POST",
    data,
  });
  return response;
}

export const useCreateChatMessage = () => {
  const cookieValue = getToken();
  return useMutation({
    mutationFn: (data: any) => createChatMessage(cookieValue, data),
    onSuccess: () => {},
    onError: (error: any) => {
      //   console.log(error.response.data.message, "res");
      Toast.show(error.response?.data.message || "Something went wrong");
    },
  });
};

export async function updateIsSeen(token: any, messageId: string, data: any) {
  const response = await client(`/message/${messageId}`, {
    headers: { Authorization: `Bearer ${token}` },
    method: "PUT",
    data,
  });
  return response;
}

export const useUpdateMessageIsSeen = () => {
  const cookieValue = getToken();
  const queryClient = useQueryClient();
  const chatData: ChatsArray = queryClient.getQueryData(["userChats"]) || [];
  const { refetch: refetchMessageNotification } =
    useGetUserUnreadMessagesTotalCount();
  return useMutation({
    mutationFn: ({
      chatId,
      messageId,
      data,
    }: {
      chatId: string;
      messageId: string;
      data: any;
    }) => {
      return updateIsSeen(cookieValue, messageId, data).then((response) => ({
        chatId,
        response,
      }));
    },
    onSuccess: ({ chatId, response }: { chatId: string; response: any }) => {
      if (chatData) {
        const updatedChatData = chatData.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                latestMessage: response,
                unreadMessagesCount: 0,
              }
            : chat,
        );
        queryClient.setQueryData(["userChats"], updatedChatData);
      }
      refetchMessageNotification();
      //   queryClient.invalidateQueries({ queryKey: ["message_notification"] });
    },
    onError: (error: any) => {
      Toast.show(error.response?.data.message || "Something went wrong");
    },
  });
};

export async function acceptRequest(token: any, data: any) {
  const response = await client(`/chat/acceptRequest`, {
    headers: { Authorization: `Bearer ${token}` },
    method: "PUT",
    data,
  });
  return response;
}

export const useAcceptRequest = () => {
  const cookieValue = getToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => acceptRequest(cookieValue, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
    },
    onError: (error: any) => {
      Toast.show(error.response?.data.message || "Something went wrong");
    },
  });
};

export async function acceptGroupRequest(token: any, data: any) {
  const response = await client(`/chat/acceptGroupRequest`, {
    headers: { Authorization: `Bearer ${token}` },
    method: "PUT",
    data,
  });
  return response;
}

export const useAcceptGroupRequest = () => {
  const cookieValue = getToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => acceptGroupRequest(cookieValue, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
    },
    onError: (error: any) => {
      // console.log(error.response.data.message, 'res')
      Toast.show(error.response?.data.message || "Something went wrong");
    },
  });
};

export async function toggleMessageBlock(
  token: any,
  data: any,
  userToBlockId: string,
) {
  const response = await client(`/chat/block/${userToBlockId}`, {
    headers: { Authorization: `Bearer ${token}` },
    method: "PUT",
    data,
  });
  return response;
}

export const useToggleBlockMessages = (
  userToBlockID: string,
  isBlockedByYou: boolean,
) => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      toggleMessageBlock(cookieValue, data, userToBlockID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      if (isBlockedByYou) {
        Toast.show("you have un-blocked the user", {
          placement: "top",
          type: "success",
        });
      } else {
        Toast.show("you have blocked the user", {
          placement: "top",
          type: "danger",
        });
      }
    },
    onError: (res: any) => {
      Toast.show(res.response.data.message, {
        placement: "top",
        type: "warning",
      });
    },
  });
};

export async function createGroupChat(token: any, data: any) {
  const response = await client(`/chat/group`, {
    headers: { Authorization: `Bearer ${token}` },
    method: "POST",
    data,
  });
  return response;
}

export const useCreateGroupChat = () => {
  const cookieValue = getToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createGroupChat(cookieValue, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
    },
    onError: (error: any) => {
      // console.log(res.response.data.message, 'res')
      Toast.show(error.response?.data.message || "Something went wrong");
    },
  });
};

export async function removeGroupMember(
  token: string,
  chatId: string,
  data: any,
) {
  const response = await client(`/chat/group/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
    method: "PUT",
    data,
  });
  return response;
}
export const useRemoveGroupChatMember = (chatId: string) => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => removeGroupMember(cookieValue, chatId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      //   console.log('data', res)
    },
    onError: (res: any) => {
      Toast.show(res.response?.data.message || "Something went wrong");
    },
  });
};

export async function leaveGroup(token: string, chatId: any) {
  const response = await client(`/chat/leave-group/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
    method: "PUT",
  });
  return response;
}

export const useLeaveGroup = (chatId: string) => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => leaveGroup(cookieValue, chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      Toast.show("You left the group");
    },
    onError: (res: any) => {
      //   console.log(res.response.data.message, 'res')
      Toast.show(res.response.data.message, {
        placement: "top",
        type: "warning",
      });
    },
  });
};

export async function editGroupMember(
  token: string,
  chatId: string,
  data: any,
) {
  const response = await client(`/chat/edit-group/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
    method: "PUT",
    data,
  });
  return response;
}
export const useEditGroupChat = (chatId: string) => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => editGroupMember(cookieValue, chatId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      Toast.show("Changes Applied Successfully", {
        placement: "top",
        type: "success",
      });
    },
    onError: (res: any) => {
      Toast.show(res.response.data.message, {
        placement: "top",
        type: "warning",
      });
    },
  });
};




export async function deleteChatGroupByAdmin(token: string, chatId: any) {
    const response = await client(`/chat/group/${chatId}`, { headers: { Authorization: `Bearer ${token}` }, method: 'DELETE' })
    return response
  }

export const useDeleteChatGroup = (chatId: string) => {
    const cookieValue = getToken() as string
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: () => deleteChatGroupByAdmin(cookieValue, chatId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userChats'] })
        Toast.show('Group Deleted Successfully', {
            placement: "top",
            type: "success",
          });
      },
      onError: (res: any) => {
        Toast.show(res.response.data.message, {
            placement: "top",
            type: "warning",
          });
      },
    })
  }