import { getToken } from "@/storage/token";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { client } from "./api-client";
import { Toast } from "react-native-toast-notifications";

export async function getCommunityPostComments(
  postId: string,
  token: any,
  page: number,
  limit: number
) {
  const response: any = await client(
    `/communitypostcomment/${postId}?page=${page}&limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response;
}

export function useGetCommunityPostComments(
  postId: string,
  isCommunity: boolean,
  limit: number
) {
  {
    const cookieValue = getToken();

    return useInfiniteQuery({
      queryKey: ["communityPostComments"],
      queryFn: ({ pageParam = 1 }) =>
        getCommunityPostComments(postId, cookieValue, pageParam, limit),
      getNextPageParam: (lastPage) => {
        if (lastPage.currentPage < lastPage.totalPages) {
          return lastPage.currentPage + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
      enabled: !!postId && isCommunity && !!cookieValue,
    });
  }
}

export async function LikeUnilikeGroupPost(
  communityGroupPostId: string,
  token: any
) {
  const response = await client(
    `/communitypost/likeunlike/${communityGroupPostId}`,
    { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
  );
  return response;
}

export const useLikeUnilikeGroupPost = (
  communityId: string = "",
  communityGroupId: string = "",
  isTimeline: boolean
) => {
  const cookieValue = getToken();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (communityGroupPostId: any) =>
      LikeUnilikeGroupPost(communityGroupPostId, cookieValue),

    onSuccess: (res: any, communityGroupPostId) => {
      if (isTimeline) {
        queryClient.setQueryData(["timelinePosts"], (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              allPosts: page.allPosts.map((post: any) =>
                post._id === communityGroupPostId
                  ? {
                      ...post,
                      likeCount: res.likeCount,
                    }
                  : post
              ),
            })),
          };
        });
      } else {
        queryClient.setQueryData(
          ["communityGroupsPost", communityId, communityGroupId],
          (oldData: any) => {
            if (!oldData || !oldData.pages) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                finalPost: page.finalPost.map((post: any) =>
                  post._id === communityGroupPostId
                    ? {
                        ...post,
                        likeCount: res.likeCount,
                      }
                    : post
                ),
              })),
            };
          }
        );
      }
    },
    onError: (res: any) => {
      Toast.show(res.response?.data.message || "Something went wrong");
    },
  });
};

export async function CreateGroupPostComment(data: any, token: any) {
  const response = await client(`/communitypostcomment/${data.postID}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
  return response;
}

export const useCreateGroupPostComment = () => {
  const cookieValue = getToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => CreateGroupPostComment(data, cookieValue),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityPostComments"] });
    },
    onError: (res: any) => {
      // console.log(res.response.data.message, 'res')
      Toast.show(res.response?.data.message || "Something went wrong");
    },
  });
};

export async function LikeUnilikeGroupPostCommnet(
  communityGroupPostCommentId: string,
  token: any
) {
  const response = await client(
    `/communitypostcomment/likeUnlike/${communityGroupPostCommentId}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response;
}

export const useLikeUnlikeGroupPostComment = () => {
  const cookieValue = getToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (communityGroupPostCommentId: any) =>
      LikeUnilikeGroupPostCommnet(communityGroupPostCommentId, cookieValue),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityPostComments"] });
    },
    onError: (res: any) => {
      Toast.show(res.response?.data.message || "Something went wrong");
    },
  });
};

export async function CreateGroupPostCommentReply(data: any, token: any) {
  const response = await client(
    `/communitypostcomment/${data.commentId}/replies`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      data,
    }
  );
  return response;
}
export const useCreateGroupPostCommentReply = () => {
  const cookieValue = getToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => CreateGroupPostCommentReply(data, cookieValue),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityPostComments"] });
    },
    onError: (res: any) => {
      Toast.show(res.response?.data.message || "Something went wrong");
    },
  });
};
