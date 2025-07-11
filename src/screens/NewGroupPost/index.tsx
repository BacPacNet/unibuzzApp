import {
  DropCursorBridge,
  LinkBridge,
  PlaceholderBridge,
  RichText,
  TenTapStartKit,
  Toolbar,
  useEditorBridge,
} from "@10play/tentap-editor";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { MediaImage, PagePlus } from "iconoir-react-native";
import React, { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import {
  CommunityPostData,
  CommunityPostType,
  UserPostType,
} from "@/types/constant";
import { useCreateGroupPost } from "@/services/community-group";
import { Toast } from "react-native-toast-notifications";
import { getUserProfileStore } from "@/storage/user";
import { UPLOAD_CONTEXT } from "@/types/uploads";
import { useUploadToS3 } from "@/services/upload";
import { validateUploadedFiles } from "@/utils";
import DocumentPicker from "react-native-document-picker";
import MediaPreviewList from "@/components/molecules/MediaPreview";
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

const NewGroupPost = ({ navigation }: any) => {
  const route = useRoute();
  const { communityId, communityGroupId } = route.params as any;
  const userProfileData = getUserProfileStore();
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [files, setFiles] = useState<fileType[]>([]);
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    // initialContent: "test",
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
  const { mutate: CreateGroupPost, isPending } = useCreateGroupPost();
  const [isPostCreating, setIsPostCreating] = useState(false);

  const [postAccessType] = useState<CommunityPostType | UserPostType>(
    UserPostType.PUBLIC,
  );

  useFocusEffect(
    useCallback(() => {
      navigation.getParent().setOptions({
        tabBarStyle: { display: "none" },
      });

      return () => {
        navigation.getParent().setOptions({
          tabBarStyle: {
            display: "flex",
            backgroundColor: "white",
            height: 60,
            paddingBottom: 10,
            paddingTop: 10,
          },
        });
      };
    }, [navigation]),
  );

  const handleImagePick = useCallback(() => {
    launchImageLibrary(
      { mediaType: "photo", selectionLimit: 0 },
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

  const handleFilePick = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.docx,
          DocumentPicker.types.doc,
        ],
        allowMultiSelection: true,
      });

      const validationResult = validateUploadedFiles(
        res.map((file: any) => ({
          ...file,
          size: file.size,
          type: file.type,
        })),
      );

      if (!validationResult.isValid) {
        Toast.show(validationResult.message);
        return;
      }

      const totalFiles = files.length + images.length;
      if (totalFiles > 4) {
        Toast.show("You can upload a maximum of 4 files.");
        return;
      }

      setFiles(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User cancelled picker");
      } else {
        console.error("DocumentPicker Error:", err);
      }
    }
  };

  const handlePostCreate = async () => {
    const text = await editor.getHTML();
    const isEmpty = text.replace(/<[^>]+>/g, "").trim() === "";

    const cleanedText = isEmpty ? "" : text;
    if (!cleanedText && !images?.length && !files?.length) {
      Toast.show("Post must contain text or at least one file.");
      return;
    }
    setIsPostCreating(true);
    const basePayload: CommunityPostData = {
      content: cleanedText,
      communityPostsType: UserPostType[postAccessType as never],
      communityId,
      communityGroupId: communityGroupId || null,
      isPostVerified:
        userProfileData?.email?.some(
          (entry) => entry.communityId === communityId,
        ) || false,
    };

    if (images?.length || files?.length) {
      const mergedFiles = [
        ...(images || []).map((image) => ({
          uri: image.uri,
          fileName: image.fileName || `upload_${Date.now()}.jpg`,
          type: image.type || "image/jpeg",
        })),
        ...(files || []).map((file: any) => ({
          uri: file.uri,
          fileName: file.name || `file_${Date.now()}`,
          type: file.type || "application/octet-stream",
        })),
      ];

      const uploadPayload = {
        files: mergedFiles,
        context: UPLOAD_CONTEXT.COMMUNITY,
      };

      const uploadResponse = await uploadToS3(uploadPayload);
      if (uploadResponse.success) {
        basePayload.imageUrl = uploadResponse.data;
      }
    }

    CreateGroupPost(basePayload, {
      onSuccess: () => {
        handleBack();
        setImages([]);
        setFiles([]);
        editor.setContent("");
      },
    });

    // handleBack();
    setIsPostCreating(false);
  };

  const handleBack = () => {
    if (communityId && communityGroupId) {
      navigation.navigate("CommunityGroup", {
        communityId: communityId,
        communityGroupId: communityGroupId,
      });
    }
    if (communityId && !communityGroupId) {
      navigation.navigate("Community", { communityId: communityId });
    }
  };

  return (
    <View className="flex-1 bg-white relative">
      <View
        style={{ paddingBottom: 16 }}
        className="  flex flex-row gap-4 items-center justify-between border-b border-neutral-300"
      >
        <BackHeader
          label="New Post"
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
            onPress={handlePostCreate}
            disabled={isPending || isPostCreating}
            isLoading={isPending || isPostCreating}
          />
        </View>
      </View>
      <SafeAreaView
        style={{ flex: 1, paddingBottom: images.length ? 120 : 20 }}
      >
        {(images.length > 0 || files.length > 0) && (
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
            <TouchableOpacity onPress={handleFilePick}>
              <PagePlus height={20} width={20} color={"#a3a3a3"} />
            </TouchableOpacity>
          </View>

          <Toolbar editor={editor} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default NewGroupPost;

const styles = StyleSheet.create({
  editorHeight: {
    flex: 1,
    paddingHorizontal: 8,
  },
});
