import { getToken } from "@/storage/token";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { client } from "./api-client";
import { Toast } from "react-native-toast-notifications";

import { PostCommentData, Sortby } from "@/types/constant";
import { getUserStore } from "@/storage/user";

export async function getAllTimelinePosts(
  token: string,
  page: number,
  limit: number,
) {
  const response: any = await client(
    `/userpost/timeline?page=${page}&limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` } },
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
      Toast.show("Post deleted successfully", {
        type: "success",
        placement: "top",
      });
    },
    onError: (error: any) => {
      Toast.show(error.response?.data.message || "Something went wrong", {
        type: "danger",
        placement: "top",
      });
    },
  });
};

// comments

export async function getUserPostComments(
  postId: string,
  token: string,
  page: number,
  limit: number,
  sortby: Sortby,
) {
  const response: any = await client(
    `/userpostcomment/${postId}?page=${page}&limit=${limit}&sortBy=${sortby}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response;
}

export function useGetUserPostComments(
  postId: string,
  isTimeline: boolean,
  limit: number,
  sortby: Sortby,
) {
  {
    const cookieValue = getToken() as string;

    return useInfiniteQuery({
      queryKey: ["userPostComments",sortby],
      queryFn: ({ pageParam = 1 }) =>
        getUserPostComments(postId, cookieValue, pageParam, limit, sortby),
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
  const response: any = await client(`/userpost/likes/${postId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}

export const useLikeUnlikeTimelinePost = (
  source: string,
  adminId: string,
  isSinglePost: boolean,
) => {
  const cookieValue = getToken() as string;
  const userData = getUserStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => LikeUnilikeUserPost(postId, cookieValue),
    onMutate: async (postId: string) => {
        const queryKey = isSinglePost ? ['getPost', postId] : source === 'profile' ? ['userPosts', adminId] : ['timelinePosts']
        await queryClient.cancelQueries({ queryKey })
  
        queryClient.setQueryData(queryKey, (oldData: any) => {
          if (!oldData) return
  
          console.log(oldData, 'oldData')
          const toggleLike = (likeCount: any[]) => {
            const hasLiked = likeCount.some((like: any) => like.userId === userData?.id)
            return hasLiked
              ? likeCount.filter((like: any) => like.userId !== userData?.id)
              : [...likeCount, { userId: userData?.id, _id: 'temp-like-id' }]
          }
  
          if (isSinglePost) {
            return {
              post: {
                ...oldData.post,
                likeCount: toggleLike(oldData.post.likeCount),
              },
            }
          }
  
          const updatePosts = (posts: any[], key: string) => {
            return posts.map((post: any) => {
              if (post._id !== postId) return post
              return {
                ...post,
                likeCount: toggleLike(post.likeCount),
              }
            })
          }
  
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              ...(source === 'profile' ? { data: updatePosts(page.data, 'data') } : { allPosts: updatePosts(page.allPosts, 'allPosts') }),
            })),
          }
        })
      },
    onSuccess: (data, postId) => {
      // Invalidate queries to ensure data consistency
      const queryKey = isSinglePost ? ['getPost', postId] : source === 'profile' ? ['userPosts', adminId] : ['timelinePosts']
      queryClient.invalidateQueries({ queryKey })
    },
    onSettled: (data, error, postId) => {
      // Additional invalidation to ensure UI is updated
      const queryKey = isSinglePost ? ['getPost', postId] : source === 'profile' ? ['userPosts', adminId] : ['timelinePosts']
      queryClient.invalidateQueries({ queryKey })
    },
    onError: (res: any) => {
      return Toast.show(res.response.data.message);
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

export const useCreateUserPostComment = (sortby: Sortby) => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostCommentData) =>
      CreateUserPostComment(data, cookieValue),

    onSuccess: (res: any) => {
      const currUserComments = queryClient.getQueryData<{
        pages: any[];
        pageParams: any[];
      }>(["userPostComments",sortby]);

      if (currUserComments) {
        queryClient.setQueryData(["userPostComments",sortby], {
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
        queryClient.invalidateQueries({ queryKey: ["timelinePosts"] });
        queryClient.invalidateQueries({ queryKey: ["getPost"] });
      }
    },
    onError: (res: any) => {
      console.log(res.response.data.message, "res");
    },
  });
};

