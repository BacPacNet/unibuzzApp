import React, { useCallback, useRef } from "react";
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
import { useQueryClient } from "@tanstack/react-query";
import { useCreateChatMessage } from "@/services/Messages";
import { MediaImage, PagePlus, SendSolid } from "iconoir-react-native";
import { LatestMessage } from "@/types/ChatType";
import { SocketEnums } from "@/types/SocketType";
import { useSocket } from "@/context/SocketProvider/SocketProvider";
import { useUploadToS3 } from "@/services/upload";
import { useNavigation } from "@react-navigation/native";
import { useTabBarVisibility } from "@/hooks/useTabBarVisibility";
import { useMessageInput } from "./hooks/useMessageInput";
import { useMediaHandlers } from "./hooks/useMediaHandlers";
import { useMessageSubmission } from "./hooks/useMessageSubmission";
import { MessageInputActions } from "./components/MessageInputActions";
import { MediaPreviewSection } from "./components/MediaPreviewSection";
import { MessageTextInput } from "./components/MessageTextInput";
import { SubmitButton } from "./components/SubmitButton";
import { MAX_FILES } from "./constants";
import { UserMessageInputProps } from "./types";

// Main component
const UserMessageInput: React.FC<UserMessageInputProps> = ({
  chatId,
  userProfileId,
  isRequestNotAccepted,
  setCurrTab,
  setChanged,
}) => {
  const inputRef = useRef<TextInput>(null);
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const { mutateAsync: uploadToS3 } = useUploadToS3();
  const { mutate: createNewMessage, isPending } = useCreateChatMessage();

  // Custom hooks
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
  } = useMessageInput();

  const { handleImagePick, handleFilePick, handleMediaRemove } = useMediaHandlers({
    images,
    setImages,
    files,
    setFiles,
    maxFiles: MAX_FILES,
  });

  const { handleSubmit, isSubmitting } = useMessageSubmission({
    text,
    images,
    files,
    chatId,
    userProfileId,
    uploadToS3,
    createNewMessage,
    queryClient,
    socket,
    resetState,
    setChanged,
    setIsImageUploading,
    isPending,
    isImageUploading,
  });

  useTabBarVisibility(navigation);

  const handleTextChange = useCallback(
    (text: string) => {
      setText(text);
      setChanged(text);
    },
    [setText, setChanged]
  );

  const hasMedia = images.length > 0 || files.length > 0;

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
          <MediaPreviewSection
            images={images}
            files={files}
            onRemove={handleMediaRemove}
          />
        )}

        <MessageTextInput
          ref={inputRef}
          value={text}
          onChangeText={handleTextChange}
          placeholder="What's on your mind?"
        />
      </ScrollView>

      <View
        style={{ position: "absolute", bottom: 0, width: "100%" }}
        className="flex-row justify-between items-center px-2"
      >
        <MessageInputActions
          onImagePick={handleImagePick}
          onFilePick={handleFilePick}
        />

        <SubmitButton
          onPress={handleSubmit}
          disabled={isSubmitting}
          isLoading={isSubmitting}
        />
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
