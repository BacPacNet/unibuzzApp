import React, { useCallback, useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import DocumentPicker from "react-native-document-picker";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateChatMessage } from "@/services/Messages";
import { MediaImage, PagePlus, SendSolid } from "iconoir-react-native";
import { LatestMessage } from "@/types/ChatType";
import { SocketEnums } from "@/types/SocketType";
import { useSocket } from "@/context/SocketProvider/SocketProvider";
import { launchImageLibrary } from "react-native-image-picker";
import { FileWithId, UPLOAD_CONTEXT } from "@/types/uploads";
import { useUploadToS3 } from "@/services/upload";
import { Toast } from "react-native-toast-notifications";
import { validateUploadedFiles } from "@/utils";
import MediaPreviewList from "../../MediaPreview";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useTabBarVisibility } from "@/hooks/useTabBarVisibility";

// Types
type Props = {
  userProfileId: string;
  chatId: string;
  isRequestNotAccepted: boolean;
  setCurrTab: (value: string) => void;
  setChanged: (value: string) => void;
};

type ImageAsset = {
  uri: string;
  fileName?: string;
  fileSize?: number;
  height?: number;
  width?: number;
  type?: string;
};

type MediaFile = {
  uri: string;
  fileName: string;
  type: string;
};

// Constants
const MAX_FILES = 4;
const MESSAGE_MERGE_THRESHOLD = 60000;

const useMessageState = () => {
  const [text, setText] = useState("");
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const resetState = useCallback(() => {
    setText("");
    setImages([]);
    setFiles([]);
    setIsImageUploading(false);
  }, []);

  return {
    text,
    setText,
    images,
    setImages,
    files,
    setFiles,
    isImageUploading,
    setIsImageUploading,
    resetState,
  };
};

// Utility functions
const mergeMessages = (
  oldMessages: LatestMessage[],
  newMessage: LatestMessage,
): LatestMessage[] => {
  if (!oldMessages.length) return [newMessage];

  const lastMsg = oldMessages[oldMessages.length - 1];
  const isDuplicate = oldMessages.findIndex(
    (msg) => msg._id === newMessage._id,
  );

  if (isDuplicate !== -1) {
    const updated = [...oldMessages];
    updated[isDuplicate] = newMessage;
    return updated;
  }

  const isSameSender = lastMsg.sender.id === newMessage.sender.id;
  const isRecent =
    new Date(newMessage.createdAt).getTime() -
      new Date(lastMsg.createdAt).getTime() <
    MESSAGE_MERGE_THRESHOLD;
  const noMedia = !lastMsg.media?.length && !newMessage.media?.length;

  if (isSameSender && isRecent && noMedia) {
    const merged = {
      ...lastMsg,
      content: `${lastMsg.content}\n${newMessage.content}`,
      createdAt: newMessage.createdAt,
    };
    return [...oldMessages.slice(0, -1), merged];
  }

  return [...oldMessages, newMessage];
};

const updateChatsList = (chats: any[], newMessage: any) => {
  const chatId = newMessage.chat;

  const updatedChats = chats.map((chat) => {
    if (chat._id === chatId._id) {
      return {
        ...chat,
        latestMessage: newMessage,
        latestMessageTime: new Date(newMessage.createdAt).getTime(),
      };
    }
    return chat;
  });

  return updatedChats.sort((a, b) => {
    const aTime =
      a.latestMessageTime > 0
        ? a.latestMessageTime
        : new Date(a.createdAt || 0).getTime();
    const bTime =
      b.latestMessageTime > 0
        ? b.latestMessageTime
        : new Date(b.createdAt || 0).getTime();
    return bTime - aTime;
  });
};

const prepareMediaFiles = (
  images: ImageAsset[],
  files: FileWithId[],
): MediaFile[] => {
  const imageFiles = images.map((image) => ({
    uri: image.uri,
    fileName: image.fileName || `upload_${Date.now()}.jpg`,
    type: image.type || "image/jpeg",
  }));

  const documentFiles = files.map((file: any) => ({
    uri: file.uri,
    fileName: file.name || `file_${Date.now()}`,
    type: file.type || "application/octet-stream",
  }));

  return [...imageFiles, ...documentFiles];
};

