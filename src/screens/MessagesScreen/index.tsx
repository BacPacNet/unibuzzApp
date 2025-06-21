import { View, ActivityIndicator } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import MessageTopBar from "@/components/molecules/Message/MessageTopBar";
import UserChats from "@/components/molecules/Message/UserChats";
import { ChatsArray } from "@/types/ChatType";
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
  //   const { selectedUserId } = route.params;
  const selectedUserId = route?.params?.selectedUserId ?? null;
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
    (item: any) => item?.userId._id !== userData?.id,
  );

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

  const unreadChatsCount = chats?.filter((item) => {
    if (item.isGroupChat) {
      return (
        item.unreadMessagesCount > 0 &&
        item.users.some(
          (user) => user.userId._id == userData?.id && user.isRequestAccepted,
        )
      );
    } else {
      return item.unreadMessagesCount > 0 && item.isRequestAccepted;
    }
  }).length;
  const unreadNotAcceptedChatsCount = chats?.filter((item) => {
    if (item.isGroupChat) {
      return (
        item.unreadMessagesCount > 0 &&
        item.users.some((user) => !user.isRequestAccepted)
      );
    } else {
      return item.unreadMessagesCount > 0 && !item.isRequestAccepted;
    }
  }).length;

  const updateMessageSeen = () => {
    const isRead = selectedChat?.latestMessage?.readByUsers?.includes(
      userData?.id || "",
    );

    if (!isRead && isRead !== undefined && selectedChat) {
      updateIsSeen({
        chatId: selectedChat?._id,
        messageId: selectedChat?.latestMessage?._id,
        data: { readByUserId: userData?.id },
      });
    }
  };

  useEffect(() => {
    updateMessageSeen();
  }, [selectedChat]);

  const handleNewMessage = (newMessage: Message) => {
    const { _id: chatMessageId, chat } = newMessage;
    const messageChatId = chat?._id;
    const isActiveChat = selectedChat?._id === messageChatId;

    const chatData: ChatsArray = queryClient.getQueryData(["userChats"]) || [];

    if (!isActiveChat && chatData.some((chat) => chat._id == messageChatId)) {
      const updatedChats = chatData.map((chat) =>
        chat._id === messageChatId
          ? {
              ...chat,
              latestMessage: newMessage,
              unreadMessagesCount: (chat.unreadMessagesCount || 0) + 1,
            }
          : chat,
      );

      updatedChats.sort((a, b) => {
        const dateA = a.latestMessage?.createdAt
          ? new Date(a.latestMessage.createdAt).getTime()
          : 0;
        const dateB = b.latestMessage?.createdAt
          ? new Date(b.latestMessage.createdAt).getTime()
          : 0;
        return dateB - dateA;
      });
      queryClient.setQueryData(["userChats"], updatedChats);
    } else if (isActiveChat) {
      queryClient.setQueryData(
        ["chatMessages", selectedChat?._id],
        (oldMessages: Message[]) => [...(oldMessages || []), newMessage],
      );

      const updatedChats = chatData.map((chat) =>
        chat._id === selectedChat?._id
          ? {
              ...chat,
              latestMessage: newMessage,
            }
          : chat,
      );
      queryClient.setQueryData(["userChats"], updatedChats);

      const isRead = newMessage?.readByUsers?.includes(userData?.id || "");

      if (!isRead && selectedChat?._id) {
        updateIsSeen({
          chatId: selectedChat?._id,
          messageId: chatMessageId,
          data: { readByUserId: userData?.id },
        });
      }
    } else if (!chatData.some((chat) => chat._id == messageChatId)) {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      return;
    }
  };

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
        (item) => item._id == selectedChat?._id,
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
          user.userId._id !== userData?.id ? user.userId._id : null,
        )
        .filter((id) => id !== null),
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
    if (!socket) {
      console.log("Socket is not initialized");
      return;
    }

    socket.on(SocketEnums.RECEIVED_MESSAGE, handleNewMessage);

    return () => {
      if (socket) {
        socket.off(SocketEnums.RECEIVED_MESSAGE, handleNewMessage);
      }
    };
  }, [socket, selectedChat]);

  useEffect(() => {
    if (selectedUserId) {
      const selectedChatBySearchQuery = chats?.find(
        (item) => item._id.toString() == selectedUserId,
      );
      if (selectedChatBySearchQuery) {
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
            chats={chats}
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
            chats={chats}
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
        <>
          <MessageUserStickyBar
            setSelectedChat={setSelectedChat}
            name={
              selectedChat?.isGroupChat
                ? selectedChat?.chatName
                : (userName?.userId.firstName ?? "Unknown")
            }
            users={selectedChat?.users}
            yourID={userData?.id || ""}
            isGroupChat={selectedChat?.isGroupChat}
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
          />
          <UserMessages
            chatId={selectedChat._id}
            name={
              selectedChat.isGroupChat
                ? selectedChat.chatName
                : (userName?.userId.firstName ?? "Unknown")
            }
            users={selectedChat?.users}
            profileCover={selectedChat?.groupLogoImage ?? ""}
            isRequest={isRequest}
            isGroupChat={selectedChat?.isGroupChat}
            yourID={userData?.id || ""}
            isRequestNotAccepted={currTab == "Message Requests"}
            setCurrTab={setCurrTab}
          />
        </>
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
          unreadChatsCount={unreadChatsCount || 0}
          unreadNotAcceptedChatsCount={unreadNotAcceptedChatsCount || 0}
        />
      )}

      {renderChat()}
    </View>
  );
};

export default Messages;
