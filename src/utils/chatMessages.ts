import { LatestMessage } from "@/types/ChatType";

const MESSAGE_MERGE_THRESHOLD = 60000;

const resolveChatId = (chat: LatestMessage["chat"]): string | undefined => {
  if (typeof chat === "string") {
    return chat;
  }
  return chat?._id;
};

export const mergeMessages = (
  oldMessages: LatestMessage[],
  newMessage: LatestMessage
): LatestMessage[] => {
  if (!oldMessages.length) {
    return [newMessage];
  }

  const lastMsg = oldMessages[oldMessages.length - 1];
  const existingIndex = oldMessages.findIndex(
    (msg) => msg._id === newMessage._id
  );

  if (existingIndex !== -1) {
    const updated = [...oldMessages];
    updated[existingIndex] = newMessage;
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

export const updateChatsList = (chats: any[], newMessage: LatestMessage) => {
  const chatId = resolveChatId(newMessage.chat);
  if (!chatId) return chats;

  const updatedChats = chats.map((item) =>
    item._id === chatId
      ? {
          ...item,
          latestMessage: newMessage,
          latestMessageTime: new Date(newMessage.createdAt).getTime(),
        }
      : item
  );

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
