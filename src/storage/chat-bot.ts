import { storage } from "@/App";

enum StorageKeys {
  CHAT_BOT_MESSAGES = "chatBotMessages",
}

export interface ChatBotMessage {
  inserted_id: string;
  isNewThread: boolean;
  response: string;
  [key: string]: any;
}

export const getChatBotMessages = (): ChatBotMessage[] | null => {
  try {
    const jsonMessages = storage.getString(StorageKeys.CHAT_BOT_MESSAGES);
    if (!jsonMessages) return null;

    return JSON.parse(jsonMessages);
  } catch (error) {
    console.error("Failed to retrieve chat bot messages", error);
    return null;
  }
};

export const storeChatBotMessages = async (
  newMessages: ChatBotMessage
): Promise<void> => {
  try {
    const jsonMessages = storage.getString(StorageKeys.CHAT_BOT_MESSAGES);
    let existingMessages: ChatBotMessage[] = [];

    if (jsonMessages) {
      existingMessages = JSON.parse(jsonMessages);
    }

    const updatedMessages = [...existingMessages, newMessages];
    storage.set(StorageKeys.CHAT_BOT_MESSAGES, JSON.stringify(updatedMessages));
  } catch (error) {
    console.error("Failed to store chat bot messages", error);
  }
};

export const clearChatBotMessages = async (): Promise<void> => {
  try {
    storage.delete(StorageKeys.CHAT_BOT_MESSAGES);
  } catch (error) {
    console.error("Failed to clear chat bot messages", error);
  }
};
