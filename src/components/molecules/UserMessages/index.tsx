import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useGetUserMessages } from "@/services/Messages";
import avatar from "../../../assets/avatar.png";
import { getUserProfileStore, getUserStore } from "@/storage/user";
import UserMessageInput from "../Message/UserMessageInput";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ImageGallery from "../ImageGrid";
import { useHeader } from "@/context/HeaderProvider/Header";
import { format } from "date-fns";
import { formatRelativeTime } from "@/utils";
import ImageGridLayout from "../ImageGridLayout";
dayjs.extend(relativeTime);

type User = {
  userId: {
    _id: string;
    firstName: string;
  };
  isOnline?: boolean;
};

type Props = {
  name: string;
  profileCover: string;
  chatId: string;
  users: User[];
  isRequest: boolean;
  isGroupChat: boolean;
  yourID: string;

  isRequestNotAccepted: boolean;

  setCurrTab: (value: string) => void;
};

type MessageProps = {
  profilePic: string | undefined;
  name: string;
  content: string;
  date: string;
  myMessage: boolean;
  id: string;
  reactions: {
    userId: string;
    emoji: string;
  }[];
  chatId: string;
  media: { imageUrl: string; publicId: string }[];
  isOnline: boolean;

  idx: number;
};

const UserCard = ({
  profilePic,
  name,
  content,
  date,
  media,
  isOnline,
}: MessageProps) => {
  return (
    <View className="flex-row items-start mb-4">
      <View className="w-10 h-10 relative">
        <Image
          source={profilePic ? { uri: profilePic } : avatar}
          className="w-10 h-10 rounded-full"
        />
        {/* <View
          className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 ${isOnline ? "bg-green-500" : "bg-neutral-300"} border-white`}
        /> */}
      </View>
      <View className="flex-1 pl-2 flex items-start justify-start">
        <View className="flex-row  gap-4 items-center">
          <Text className="text-xs font-semibold text-neutral-600">{name}</Text>

          {date && (
            <Text className="text-xs text-neutral-400">
              {formatRelativeTime(new Date(date))}
            </Text>
          )}
        </View>
        <Text className="text-xs text-neutral-700">{content}</Text>
        <ImageGallery images={media} imageCount={media?.length} />
      </View>
    </View>
  );
};

const UserMessages = ({
  chatId,
  users,

  isRequestNotAccepted,
  setCurrTab,
}: Props) => {
  const { data: chatMessages, isFetching } = useGetUserMessages(chatId);

  const queryClient = useQueryClient();

  const userData = getUserStore();
  const userProfileData = getUserProfileStore();
  const navigation = useNavigation();
  const { changeHeaderShownStatus } = useHeader();
  const scrollViewRef = useRef<ScrollView>(null);
  const [changed, setChanged] = useState("");
  let previousDate: any = "";

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages, changed]);

  useFocusEffect(
    useCallback(() => {
      changeHeaderShownStatus(false);

      return () => {
        changeHeaderShownStatus(true);
      };
    }, [])
  );

  if (isFetching)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#7367f0" />
      </View>
    );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // adjust for header height
    >
      <ScrollView
        className="flex-1 px-4 h-full"
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        keyboardShouldPersistTaps="handled"
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {chatMessages?.map((item: any, idx: any) => {
          const currentDate = format(
            new Date(item?.createdAt),
            "d MMMM h:mm a"
          );
          const shouldShowDateDivider = !dayjs(item.createdAt).isSame(
            previousDate,
            "day"
          );
          previousDate = dayjs(item.createdAt);

          return (
            <Fragment key={idx}>
              {shouldShowDateDivider && (
                <View className="my-4">
                  <Text className="text-center text-neutral-500">
                    {currentDate}
                  </Text>
                </View>
              )}
              <UserCard
                profilePic={item.senderProfile?.profile_dp?.imageUrl}
                name={item.sender?.firstName}
                content={item.content}
                date={item.createdAt}
                myMessage={item.sender.id === userData?.id}
                id={item._id}
                reactions={item.reactions}
                chatId={chatId}
                media={item.media}
                isOnline={users.some((user) => user.isOnline)}
                idx={idx}
              />
            </Fragment>
          );
        })}
      </ScrollView>
      <View className="border-t border-neutral-300 p-4">
        <UserMessageInput
          chatId={chatId}
          userProfileId={userProfileData?._id || ""}
          isRequestNotAccepted={isRequestNotAccepted}
          setCurrTab={setCurrTab}
          setChanged={setChanged}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default UserMessages;
