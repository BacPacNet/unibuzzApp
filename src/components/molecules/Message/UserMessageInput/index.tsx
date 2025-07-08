import React, { useCallback, useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import DocumentPicker from "react-native-document-picker";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateChatMessage } from "@/services/Messages";
import { MediaImage, PagePlus, SendSolid, Xmark } from "iconoir-react-native";
import { LatestMessage } from "@/types/ChatType";
import { SocketEnums } from "@/types/SocketType";
import { useSocket } from "@/context/SocketProvider/SocketProvider";
import { launchImageLibrary } from "react-native-image-picker";
import { FileWithId, UPLOAD_CONTEXT } from "@/types/uploads";
import { useUploadToS3 } from "@/services/upload";
import { Toast } from "react-native-toast-notifications";
import { validateUploadedFiles } from "@/utils";

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
  const [files, setFiles] = useState<FileWithId[]>([])
  
  const { mutateAsync: uploadToS3 } = useUploadToS3();
  const [isImageUploading, setIsImageUploading] = useState(false)
  const { mutate: createNewMessage, isPending } = useCreateChatMessage();
  const queryClient = useQueryClient();
  const { socket } = useSocket();


  const handleTextChange = (text: string) => {
    setText(text);
    setChanged(text);
  };







const handleNewMessage = async (message: string) => {
    if (!message.trim() && !files?.length && !images?.length) return

    setIsImageUploading(true)

    try {
      let mediaData = null

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
            mediaData = uploadResponse.data
          }
        }
     
      
      

      const messagePayload = {
        content: message.trim(),
        chatId,
        UserProfileId: userProfileId,
        ...(mediaData && { media: mediaData }),
      }

      createNewMessage(messagePayload, {
        onSuccess: (newMessage) => {
          const chatId = newMessage.chat
          const chats = queryClient.getQueryData(['userChats'])

          if (!Array.isArray(chats)) return

          const updatedChats = chats.map((chat) => {
            if (chat._id === chatId._id) {
              return {
                ...chat,
                latestMessage: newMessage,
                latestMessageTime: new Date(newMessage.createdAt).getTime(),
              }
            }
            return chat
          })

          updatedChats.sort((a, b) => {
            const aTime = a.latestMessageTime > 0 ? a.latestMessageTime : new Date(a.createdAt || 0).getTime()

            const bTime = b.latestMessageTime > 0 ? b.latestMessageTime : new Date(b.createdAt || 0).getTime()

            return bTime - aTime
          })

          queryClient.setQueryData(['userChats'], updatedChats)
          //  chat end

          queryClient.setQueryData(['chatMessages', chatId._id], (oldMessages: LatestMessage[] = []) => {
            if (!oldMessages.length) return [newMessage]
            const lastMsg = oldMessages[oldMessages.length - 1]

            const isDuplicate = oldMessages.findIndex((msg) => msg._id === newMessage._id)

            if (isDuplicate !== -1) {
              const updated = [...oldMessages]
              updated[isDuplicate] = newMessage
              return updated
            }

            const isSameSender = lastMsg.sender.id === newMessage.sender.id
            const isRecent = new Date(newMessage.createdAt).getTime() - new Date(lastMsg.createdAt).getTime() < 60000
            const noMedia = !lastMsg.media?.length && !newMessage.media?.length

            if (isSameSender && isRecent && noMedia) {
              const merged = {
                ...lastMsg,
                content: `${lastMsg.content}\n${newMessage.content}`,
                createdAt: newMessage.createdAt,
              }
              return [...oldMessages.slice(0, -1), merged]
            }

            return [...oldMessages, newMessage]
          })
          socket?.emit(SocketEnums.SEND_MESSAGE, newMessage)
        },
      })
      setText("");
        setChanged("");
        setImages([]);
    } catch (err) {
      console.error('Message send failed:', err)
    } finally {
      setIsImageUploading(false)
      setFiles([])
    }
  }

  const handleImagePick = useCallback(() => {
    setImages([])
    launchImageLibrary(
      { mediaType: "photo", selectionLimit: 0 },
      (response: any) => {
        if (response.assets && response.assets.length > 0) {
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
         
          const totalFiles = files.length  + imagesLib.length;
          
          
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

      const totalFiles = res.length + images.length;
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


  const handleSubmit = async () => {
    console.log("images.length",images.length);
    
    if (!text.trim() && images.length === 0 && files.length === 0) {
      return;
    }
    handleNewMessage(text);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className=" bg-white rounded-2xl w-full  "
    >
      <ScrollView style={{height: "auto",marginBottom:50}} className=" rounded-lg  relative ">
      <FlatList
        data={images}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View className="relative m-2 ">
            <Image source={{ uri: item.uri }} className="w-24 h-24 rounded" />

            <TouchableOpacity
              onPress={() => handleImageRemove(index, true)}
              className="absolute top-1 right-1 bg-red-500 p-1 rounded-full"
            >
              <Text className="text-white text-xs">X</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <FlatList
        data={files}
    
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View className="relative m-2 border border-neutral-200 flex flex-row items-center justify-between">
          <Text className="text-xs p-2  text-center" numberOfLines={2}>
                  {item.name || "Document"}
                </Text>

            <TouchableOpacity
              onPress={() => handleImageRemove(item.name || "", false)}
              className="  p-1 rounded-full "
            >
                <Xmark height={20} width={20} />
            </TouchableOpacity>
          </View>
        )}
      />
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

       
          }}
          className="text-base p-1"
        />

      
      </ScrollView>

      <View style={{position:"absolute",bottom:0,width:"100%"}} className="flex-row justify-between items-center px-2 ">
          <View className="flex-row gap-4">
 

     

            <TouchableOpacity onPress={handleImagePick}>
              <MediaImage height={20} width={20} color={"#a3a3a3"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFilePick}>
              <PagePlus height={20} width={20} color={"#a3a3a3"} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isPending || isImageUploading}

            className="bg-primary-500 w-8 h-8  flex items-center justify-center rounded-full mb-2 disabled:opacity-50"
          >
            {
                isImageUploading || isPending ? <ActivityIndicator size="small" color="white" /> :
                <SendSolid height={18} width={18} color={"white"} />
            }
          
          </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
  );
};

export default UserMessageInput;
