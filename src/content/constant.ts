export const MESSAGES = {
  SOMETHING_WENT_WRONG: "Something went wrong",
  GROUP_NOT_FOUND: "Group Not Found",
  GROUP_NOT_FOUND_DESCRIPTION:
    "The group you're looking for doesn't exist or may have been removed by the admin.",
  USER_NOT_FOUND: "User Not Found",
  USER_NOT_FOUND_DESCRIPTION:
    "The user you’re looking for can’t be found or may have deleted their account.",

  POST_NOT_FOUND: "Post Not Found",
  POST_NOT_FOUND_DESCRIPTION:
    "The post you're looking for doesn't exist or may have been removed by the user.",
};
export const verifyUniversityEmailMessage =
  "You need to verify your university email to join private groups";

export const REGION = [
  "Asia",
  "Africa",
  "North America",
  "South America",
  "Europe",
  "Australia",
].sort();

export enum TRACK_EVENT {
  PAGE_VIEW = "page_view",
  SIGN_IN = "sign_in",
  SIGN_UP = "sign_up",
  SIGN_OUT = "sign_out",

  //   post events
  USER_POST_TEXT_EDIT = "user_post_text_edit",
  USER_POST_BUTTON_CLICK = "user_post_button_click",
  USER_POST_FILE_UPLOAD = "user_post_file_upload",
  USER_POST_IMAGE_UPLOAD = "user_post_image_upload",
  USER_POST_LIKE = "user_post_like",
  USER_POST_COMMENT_LIKE = "user_post_comment_like",
  USER_POST_COMMENT_REPLY_LIKE = "user_post_comment_reply_like",
  USER_POST_COMMENT_CREATE = "user_post_comment_create",
  USER_POST_COMMENT_REPLY_CREATE = "user_post_comment_reply_create",

  COMMUNITY_POST_TEXT_EDIT = "community_post_text_edit",
  COMMUNITY_POST_BUTTON_CLICK = "community_post_button_click",
  COMMUNITY_POST_FILE_UPLOAD = "community_post_file_upload",
  COMMUNITY_POST_IMAGE_UPLOAD = "community_post_image_upload",
  COMMUNITY_POST_LIKE = "community_post_like",
  COMMUNITY_POST_COMMENT_LIKE = "community_post_comment_like",
  COMMUNITY_POST_COMMENT_REPLY_LIKE = "community_post_comment_reply_like",
  COMMUNITY_POST_COMMENT_CREATE = "community_post_comment_create",
  COMMUNITY_POST_COMMENT_REPLY_CREATE = "community_post_comment_reply_create",

  COMMUNITY_GROUP_POST_TEXT_EDIT = "community_group_post_text_edit",
  COMMUNITY_GROUP_POST_BUTTON_CLICK = "community_group_post_button_click",
  COMMUNITY_GROUP_POST_FILE_UPLOAD = "community_group_post_file_upload",
  COMMUNITY_GROUP_POST_IMAGE_UPLOAD = "community_group_post_image_upload",
  COMMUNITY_GROUP_POST_LIKE = "community_group_post_like",
  COMMUNITY_GROUP_POST_COMMENT_LIKE = "community_group_post_comment_like",
  COMMUNITY_GROUP_POST_COMMENT_REPLY_LIKE = "community_group_post_comment_reply_like",
  COMMUNITY_GROUP_POST_COMMENT_CREATE = "community_group_post_comment_create",
  COMMUNITY_GROUP_POST_COMMENT_REPLY_CREATE = "community_group_post_comment_reply_create",

  //   message events
  MESSAGE_IMAGE_UPLOAD = "message_image_upload",
  MESSAGE_FILE_UPLOAD = "message_file_upload",
  MESSAGE_PAGE_VIEW = "message_page_view",
  NEW_INDIVIDUAL_CHAT = "new_individual_chat",
  NEW_GROUP_CHAT = "new_group_chat",

  //   university community events
  UNIVERSITY_COMMUNITY_PAGE_VIEW = "university_community_page_view",
  UNIVERSITY_COMMUNITY_PAGE_VIEW_DURATION = "university_community_page_view_duration",

  //   groups events
  SIDEBAR_GROUP_FILTER = "sidebar_group_filter",
  COMMUNITY_GROUP_PAGE_VIEW = "community_group_page_view",
  COMMUNITY_GROUP_PAGE_VIEW_DURATION = "community_group_page_view_duration",
  NEW_COMMUNITY_GROUP = "new_community_group",

  //   register page events
  REGISTER_PAGE_VIEW_DURATION = "register_page_view_duration",
  UNIVERSITY_VERIFICATION_STEP_VIEW_DURATION = "university_verification_step_view_duration",
}
