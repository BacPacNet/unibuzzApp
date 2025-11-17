import { View, ActivityIndicator } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import MessageTopBar from "@/components/molecules/Message/MessageTopBar";
import UserChats from "@/components/molecules/Message/UserChats";
import { useGetUserChats, useUpdateMessageIsSeen } from "@/services/Messages";
import MessageUserStickyBar from "@/components/molecules/Message/MessageUserStickyBar";
import { getUserStore } from "@/storage/user";
import UserMessages from "@/components/molecules/UserMessages";
import CreateGroupChat from "@/components/molecules/Message/CreateGroupChat";
import SingleChat from "@/components/molecules/Message/SingleChat";
import { useNavigation } from "@react-navigation/native";
import { useSocket } from "@/context/SocketProvider/SocketProvider";
import { SocketConnectionEnums, SocketEnums } from "@/types/SocketType";
import { useQueryClient } from "@tanstack/react-query";
import { useFilteredChats } from "@/hooks/useFilteredChats";
import { ChatsArray, CommunityChat } from "@/types/constant";
import { SafeScreen } from "@/components/template";
import { useNewMessageHandler } from "@/hooks/useNewMessageHandler";

interface Message {
  _id: string;
  chat: {
    _id: string;
  };
  createdAt: string;
  readByUsers?: string[];
}

