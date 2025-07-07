export type UploadContextType =
  | "timeline"
  | "community"
  | "community_group"
  | "post_comment"
  | "message"
  | "group_dp"
  | "dp"
  | "cover_dp";

export enum UPLOAD_CONTEXT {
  TIMELINE = "timeline",
  COMMUNITY = "community",
  COMMUNITY_GROUP = "community_group",
  POST_COMMENT = "post_comment",
  MESSAGE = "message",
  GROUP_DP = "group_dp",
  DP = "dp",
  COVER_DP = "cover_dp",
}

export type FileWithId = {
    uri: string;
    name?: string | null;
    size?: number | null;
  
    type?: string | null;
  };
