export enum ContentType {
  USER_POST = "USER_POST",
  COMMUNITY_POST = "COMMUNITY_POST",
  COMMUNITY_GROUP_POST = "COMMUNITY_GROUP_POST",
  USER_COMMENT = "USER_COMMENT",
  COMMUNITY_COMMENT = "COMMUNITY_COMMENT",
  COMMUNITY_GROUP_COMMENT = "COMMUNITY_GROUP_COMMENT",
  USER_REPLY = "USER_REPLY",
  COMMUNITY_REPLY = "COMMUNITY_REPLY",
  COMMUNITY_GROUP_REPLY = "COMMUNITY_GROUP_REPLY",
}

export type ReportContentModalProps = {
  postID: string;
  reporterId: string;
  contentType: ContentType;
  commentId?: string;
  parentCommentId?: string;
};