export async function LikeUnlikeUserPostComment(
  UserPostCommentId: string,
  token: string,
  sortby: Sortby,
) {
  const response = await client(
    `/userpostcomment/likeUnlike/${UserPostCommentId}?sortBy=${sortby}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response;
}

export const useLikeUnlikeUserPostComment = (
  showInitial: boolean,
  postId: string,
  sortby: Sortby,
) => {
  const cookieValue = getToken() as string;
  const userData = getUserStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userPostCommentId,
      level,
    }: {
      userPostCommentId: string;
      level: string;
    }) => LikeUnlikeUserPostComment(userPostCommentId, cookieValue, sortby),
    onSuccess: (_, variables) => {
      const { userPostCommentId, level } = variables;
      const currUserComments = queryClient.getQueryData<{
        pages: any[];
        pageParams: any[];
      }>(["userPostComments",sortby]);
   
      if (showInitial) {
        const singlePostData: any = queryClient.getQueryData([
          "getPost",
          postId,
        ]);

     
        
        if (singlePostData?.comment) {
          const comment = singlePostData.comment;

          if (level === "0" && comment._id === userPostCommentId) {
            const hasLiked = comment.likeCount.some(
              (like: any) => like.userId === userData?.id,
            );

            const updatedComment = {
              ...comment,
              likeCount: hasLiked
                ? comment.likeCount.filter(
                    (like: any) => like.userId !== userData?.id,
                  )
                : [...comment.likeCount, { userId: userData?.id }],
            };

            queryClient.setQueryData(["getPost", postId], {
              ...singlePostData,
              comment: updatedComment,
            });
          }

          if (level === "1") {
            const updatedReplies = comment.replies.map((reply: any) => {
              if (reply._id === userPostCommentId) {
                const hasLiked = reply.likeCount.some(
                  (like: any) => like.userId === userData?.id,
                );

                return {
                  ...reply,
                  likeCount: hasLiked
                    ? reply.likeCount.filter(
                        (like: any) => like.userId !== userData?.id,
                      )
                    : [...reply.likeCount, { userId: userData?.id }],
                };
              }
              return reply;
            });

            queryClient.setQueryData(["getPost", postId], {
              ...singlePostData,
              comment: {
                ...comment,
                replies: updatedReplies,
              },
            });
          }
        }
      }

      //   single end
      if (currUserComments) {
        queryClient.setQueryData(["userPostComments",sortby], {
          ...currUserComments,
          pages: currUserComments.pages.map((page) => {
            return {
              ...page,
              finalComments: page.finalComments.map((comment: any) => {
                if (level === "0" && comment._id === userPostCommentId) {
                  const hasLiked = comment.likeCount.some(
                    (like: any) => like.userId === userData?.id,
                  );

                  return {
                    ...comment,
                    likeCount: hasLiked
                      ? comment.likeCount.filter(
                          (like: any) => like.userId !== userData?.id,
                        )
                      : [...comment.likeCount, { userId: userData?.id }],
                  };
                }

                if (level === "1") {
                  return {
                    ...comment,
                    replies: comment.replies.map((reply: any) => {
                      if (reply._id === userPostCommentId) {
                        const hasLiked = reply.likeCount.some(
                          (like: any) => like.userId === userData?.id,
                        );

                        return {
                          ...reply,
                          likeCount: hasLiked
                            ? reply.likeCount.filter(
                                (like: any) => like.userId !== userData?.id,
                              )
                            : [...reply.likeCount, { userId: userData?.id }],
                        };
                      }
                      return reply;
                    }),
                  };
                }

                return comment;
              }),
            };
          }),
        });
      }
    },
    onError: (res: any) => {
      console.log(res.response.data.message, "res");
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
  showInitial: boolean,
  postId: string,
  sortby: Sortby
) => {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostCommentData) =>
      CreateUserPostCommentReply(data, cookieValue),

    onSuccess: (data: any) => {
      const currUserComments = queryClient.getQueryData<{
        pages: any[];
        pageParams: any[];
      }>(["userPostComments",sortby]);
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

        queryClient.setQueryData(["userPostComments",sortby], {
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

export async function deleteUserPostComment(postId: string, token: string) {
  const response = await client(`/userpostcomment/${postId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}
export function useDeleteUserPostComment() {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deleteUserPostComment(postId, cookieValue),
    onSuccess: () => {
      // Invalidate or update the specific post's comments cache
      queryClient.invalidateQueries({
        queryKey: ["userPostComments"],
      });
      Toast.show("comment deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete comment:", error);
      Toast.show(error.message);
    },
  });
}
