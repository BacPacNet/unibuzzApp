import {
  DropCursorBridge,
  LinkBridge,
  PlaceholderBridge,
  RichText,
  TenTapStartKit,
  Toolbar,
  useEditorBridge,
} from "@10play/tentap-editor";

import { MediaImage } from "iconoir-react-native";
import React, { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { PostCommentData } from "@/types/constant";

import { Toast } from "react-native-toast-notifications";
import { getUserProfileStore } from "@/storage/user";
import { UPLOAD_CONTEXT } from "@/types/uploads";
import { useUploadToS3 } from "@/services/upload";
import { validateUploadedFiles } from "@/utils";

import MediaPreviewList from "@/components/molecules/MediaPreview";
import {
  useCreateGroupPostComment,
  useCreateGroupPostCommentReply,
} from "@/services/communityPost";
import { PostType } from "@/types/postType";
import {
  useCreateUserPostComment,
  useCreateUserPostCommentReply,
} from "@/services/timeline";
import BackHeader from "@/components/atoms/BackHeader";
import ReusableButton from "@/components/atoms/ReusableButton";

type ImageAsset = {
  uri: string;
  fileName?: string;
  fileSize?: number;
  height?: number;
  width?: number;
  type?: string;
};

type fileType = {
  uri: string;
  name?: string | null;
  size?: number | null;

  type?: string | null;
};

type Props = {
  postId: string;
  type: PostType.Community | PostType.Timeline;
  adminID: string;
  setModalVisible: (value: boolean) => void;
  level: boolean;
  commentData: {
    commentId: string;
    name: string;
    profileDp: string;
  };
  postAuthorName: string;
  showInitial: boolean;
  setShowReply: (value: boolean) => void;
};

const NewComment = ({
  setModalVisible,
  adminID,
  postId,
  type,
  level,
  commentData,
  postAuthorName,
  showInitial,
  setShowReply,
}: Props) => {
  const userProfileData = getUserProfileStore();
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [files, setFiles] = useState<fileType[]>([]);
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    bridgeExtensions: [
      ...TenTapStartKit,
      PlaceholderBridge.configureExtension({
        placeholder: "Hey there! Start typing...",
      }),
      LinkBridge.configureExtension({ openOnClick: false }),
      DropCursorBridge.configureExtension({
        color: "#84affe",
        width: 2,
      }),
    ],
  });
  const { mutateAsync: uploadToS3 } = useUploadToS3();

  const {
    mutateAsync: mutateUserPostComment,
    isPending: isUserPostCommentPending,
  } = useCreateUserPostComment();
  const {
    mutateAsync: CreateUserPostCommentReply,
    isPending: CreateUserPostCommentReplyLoading,
  } = useCreateUserPostCommentReply(showInitial, postId || "");

  const {
    mutateAsync: mutateGroupPostComment,
    isPending: isGroupPostCommentPending,
  } = useCreateGroupPostComment();
  const {
    mutateAsync: CreateGroupPostCommentReply,
    isPending: useCreateGroupPostCommentReplyLoading,
  } = useCreateGroupPostCommentReply(showInitial, postId || "");
  const [isPostCreating, setIsPostCreating] = useState(false);

  const handleImagePick = useCallback(() => {
    launchImageLibrary(
      { mediaType: "photo", selectionLimit: 1 },
      (response: any) => {
        if (response.assets && response.assets.length > 0) {
          const images = response.assets.map((asset: any) => ({
            ...asset,
            size: asset.fileSize,
            type: asset.type,
          }));
          const validationResult = validateUploadedFiles(images);

          if (!validationResult.isValid) {
            Toast.show(validationResult.message);
            return;
          }

          const totalFiles = files.length + images.length;
          if (totalFiles > 4) {
            Toast.show("You can upload a maximum of 4 files.");
            return;
          }
          setImages((prevImages) => [...prevImages, ...response.assets]);
        }
      },
    );
  }, []);

  const handleImageRemove = useCallback(
    (identifier: number | string, isImage: boolean) => {
      if (isImage) {
        setImages((prev) => prev.filter((_, i) => i !== identifier));
      } else {
        setFiles((prev) => prev.filter((file) => file.name !== identifier));
      }
    },
    [],
  );

  const handleComment = async () => {
    // const text = await editor.getHTML();
    const text = await editor.getHTML();
    const isEmpty = text.replace(/<[^>]+>/g, "").trim() === "";

    const cleanedText = isEmpty ? "" : text;

    if (!cleanedText && !images?.length) {
      Toast.show("Post must contain text or at least one file.");
      return;
    }
    setIsPostCreating(true);
    const payload: PostCommentData = {
      content: cleanedText,
      commenterProfileId: userProfileData?._id || "",
      postID: postId,
    };

    if (images?.length) {
      const uploadPayload = {
        files: images,
        context: UPLOAD_CONTEXT.POST_COMMENT,
      };
      const imageData = await uploadToS3(uploadPayload);
      payload.imageUrl = imageData.data;
    }

    if (type === PostType.Timeline) {
      if (level) {
        payload.level = 0;
        payload.commentId = commentData?.commentId;
        const res = await CreateUserPostCommentReply(payload);

        setShowReply(res?.commentReply?._id);
      } else {
        await mutateUserPostComment(payload);
      }
    } else if (type === PostType.Community) {
      if (level) {
        payload.level = 0;

        payload.commentId = commentData?.commentId;
        const res = await CreateGroupPostCommentReply(payload);
        setShowReply(res?.commentReply?._id);
      } else {
        payload.adminId = adminID;
        await mutateGroupPostComment(payload);
      }
    }
    setModalVisible(false);
    setIsPostCreating(false);
  };

  const handleBack = () => {
    setModalVisible(false);
  };

  return (
    <View className="flex-1 bg-white relative">
      <View
        style={{ paddingBottom: 16 }}
        className="  flex flex-row gap-4 items-center justify-between border-b border-neutral-300 "
      >
        <BackHeader
          label={postAuthorName + " post"}
          onPress={() => handleBack()}
          isLeftPadding={false}
        />
        <View
          style={{ marginTop: 16 }}
          className="flex flex-row items-center gap-4 px-4"
        >
          <ReusableButton
            variant="primary"
            size={58}
            height="small"
            buttonText="Post"
            onPress={handleComment}
            isLoading={isPostCreating}
          />
        </View>
      </View>
      <SafeAreaView style={{ flex: 1, paddingBottom: 80 }}>
        <Text
          style={styles.padingHorizontal}
          className="text-sm text-primary-500  "
        >
          {level
            ? `Replying to ${commentData.name}`
            : `Commenting on ${postAuthorName} post`}
        </Text>

        {images.length > 0 && (
          <View style={{ height: 100 }}>
            <MediaPreviewList
              files={[...images, ...files]}
              onRemove={(index: any, isImage: boolean) =>
                handleImageRemove(index, isImage)
              }
            />
          </View>
        )}

        <View style={styles.editorHeight}>
          <RichText editor={editor} />
        </View>

        {/* <RichText  editor={editor} /> */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            position: "absolute",
            width: "100%",
            bottom: 0,
          }}
        >
          <View className="flex flex-row gap-2 items-center border-t border-neutral-300 p-2">
            <TouchableOpacity onPress={handleImagePick}>
              <MediaImage height={20} width={20} color={"#a3a3a3"} />
            </TouchableOpacity>
          </View>

          <Toolbar editor={editor} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default NewComment;

const styles = StyleSheet.create({
  padingHorizontal: {
    paddingHorizontal: 8,
  },
  editorHeight: {
    flex: 1,
    paddingHorizontal: 8,
  },
});