const Messages = ({ route }: any) => {
  const [currTab, setCurrTab] = useState("Inbox");
  const [selectedChat, setSelectedChat] = useState<any>(undefined);
  const selectedUserId = route?.params?.selectedUserId ?? null;
  const [toSetChat, setToSetChat] = useState<boolean>(true);
  const {
    data: chatsData,
    isLoading: isChatLoading,
    isFetching,
  } = useGetUserChats();
  const { mutate: updateIsSeen } = useUpdateMessageIsSeen();
  const [chats, setChats] = useState<ChatsArray>([]);
  const [isRequest, setIsRequest] = useState(true);
  const [onlineUsersSet, setOnlineUsersSet] = useState<Set<string>>(new Set());
  const userData = getUserStore();
  const userName = selectedChat?.users?.find(
    (item: any) => item?.userId._id !== userData?.id
  );
  const [searchByNameText, setSearchByNameText] = useState("");
  const navigation = useNavigation();
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!selectedChat) {
      navigation.setOptions({
        tabBarStyle: { display: "flex", backgroundColor: "white" },
      });
    }
  }, [navigation, selectedChat]);

  const totalUnreadMessages = chats?.reduce((sum, item) => {
    if (item.isGroupChat) {
      const isUserInGroup = item.users.some(
        (user) => user.userId._id === userData?.id && user.isRequestAccepted
      );

      return isUserInGroup ? sum + item.unreadMessagesCount : sum;
    } else {
      return item.isRequestAccepted ? sum + item.unreadMessagesCount : sum;
    }
  }, 0);

  const totalUnreadNotAcceptedMessages = chats?.reduce((sum, item) => {
    const shouldInclude = item.isGroupChat
      ? item.users.some(
          (user) =>
            user.userId._id.toString() === userData?.id &&
            !user.isRequestAccepted
        )
      : !item.isRequestAccepted && item.groupAdmin.toString() !== userData?.id;

    return shouldInclude ? sum + item.unreadMessagesCount : sum;
  }, 0);

  const filteredChats = useFilteredChats(
    chats,
    searchByNameText,
    userData?.id as string
  );

  const updateMessageSeen = () => {
    const isRead = selectedChat?.latestMessage?.readByUsers?.includes(
      userData?.id || ""
    );

    if (!isRead && isRead !== undefined && selectedChat) {
      updateIsSeen({
        chatId: selectedChat?._id,
        messageId: selectedChat?.latestMessage?._id,
        data: { readByUserId: userData?.id },
      });
      //   refetchMessageNotification()
    }
  };

  useEffect(() => {
    if (!selectedChat?.latestMessage) return;
    updateMessageSeen();
  }, [selectedChat?.latestMessage]);

  useNewMessageHandler(selectedChat);
  const updatedChats = () => {
    if (!chatsData) return;

    const updatedChats = chatsData.map((chat) => ({
      ...chat,
      users: chat.users.map((user) => ({
        ...user,
        isOnline: onlineUsersSet?.has(user.userId._id) ?? false,
      })),
    }));

    setChats(updatedChats);
    const updateCurrSelectedChat = () => {
      const toWrite = updatedChats.find(
        (item) => item._id == selectedChat?._id
      );
      setSelectedChat(toWrite);
    };

    updateCurrSelectedChat();
  };

  useEffect(() => {
    updatedChats();
  }, [chatsData, onlineUsersSet]);

  const userChatsId = useMemo(() => {
    return chatsData?.flatMap((chat) =>
      chat.users
        .map((user) =>
          user.userId._id !== userData?.id ? user.userId._id : null
        )
        .filter((id) => id !== null)
    );
  }, [chatsData, userData?.id]);

  const uniqUserChatID = useMemo(() => new Set(userChatsId), [userChatsId]);

  useEffect(() => {
    if (!socket) return;

    const requestOnlineUsers = () => {
      socket.emit("requestOnlineUsers", Array.from(uniqUserChatID));
    };

    requestOnlineUsers();
  }, [socket, uniqUserChatID]);

  const updateOnlineStatus = (onlineUsers: string[]) => {
    setOnlineUsersSet((prevOnlineUsersSet: Set<string>) => {
      const updatedSet = new Set(prevOnlineUsersSet);
      onlineUsers.forEach((userId: string) => updatedSet.add(userId));
      return updatedSet;
    });
  };

  const userDisconnected = (disconnectedUsers: string[]) => {
    setOnlineUsersSet((prevOnlineUsersSet) => {
      const updatedSet = new Set(prevOnlineUsersSet);

      disconnectedUsers.forEach((userId) => updatedSet.delete(userId));

      return updatedSet;
    });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(SocketConnectionEnums.ONLINEUSERS, updateOnlineStatus);
    socket.on(SocketConnectionEnums.ONLINEUSERS2, updateOnlineStatus);
    socket.on(SocketConnectionEnums.USER_DISCONNECT, userDisconnected);
    return () => {
      socket.off(SocketConnectionEnums.ONLINEUSERS2, updateOnlineStatus);
      socket.off(SocketConnectionEnums.ONLINEUSERS, updateOnlineStatus);
      socket.off(SocketConnectionEnums.USER_DISCONNECT, userDisconnected);
    };
  }, [socket]);

  useEffect(() => {
    if (selectedUserId) {
      const selectedChatBySearchQuery = chats?.find(
        (item) => item._id.toString() == selectedUserId
      );
      if (selectedChatBySearchQuery) {
        setToSetChat(false);
        setSelectedChat(selectedChatBySearchQuery);
      }
    }
  }, [selectedUserId, chats]);

  const renderTab = () => {
    if (isFetching) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#7367f0" />
        </View>
      );
    }

    switch (currTab) {
      case "Inbox":
        return (
          <UserChats
            setSelectedChat={setSelectedChat}
            selectedChat={selectedChat}
            currTabb={currTab}
            setIsRequest={setIsRequest}
            chats={filteredChats}
            isChatLoading={isChatLoading}
            setCurrTab={setCurrTab}
          />
        );

      case "Requests":
        return (
          <UserChats
            setSelectedChat={setSelectedChat}
            selectedChat={selectedChat}
            currTabb={currTab}
            setIsRequest={setIsRequest}
            chats={filteredChats}
            isChatLoading={isChatLoading}
            setCurrTab={setCurrTab}
          />
        );

      case "Group":
        return (
          <CreateGroupChat
            setCurrTab={setCurrTab}
            setSelectedChat={setSelectedChat}
          />
        );
      case "Single":
        return (
          <SingleChat
            setCurrTab={setCurrTab}
            setSelectedChat={setSelectedChat}
          />
        );
    }
  };

  const renderChat = () => {
    if (selectedChat) {
      return (
        <SafeScreen>
          <MessageUserStickyBar
            setSelectedChat={setSelectedChat}
            name={
              selectedChat?.isGroupChat
                ? selectedChat?.chatName
                : userName?.userId?.firstName
                  ? userName?.userId?.firstName +
                    " " +
                    userName?.userId?.lastName
                  : "Unknown"
            }
            users={selectedChat?.users}
            userId={userName?.userId?._id}
            yourID={userData?.id || ""}
            isGroupChat={selectedChat?.isGroupChat}
            groupAdmin={selectedChat?.groupAdmin}
            isRequestNotAccepted={currTab == "Requests"}
            chatId={selectedChat?._id}
            profileCover={
              selectedChat?.isGroupChat
                ? selectedChat?.groupLogo?.imageUrl
                : selectedChat?.groupLogoImage
            }
            description={selectedChat?.groupDescription}
            setAcceptedId={selectedChat._id}
            setCurrTab={setCurrTab}
            isBlockedByYou={selectedChat?.blockedBy?.some(
              (id: string) => id.toString() == userData?.id
            )}
            communitySelected={selectedChat?.community as CommunityChat}
            selectedUserId={selectedUserId}
          />
          <UserMessages
            chatId={selectedChat._id}
            name={
              selectedChat.isGroupChat
                ? selectedChat.chatName
                : userName?.userId.firstName +
                    " " +
                    userName?.userId.lastName && "Unknown"
            }
            users={selectedChat?.users}
            profileCover={selectedChat?.groupLogoImage ?? ""}
            isRequest={isRequest}
            isGroupChat={selectedChat?.isGroupChat}
            yourID={userData?.id || ""}
            isRequestNotAccepted={currTab == "Requests"}
            setCurrTab={setCurrTab}
          />
        </SafeScreen>
      );
    } else {
      return renderTab();
    }
  };

  return (
    <View className="flex-1 bg-white">
      {currTab !== "Group" && currTab !== "Single" && !selectedChat && (
        <MessageTopBar
          currTab={currTab}
          setCurrTab={setCurrTab}
          setSelectedChat={setSelectedChat}
          unreadChatsCount={totalUnreadMessages || 0}
          unreadNotAcceptedChatsCount={totalUnreadNotAcceptedMessages || 0}
        />
      )}

      {renderChat()}
    </View>
  );
};

export default Messages;
