import { getToken } from "@/storage/token";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { client } from "./api-client";
import { Toast } from "react-native-toast-notifications";
import { PostType } from "@/types/postType";

export async function getAllTimelinePosts(
  token: string,
  page: number,
  limit: number
) {
  const response: any = await client(
    `/userpost/timeline?page=${page}&limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response;
}

export function useGetTimelinePosts(limit: number) {
  const cookieValue = getToken() as string;

  return useInfiniteQuery({
    queryKey: ["timelinePosts"],
    queryFn: ({ pageParam = 1 }) =>
      getAllTimelinePosts(cookieValue, pageParam, limit),
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

export async function CreateUserPost(data: any, token: string) {
  const response = await client(`/userpost/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
  return response;
}

export const useCreateUserPost = () => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => CreateUserPost(data, cookieValue),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["timelinePosts"] });

      Toast.show("Post created successfully");
    },
    onError: (error: any) => {
      Toast.show(error.response?.data.message || "Something went wrong");
    },
  });
};

export async function DeleteUserPost(postId: string, token: string) {
  const response = await client(`/userpost/${postId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}

export const useDeleteUserPost = () => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => DeleteUserPost(postId, cookieValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["timelinePosts"] });
    },
    onError: (error: any) => {
      Toast.show(error.response?.data.message || "Something went wrong");
    },
  });
};

// comments

export async function getUserPostComments(
  postId: string,
  token: string,
  page: number,
  limit: number
) {
  const response: any = await client(
    `/userpostcomment/${postId}?page=${page}&limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response;
}

export function useGetUserPostComments(
  postId: string,
  isTimeline: boolean,
  limit: number
) {
  {
    const cookieValue = getToken() as string;

    return useInfiniteQuery({
      queryKey: ["userPostComments"],
      queryFn: ({ pageParam = 1 }) =>
        getUserPostComments(postId, cookieValue, pageParam, limit),
      getNextPageParam: (lastPage) => {
        if (lastPage.currentPage < lastPage.totalPages) {
          return lastPage.currentPage + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
      enabled: !!postId && isTimeline && !!cookieValue,
    });
  }
}

export async function LikeUnilikeUserPost(postId: string, token: string) {
  const response: any = await client(`/userpost/likeunlike/${postId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}

export const useLikeUnlikeTimelinePost = () => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => LikeUnilikeUserPost(postId, cookieValue),

    onSuccess: (res: any, postId: string) => {
      queryClient.setQueryData(["timelinePosts"], (oldData: any) => {
        if (!oldData || !oldData.pages) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            allPosts: page.allPosts.map((post: any) =>
              post._id === postId
                ? {
                    ...post,
                    likeCount: res.likeCount,
                  }
                : post
            ),
          })),
        };
      });
    },
    onError: (res: any) => {
      Toast.show(res.response?.data.message || "Something went wrong");
    },
  });
};

export async function CreateUserPostComment(data: any, token: string) {
  const response = await client(`/userpostcomment/${data.postID}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
  return response;
}

export const useCreateUserPostComment = (isSinglePost: boolean) => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => CreateUserPostComment(data, cookieValue),

    onSuccess: () => {
      if (isSinglePost) {
        queryClient.invalidateQueries({ queryKey: ["userPosts"] });
        queryClient.invalidateQueries({ queryKey: ["timelinePosts"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["userPostComments"] });
      }
    },
    onError: (res: any) => {
      //   console.log(res.response.data.message, "res");
      Toast.show(res.response?.data.message || "Something went wrong");
    },
  });
};

export async function LikeUnlikeUserPostComment(
  UserPostCommentId: string,
  token: string
) {
  const response = await client(
    `/userpostcomment/likeUnlike/${UserPostCommentId}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response;
}

export const useLikeUnlikeUserPostComment = () => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userPostCommentId: string) =>
      LikeUnlikeUserPostComment(userPostCommentId, cookieValue),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPostComments"] });
    },
    onError: (res: any) => {
      Toast.show(res.response?.data.message || "Something went wrong");
    },
  });
};

export async function CreateUserPostCommentReply(data: any, token: string) {
  const response = await client(`/userpostcomment/${data.commentId}/replies`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
  return response;
}

export const useCreateUserPostCommentReply = (
  isNested: boolean,
  type: PostType.Community | PostType.Timeline
) => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => CreateUserPostCommentReply(data, cookieValue),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["userPostComments"] });
    },
    onError: (res: any) => {
      Toast.show(res.response?.data.message || "Something went wrong");
    },
  });
};