// Main component
const UserMessageInput = ({
  chatId,
  userProfileId,
  isRequestNotAccepted,
  setCurrTab,
  setChanged,
}: Props) => {
  const inputRef = useRef<TextInput>(null);
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const { mutateAsync: uploadToS3 } = useUploadToS3();
  const { mutate: createNewMessage, isPending } = useCreateChatMessage();

  const {
    text,
    setText,
    images,
    setImages,
    files,
    setFiles,
    isImageUploading,
    setIsImageUploading,
    resetState,
  } = useMessageState();

  useTabBarVisibility(navigation);

  const handleTextChange = useCallback(
    (text: string) => {
      setText(text);
      setChanged(text);
    },
    [setText, setChanged],
  );

  const handleImagePick = useCallback(() => {
    launchImageLibrary(
      { mediaType: "photo", selectionLimit: 0 },
      (response: any) => {
        if (!response.assets?.length) return;

        const imagesLib = response.assets.map((asset: any) => ({
          ...asset,
          size: asset.fileSize,
          type: asset.type,
        }));

        const validationResult = validateUploadedFiles(imagesLib);
        if (!validationResult.isValid) {
          Toast.show(validationResult.message);
          return;
        }

        const totalFiles = files.length + imagesLib.length;
        if (totalFiles > MAX_FILES) {
          Toast.show(`You can upload a maximum of ${MAX_FILES} files.`);
          return;
        }

        setImages((prevImages) => [...prevImages, ...response.assets]);
      },
    );
  }, [files.length, setImages]);

  const handleFilePick = useCallback(async () => {
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

      const totalFiles = res.length + images.length;
      if (totalFiles > MAX_FILES) {
        Toast.show(`You can upload a maximum of ${MAX_FILES} files.`);
        return;
      }

      setFiles(res);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error("DocumentPicker Error:", err);
      }
    }
  }, [images.length, setFiles]);

  const handleMediaRemove = useCallback(
    (identifier: number | string, isImage: boolean) => {
      if (isImage) {
        setImages((prev) => prev.filter((_, i) => i !== identifier));
      } else {
        setFiles((prev) => prev.filter((file) => file.name !== identifier));
      }
    },
    [setImages, setFiles],
  );

  const uploadMedia = useCallback(async () => {
    if (!images.length && !files.length) return null;

    const mediaFiles = prepareMediaFiles(images, files);
    const uploadPayload = {
      files: mediaFiles,
      context: UPLOAD_CONTEXT.TIMELINE,
    };

    const uploadResponse = await uploadToS3(uploadPayload);
    return uploadResponse.success ? uploadResponse.data : null;
  }, [images, files, uploadToS3]);

  const handleNewMessage = useCallback(
    async (message: string) => {
      if (!message.trim() && !files?.length && !images?.length) return;

      setIsImageUploading(true);

      try {
        const mediaData = await uploadMedia();

        const messagePayload = {
          content: message.trim(),
          chatId,
          UserProfileId: userProfileId,
          ...(mediaData && { media: mediaData }),
        };

        createNewMessage(messagePayload, {
          onSuccess: (newMessage) => {
            const chatId = newMessage.chat;
            const chats = queryClient.getQueryData(["userChats"]);

            if (Array.isArray(chats)) {
              const updatedChats = updateChatsList(chats, newMessage);
              queryClient.setQueryData(["userChats"], updatedChats);
            }

            queryClient.setQueryData(
              ["chatMessages", chatId._id],
              (oldMessages: LatestMessage[] = []) =>
                mergeMessages(oldMessages, newMessage),
            );

            socket?.emit(SocketEnums.SEND_MESSAGE, newMessage);
          },
        });

        resetState();
        setChanged("");
      } catch (err) {
        console.error("Message send failed:", err);
      } finally {
        setIsImageUploading(false);
      }
    },
    [
      files,
      images,
      uploadMedia,
      createNewMessage,
      queryClient,
      socket,
      resetState,
      setChanged,
      chatId,
      userProfileId,
      setIsImageUploading,
    ],
  );

  const handleSubmit = useCallback(() => {
    if (!text.trim() && images.length === 0 && files.length === 0) {
      return;
    }
    handleNewMessage(text);
  }, [text, images.length, files.length, handleNewMessage]);

  const hasMedia = images.length > 0 || files.length > 0;
  const isSubmitting = isPending || isImageUploading;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="bg-white rounded-2xl w-full"
    >
      <ScrollView
        style={{ height: "auto", marginBottom: 50 }}
        className="rounded-lg relative"
      >
        {hasMedia && (
          <View style={{ height: 100 }}>
            <MediaPreviewList
              files={[...images, ...files]}
              onRemove={handleMediaRemove}
            />
          </View>
        )}

        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={handleTextChange}
          placeholderTextColor={"#6B7280"}
          placeholder="What's on your mind?"
          multiline
          style={styles.input}
          className="text-base p-1"
        />
      </ScrollView>

      <View
        style={{ position: "absolute", bottom: 0, width: "100%" }}
        className="flex-row justify-between items-center px-2"
      >
        <View className="flex-row gap-4">
          <TouchableOpacity onPress={handleImagePick}>
            <MediaImage height={20} width={20} color="#a3a3a3" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFilePick}>
            <PagePlus height={20} width={20} color="#a3a3a3" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          className="bg-primary-500 w-8 h-8 flex items-center justify-center rounded-full mb-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <SendSolid height={18} width={18} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default UserMessageInput;

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    paddingHorizontal: 8,
    height: "auto",
    color: "#3A3B3C",
  },
});
