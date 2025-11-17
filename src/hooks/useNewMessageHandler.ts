import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useUpdateMessageIsSeen } from "@/services/Messages";
import { Chat, SocketEnums } from "@/types/constant";
import { LatestMessage } from "@/types/ChatType";
import { mergeMessages } from "@/utils/chatMessages";
import { useSocket } from "@/context/SocketProvider/SocketProvider";
import { getUserStore } from "@/storage/user";

export const useNewMessageHandler = (selectedChat?: Chat) => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const userData = getUserStore();
  const currentUserId = userData?.id ?? "";
  const { mutate: updateIsSeen } = useUpdateMessageIsSeen();

  const handleNewMessage = useCallback(
    (newMessage: LatestMessage) => {
      const chatId =
        typeof newMessage.chat === "string"
          ? newMessage.chat
          : newMessage.chat?._id;
      if (!chatId) return;
      const isActive = selectedChat?._id === chatId;
      const chatData: Chat[] = queryClient.getQueryData(["userChats"]) || [];

      if (!isActive && chatData.some((c) => c._id === chatId)) {
        const updated = chatData.map((c) =>
          c._id === chatId
            ? {
                ...c,
                latestMessage: newMessage,
                unreadMessagesCount: (c.unreadMessagesCount || 0) + 1,
              }
            : c
        );
        updated.sort(
          (a, b) =>
            new Date(b.latestMessage?.createdAt || 0).getTime() -
            new Date(a.latestMessage?.createdAt || 0).getTime()
        );
        queryClient.setQueryData(["userChats"], updated);
      } else if (isActive) {
        queryClient.setQueryData(
          ["chatMessages", chatId],
          (old: LatestMessage[] = []) => mergeMessages(old, newMessage)
        );
        queryClient.setQueryData(
          ["userChats"],
          chatData.map((c) =>
            c._id === chatId ? { ...c, latestMessage: newMessage } : c
          )
        );

        if (currentUserId && !newMessage.readByUsers?.includes(currentUserId)) {
          updateIsSeen({
            chatId,
            messageId: newMessage._id,
            data: { readByUserId: currentUserId },
          });
        }
      } else {
        queryClient.invalidateQueries({ queryKey: ["userChats"] });
      }
    },
    [selectedChat, currentUserId, updateIsSeen, queryClient]
  );

  useEffect(() => {
    if (!socket) return;

    socket.on(SocketEnums.RECEIVED_MESSAGE, handleNewMessage);

    return () => {
      socket.off(SocketEnums.RECEIVED_MESSAGE, handleNewMessage);
    };
  }, [socket, handleNewMessage]);
};
