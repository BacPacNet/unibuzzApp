import { useCreateUserPost } from "@/services/timeline";
import {
  DropCursorBridge,
  LinkBridge,
  PlaceholderBridge,
  RichText,
  TenTapStartKit,
  Toolbar,
  useEditorBridge,
} from "@10play/tentap-editor";
import { useFocusEffect } from "@react-navigation/native";
import { MediaImage, NavArrowLeft, PagePlus } from "iconoir-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import DocumentPicker from "react-native-document-picker";

import { replaceImage } from "@/services/uploadImage";
import { UserPostType } from "@/types/postType";
import { PostInputData } from "@/types/constant";
import { UPLOAD_CONTEXT } from "@/types/uploads";
import { useUploadToS3 } from "@/services/upload";
import { validateUploadedFiles } from "@/utils";
import { Toast } from "react-native-toast-notifications";
import MediaPreviewList from "@/components/molecules/MediaPreview";

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
const NewPost = ({ navigation }: any) => {
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
  const { mutate: CreateTimelinePost, isPending } = useCreateUserPost();
  const { mutateAsync: uploadToS3 } = useUploadToS3();
  const [postAccessType, setPostAccessType] = useState<UserPostType>(
    UserPostType.PUBLIC,
  );
  const [isPostCreating, setIsPostCreating] = useState(false);
  const [showPostType, setShowPostType] = useState(false);

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

  const handlePostVisibilityTypeChange = useCallback(
    (type: UserPostType) => {
      setPostAccessType(type);
      setShowPostType(false);
    },
    [setPostAccessType, setShowPostType],
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
    const payload: PostInputData = {
      content: cleanedText,
      PostType: postAccessType,
    };

    if (!cleanedText && !images?.length && !files?.length) {
      Toast.show("Post must contain text or at least one file.");
      return;
    }
    setIsPostCreating(true);

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
        context: UPLOAD_CONTEXT.TIMELINE,
      };

      const uploadResponse = await uploadToS3(uploadPayload);
      if (uploadResponse.success) {
        payload.imageUrl = uploadResponse.data;
      }
    }

    CreateTimelinePost(payload, {
      onSuccess: () => {
        setImages([]);
        setFiles([]);
        editor.setContent("");
        navigation.goBack();
      },
    });

    setIsPostCreating(false);
  };

  return (
    <View className="flex-1 bg-white relative">
      {/* {showPostType && (
        <View className="flex gap-2 absolute bg-white shadow-md w-48 top-16 right-24 z-40 ">
          <TouchableOpacity
            className={` ${postAccessType == UserPostType.PUBLIC ? "bg-primary-500" : ""} `}
            onPress={() => handlePostVisibilityTypeChange(UserPostType.PUBLIC)}
          >
            <Text
              className={` p-2 ${postAccessType == UserPostType.PUBLIC ? "text-white" : "text-black"} `}
            >
              PUBLIC
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={` ${postAccessType == UserPostType.FOLLOWER_ONLY ? "bg-primary-500" : ""} `}
            onPress={() =>
              handlePostVisibilityTypeChange(UserPostType.FOLLOWER_ONLY)
            }
          >
            <Text
              className={` p-2 ${postAccessType == UserPostType.FOLLOWER_ONLY ? "text-white" : "text-black"} `}
            >
              FOLLOWER ONLY
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={` ${postAccessType == UserPostType.MUTUAL ? "bg-primary-500" : ""} `}
            onPress={() => handlePostVisibilityTypeChange(UserPostType.MUTUAL)}
          >
            <Text
              className={` p-2 ${postAccessType == UserPostType.MUTUAL ? "text-white" : "text-black"} `}
            >
              MUTUAL
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={` ${postAccessType == UserPostType.ONLY_ME ? "bg-primary-500" : ""} `}
            onPress={() => handlePostVisibilityTypeChange(UserPostType.ONLY_ME)}
          >
            <Text
              className={` p-2 ${postAccessType == UserPostType.ONLY_ME ? "text-white" : "text-black"} `}
            >
              ONLY ME
            </Text>
          </TouchableOpacity>
        </View>
      )} */}
      <View className="  flex flex-row gap-4 items-center justify-between border-b border-neutral-300 p-3">
        <View className=" flex flex-row gap-4 items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <NavArrowLeft height={24} width={24} />
          </TouchableOpacity>
        </View>
        <View className="flex flex-row items-center gap-4">
          {/* <View>
            <TouchableOpacity
              onPress={() => setShowPostType(!showPostType)}
              className="bg-[#F3F2FF] px-4 py-2 rounded-lg"
            >
              <Text className="text-primary-500">Visibility</Text>
            </TouchableOpacity>
          </View> */}
          <TouchableOpacity
            onPress={() => handlePostCreate()}
            className="bg-primary-500 px-4 py-2 rounded-lg"
            disabled={isPending || isPostCreating}
          >
            {isPending || isPostCreating ? (
              <ActivityIndicator color={"white"} />
            ) : (
              <Text className={`text-center font-bold text-white`}>Post</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <SafeAreaView
        style={{ flex: 1, paddingBottom: images.length ? 120 : 20 }}
      >
        <RichText editor={editor} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            position: "absolute",
            width: "100%",
            bottom: 0,
          }}
        >
          <View className="flex flex-row gap-2 items-center">
            <TouchableOpacity onPress={handleImagePick}>
              <MediaImage height={20} width={20} color={"#a3a3a3"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFilePick}>
              <PagePlus height={20} width={20} color={"#a3a3a3"} />
            </TouchableOpacity>
          </View>
          {/* <FlatList
            data={images}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View className="relative m-2 ">
                <Image
                  source={{ uri: item.uri }}
                  className="w-24 h-24 rounded"
                />

                <TouchableOpacity
                  onPress={() => handleImageRemove(index)}
                  className="absolute top-1 right-1 bg-red-500 p-1 rounded-full"
                >
                  <Text className="text-white text-xs">X</Text>
                </TouchableOpacity>
              </View>
            )}
          /> */}
          <MediaPreviewList
            files={[...images, ...files]}
            onRemove={(index: any, isImage: boolean) =>
              handleImageRemove(index, isImage)
            }
          />
          <Toolbar editor={editor} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default NewPost;
