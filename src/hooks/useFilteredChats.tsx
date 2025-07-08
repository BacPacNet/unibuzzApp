import { ChatsArray } from "@/types/constant";
import { useMemo } from "react";

export const useFilteredChats = (
  chats: ChatsArray | null,
  searchText: string,
  userId: string,
) => {
  return useMemo(() => {
    if (!chats) return null;
    if (searchText.trim() === "") return chats;

    const lower = searchText.toLowerCase();

    return chats.filter((chat) => {
      if (chat.isGroupChat) {
        return chat.chatName.toLowerCase().includes(lower);
      }

      const otherUser = chat.users.find((u) => u.userId._id !== userId);
      if (!otherUser) return false;

      const fullName =
        `${otherUser.userId.firstName} ${otherUser.userId.lastName}`.toLowerCase();
      return (
        fullName.includes(lower) ||
        otherUser.userId.firstName.toLowerCase().includes(lower) ||
        otherUser.userId.lastName.toLowerCase().includes(lower)
      );
    });
  }, [chats, searchText, userId]);
};
