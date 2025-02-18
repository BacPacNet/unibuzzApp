import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";

// import { useCreateChatMessage, useAcceptRequest } from '@/services/Messages';

import { useQueryClient } from "@tanstack/react-query";
import { useCreateChatMessage } from "@/services/Messages";
// import { replaceImage } from '@/services/uploadImage';
import { Emoji, GifFormat, MediaImage, SendSolid } from "iconoir-react-native";
import { ChatsArray, LatestMessage } from "@/types/ChatType";
import { SocketEnums } from "@/types/SocketType";
import { useSocket } from "@/context/SocketProvider/SocketProvider";
import { getUserProfileStore, getUserStore } from "@/storage/user";
import { launchImageLibrary } from "react-native-image-picker";
import { replaceImage } from "@/services/uploadImage";

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

const UserMessageInput = ({
  chatId,
  userProfileId,
  isRequestNotAccepted,

  setCurrTab,
  setChanged,
}: Props) => {
  const inputRef = useRef(null);
  const [text, setText] = useState("");
  const [images, setImages] = useState<ImageAsset[]>([]);
  const { mutate: createNewMessage, isPending } = useCreateChatMessage();
  //   const { mutateAsync: acceptRequest, isError } = useAcceptRequest();
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const userData = getUserStore();
  const userProfileData: any = getUserProfileStore();
  const optimisticId = "abc123";

  const handleTextChange = (text: string) => {
    setText(text);
    setChanged(text);
  };

  const processImages = async (imagesData: any[]) => {
    const promises = imagesData.map((image) => replaceImage(image, ""));
    const results = await Promise.all(promises);
    return results.map((result) => ({
      imageUrl: result?.imageUrl,
      publicId: result?.publicId,
    }));
  };

  const optimisticImage = images.map((item) => ({ imageUrl: item.uri }));
  const handleSendMessage = async () => {
    const optimisticMessage = {
      _id: optimisticId,
      content: text,
      chatId,
      sender: { firstName: userData?.firstName },
      createdAt: new Date().toISOString(),
      reactions: [],
      media: optimisticImage.length > 0 ? optimisticImage : undefined,
      senderProfile: {
        profile_dp: { imageUrl: userProfileData?.profile_dp?.imageUrl },
      },
    };

    queryClient.setQueryData(
      ["chatMessages", chatId],
      (oldMessages: LatestMessage[] = []) => [...oldMessages, optimisticMessage]
    );

    let fileLinks: any = [];
    let data;

    if (images && images.length > 0) {
      fileLinks = await processImages(images);
    }

    data = {
      content: text,
      chatId,
      UserProfileId: userProfileId,
      media: fileLinks.length > 0 ? fileLinks : undefined,
    };

    createNewMessage(data, {
      onSuccess: (newMessage) => {
        queryClient.setQueryData(
          ["chatMessages", chatId],
          (oldMessages: LatestMessage[] = []) =>
            oldMessages.map((msg) =>
              msg._id === optimisticId ? newMessage : msg
            )
        );

        const chatData: ChatsArray | undefined = queryClient.getQueryData([
          "userChats",
        ]);
        if (chatData) {
          const updatedChatData = chatData.map((chat) =>
            chat._id === chatId
              ? {
                  ...chat,
                  latestMessage: newMessage,
                }
              : chat
          );

          updatedChatData.sort((a, b) => {
            const dateA = a.latestMessage?.createdAt
              ? new Date(a.latestMessage.createdAt).getTime()
              : 0;
            const dateB = b.latestMessage?.createdAt
              ? new Date(b.latestMessage.createdAt).getTime()
              : 0;
            return dateB - dateA;
          });

          queryClient.setQueryData(["userChats"], updatedChatData);
        }

        setText("");
        setChanged("");
        setImages([]);
        if (!socket) return;
        socket.emit(SocketEnums.SEND_MESSAGE, newMessage);
      },
      onError: () => {
        queryClient.setQueryData(
          ["chatMessages", chatId],
          (oldMessages: LatestMessage[] = []) =>
            oldMessages.filter((msg) => msg._id !== optimisticId)
        );
      },
    });
  };

  const handleImagePick = async () => {
    launchImageLibrary(
      { mediaType: "photo", selectionLimit: 0 },
      (response: any) => {
        if (response.assets && response.assets.length > 0) {
          setImages((prevImages) => [...prevImages, ...response.assets]);
          setChanged(response.assets.length);
        }
      }
    );
  };

  const handleImageRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!text.trim() && images.length === 0) {
      return;
    }
    handleSendMessage();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className=" bg-white rounded-2xl w-full"
    >
      <View className="border border-neutral-300 rounded-lg  relative">
        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={(text) => handleTextChange(text)}
          placeholder="What’s on your mind?"
          multiline
          style={{
            fontSize: 16,
            paddingHorizontal: 8,
            height: "auto",
            maxHeight: 3 * 24,
            overflow: "scroll",
          }}
          className="text-base p-1"
        />

        <View className="flex-row justify-between items-center px-2 ">
          <View className="flex-row gap-4">
            {/* <TouchableOpacity>
              <Emoji height={20} width={20} color={"#a3a3a3"} />
            </TouchableOpacity> */}

            <TouchableOpacity>
              <GifFormat height={20} width={20} color={"#a3a3a3"} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleImagePick}>
              <MediaImage height={20} width={20} color={"#a3a3a3"} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isPending}
            className="bg-primary-500 w-8 h-8  flex items-center justify-center rounded-full mb-2"
          >
            <SendSolid height={18} width={18} color={"white"} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={images}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View className="relative m-2 ">
            <Image source={{ uri: item.uri }} className="w-24 h-24 rounded" />

            <TouchableOpacity
              onPress={() => handleImageRemove(index)}
              className="absolute top-1 right-1 bg-red-500 p-1 rounded-full"
            >
              <Text className="text-white text-xs">X</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
};

export default UserMessageInput;
