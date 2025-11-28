import { getMixpanel } from "@/context/MixPanelProvider/MixPanelProvidex";
import { TRACK_EVENT } from "@/content/constant";
import { getMimeTypeFromUrl, imageMimeTypes } from "@/utils";

export const trackMixpanel = (event: string, data: any) => {
  getMixpanel()?.track(event, data);
};

export const trackCommunityGroupPostCommentReplyLike = (
  postId: string,
  commentId: string,
  level: string,
  communityId: string,
  communityGroupId: string
) => {
  getMixpanel()?.track(TRACK_EVENT.COMMUNITY_GROUP_POST_COMMENT_REPLY_LIKE, {
    postId: postId,
    commentId: commentId,
    level: level,
    communityId: communityId,
    communityGroupId: communityGroupId,
    source: "community_group_post_comment_reply",
  });
};

export const trackCommunityPostCommentReplyLike = (
  postId: string,
  commentId: string,
  level: string,
  communityId: string
) => {
  getMixpanel()?.track(TRACK_EVENT.COMMUNITY_POST_COMMENT_REPLY_LIKE, {
    postId: postId,
    commentId: commentId,
    level: level,
    communityId: communityId,
    source: "community_post_comment_reply",
  });
};

export const trackCommunityGroupPostCommentLike = (
  postId: string,
  commentId: string,
  level: string,
  communityId: string,
  communityGroupId: string
) => {
  getMixpanel()?.track(TRACK_EVENT.COMMUNITY_GROUP_POST_COMMENT_LIKE, {
    postId: postId,
    commentId: commentId,
    level: level,
    communityId: communityId,
    communityGroupId: communityGroupId,
    source: "community_group_post_comment",
  });
};

export const trackCommunityPostCommentLike = (
  postId: string,
  commentId: string,
  level: string,
  communityId: string
) => {
  getMixpanel()?.track(TRACK_EVENT.COMMUNITY_POST_COMMENT_LIKE, {
    postId: postId,
    commentId: commentId,
    level: level,
    communityId: communityId,
    source: "community_post_comment",
  });
};

export const trackCommunityPostButtonClick = (
  buttonName: string,
  communityId: string,
  communityGroupId?: string
) => {
  if (communityGroupId && communityGroupId.length > 0) {
    trackMixpanel(TRACK_EVENT.COMMUNITY_GROUP_POST_BUTTON_CLICK, {
      buttonName,
      communityId,
      communityGroupId,
    });
  } else {
    trackMixpanel(TRACK_EVENT.COMMUNITY_POST_BUTTON_CLICK, {
      buttonName,
      communityId,
    });
  }
};

export const trackCommunityPostTextEdit = (
  textEdit: string,
  communityId: string,
  communityGroupId?: string
) => {
  if (communityGroupId && communityGroupId.length > 0) {
    trackMixpanel(TRACK_EVENT.COMMUNITY_GROUP_POST_TEXT_EDIT, {
      textEdit,
      communityId,
      communityGroupId,
    });
  } else {
    trackMixpanel(TRACK_EVENT.COMMUNITY_POST_TEXT_EDIT, {
      textEdit,
      communityId,
    });
  }
};

export const trackPostUploads = (data: Array<{ imageUrl: string | null }>) => {
  if (!data || data.length === 0) return;

  const imageItems =
    data.filter(
      (item: { imageUrl: string | null }) =>
        item.imageUrl &&
        imageMimeTypes.includes(getMimeTypeFromUrl(item.imageUrl))
    ) || [];
  const fileItems =
    data.filter(
      (item: { imageUrl: string | null }) =>
        item.imageUrl &&
        !imageMimeTypes.includes(getMimeTypeFromUrl(item.imageUrl))
    ) || [];

  if (imageItems?.length > 0) {
    imageItems?.forEach((item) => {
      trackMixpanel(TRACK_EVENT.USER_POST_IMAGE_UPLOAD, {
        imageUrl: item.imageUrl,
      });
    });
  }

  if (fileItems?.length > 0) {
    fileItems?.forEach((item) => {
      trackMixpanel(TRACK_EVENT.USER_POST_FILE_UPLOAD, {
        fileUrl: item.imageUrl,
      });
    });
  }
};

export const trackCommunityPostUploads = (
  data: Array<{ imageUrl: string | null }>,
  communityId: string,
  communityGroupId?: string
) => {
  if (!data || data.length === 0) return;

  const imageItems =
    data.filter(
      (item: { imageUrl: string | null }) =>
        item.imageUrl &&
        imageMimeTypes.includes(getMimeTypeFromUrl(item.imageUrl))
    ) || [];
  const fileItems =
    data.filter(
      (item: { imageUrl: string | null }) =>
        item.imageUrl &&
        !imageMimeTypes.includes(getMimeTypeFromUrl(item.imageUrl))
    ) || [];

  const hasCommunityGroupId = communityGroupId && communityGroupId.length > 0;

  if (imageItems?.length > 0) {
    imageItems?.forEach((item) => {
      trackMixpanel(
        hasCommunityGroupId
          ? TRACK_EVENT.COMMUNITY_GROUP_POST_IMAGE_UPLOAD
          : TRACK_EVENT.COMMUNITY_POST_IMAGE_UPLOAD,
        {
          imageUrl: item.imageUrl,
        }
      );
    });
  }

  if (fileItems?.length > 0) {
    fileItems?.forEach((item) => {
      trackMixpanel(
        hasCommunityGroupId
          ? TRACK_EVENT.COMMUNITY_GROUP_POST_FILE_UPLOAD
          : TRACK_EVENT.COMMUNITY_POST_FILE_UPLOAD,
        {
          fileUrl: item.imageUrl,
        }
      );
    });
  }
};

export const trackCommunityPostLike = (
  postId: string,
  communityId: string,
  isSinglePost: boolean,
  isTimeline: boolean,
  communityGroupId?: string
) => {
  const hasCommunityGroupId = communityGroupId && communityGroupId.length > 0;

  let source: string;
  if (isSinglePost) {
    source = "single_post";
  } else if (isTimeline) {
    source = "timeline_post";
  } else if (hasCommunityGroupId) {
    source = "community_group_post";
  } else {
    source = "community_post";
  }

  trackMixpanel(
    hasCommunityGroupId
      ? TRACK_EVENT.COMMUNITY_GROUP_POST_LIKE
      : TRACK_EVENT.COMMUNITY_POST_LIKE,
    {
      postId,
      communityId,
      ...(hasCommunityGroupId ? { communityGroupId } : {}),
      source,
    }
  );
};
