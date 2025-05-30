import { getToken } from "@/storage/token";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { client } from "./api-client";
import { Toast } from "react-native-toast-notifications";
import { getUserStore } from "@/storage/user";

export async function deleteCommunityPost(postId: string, token: string) {
  const response = await client(`/communityPost/${postId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}

export const useDeleteCommunityPost = () => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => deleteCommunityPost(postId, cookieValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityGroupsPost"] });
      queryClient.invalidateQueries({ queryKey: ["timelinePosts"] });
    },
    onError: (res: any) => {
      Toast.show(res.response?.data.message || "Something went wrong");
    },
  });
};

export async function getCommunityPostComments(
  postId: string,
  token: any,
  page: number,
  limit: number,
) {
  const response: any = await client(
    `/communitypostcomment/${postId}?page=${page}&limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response;
}

export function useGetCommunityPostComments(
  postId: string,
  isCommunity: boolean,
  limit: number,
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
  token: any,
) {
  const response = await client(
    `/communitypost/likeunlike/${communityGroupPostId}`,
    { method: "PUT", headers: { Authorization: `Bearer ${token}` } },
  );
  return response;
}

export const useLikeUnilikeGroupPost = (
  communityId: string = "",
  communityGroupId: string = "",
  isTimeline: boolean,
  isSinglePost: boolean,
) => {
  const cookieValue = getToken() as string;
  const userData = getUserStore();
  const queryClient = useQueryClient();

  const queryKey = isTimeline
    ? ["timelinePosts"]
    : [
        "communityGroupsPost",
        communityId,
        ...(communityGroupId ? [communityGroupId] : []),
      ];

  return useMutation({
    mutationFn: (communityGroupPostId: any) =>
      LikeUnilikeGroupPost(communityGroupPostId, cookieValue),

    onMutate: async (postId: string) => {
      if (isSinglePost) {
        queryClient.setQueryData(["getPost", postId], (oldData: any) => {
          if (!oldData || !oldData.post) return oldData;

          const hasLiked = oldData.post.likeCount.some(
            (like: any) => like.userId === userData?.id,
          );

          return {
            ...oldData,
            post: {
              ...oldData.post,
              likeCount: hasLiked
                ? oldData.post.likeCount.filter(
                    (like: any) => like.userId !== userData?.id,
                  )
                : [
                    ...oldData.post.likeCount,
                    { userId: userData?.id, _id: "temp-like-id" },
                  ],
            },
          };
        });
        await queryClient.refetchQueries({ queryKey: queryKey });
      }
      //   ends
      queryClient.cancelQueries({ queryKey: queryKey });

      const previousPosts = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return;

        if (isTimeline) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              allPosts: page.allPosts.map((post: any) => {
                if (post._id !== postId) return post;

                const hasLiked = post.likeCount.some(
                  (like: any) => like.userId === userData?.id,
                );

                return {
                  ...post,
                  likeCount: hasLiked
                    ? post.likeCount.filter(
                        (like: any) => like.userId !== userData?.id,
                      )
                    : [
                        ...post.likeCount,
                        { userId: userData?.id, _id: "temp-like-id" },
                      ],
                };
              }),
            })),
          };
        } else {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              finalPost: page.finalPost.map((post: any) => {
                if (post._id !== postId) return post;

                const hasLiked = post.likeCount.some(
                  (like: any) => like.userId === userData?.id,
                );

                return {
                  ...post,
                  likeCount: hasLiked
                    ? post.likeCount.filter(
                        (like: any) => like.userId !== userData?.id,
                      )
                    : [
                        ...post.likeCount,
                        { userId: userData?.id, _id: "temp-like-id" },
                      ],
                };
              }),
            })),
          };
        }
      });
      return { previousPosts };
    },

    onError: (res: any) => {
      console.log(res.response.data.message, "res");
      Toast.show(res.response.data.message);
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

    onSuccess: (res: any) => {
      const currUserComments = queryClient.getQueryData<{
        pages: any[];
        pageParams: any[];
      }>(["communityPostComments"]);

      if (currUserComments) {
        queryClient.setQueryData(["communityPostComments"], {
          ...currUserComments,
          pages: currUserComments.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                finalComments: [res.comment, ...page.finalComments],
                totalComments: page.totalComments + 1,
              };
            }
            return page;
          }),
        });
      }

      queryClient.invalidateQueries({ queryKey: ["timelinePosts"] });
      queryClient.invalidateQueries({ queryKey: ["communityGroupsPost"] });
      queryClient.invalidateQueries({ queryKey: ["getPost"] });
    },
    onError: (res: any) => {
      // console.log(res.response.data.message, 'res')
      Toast.show(res.response?.data.message || "Something went wrong");
    },
  });
};

export async function LikeUnilikeGroupPostCommnet(
  communityGroupPostCommentId: string,
  token: any,
) {
  const response = await client(
    `/communitypostcomment/likeUnlike/${communityGroupPostCommentId}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    },
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
    },
  );
  return response;
}
// export const useCreateGroupPostCommentReply = () => {
//   const cookieValue = getToken();
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (data: any) => CreateGroupPostCommentReply(data, cookieValue),

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["communityPostComments"] });
//     },
//     onError: (res: any) => {
//       Toast.show(res.response?.data.message || "Something went wrong");
//     },
//   });
// };

export const useCreateGroupPostCommentReply = (
  showInitial: boolean,
  postId: string,
) => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => CreateGroupPostCommentReply(data, cookieValue),

    onSuccess: (data: any) => {
      const currUserComments = queryClient.getQueryData<{
        pages: any[];
        pageParams: any[];
      }>(["communityPostComments"]);

      if (showInitial) {
        queryClient.setQueryData(["getPost", postId], (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            comment: {
              ...data.commentReply,
            },
          };
        });
      }

      if (currUserComments) {
        const updatedPages = currUserComments.pages.map((page) => {
          return {
            ...page,
            finalComments: page.finalComments.map((comment: any) => {
              if (comment._id === data.commentReply._id) {
                const updatedComment = {
                  ...comment,
                  ...data.commentReply,
                  totalCount: comment.replies.length + 1,
                };

                return updatedComment;
              }

              return comment;
            }),
          };
        });

        queryClient.setQueryData(["communityPostComments"], {
          ...currUserComments,
          pages: updatedPages,
        });
      }
    },
    onError: (res: any) => {
      console.log(res.response.data.message, "res");
    },
  });
};

export async function deleteCommunityPostComment(
  postId: string,
  token: string,
) {
  const response = await client(`/communitypostcomment/${postId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}

export function useDeleteCommunityPostComment() {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) =>
      deleteCommunityPostComment(postId, cookieValue),
    onSuccess: () => {
      // Invalidate or update the specific post's comments cache
      queryClient.invalidateQueries({
        queryKey: ["communityPostComments"],
      });
      Toast.show("comment deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete comment:", error);
      Toast.show(error.message);
    },
  });
}
