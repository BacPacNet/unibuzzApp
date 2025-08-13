import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import BackHeader from "@/components/atoms/BackHeader";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ReusableButton from "@/components/atoms/ReusableButton";
import { Refresh, SendSolid } from "iconoir-react-native";
import ChatMessage from "@/components/molecules/AiAssistant/ChatBubbleMessage";
import { useCreateChatBotMessage } from "@/services/ai-chatbot";
import {
  ChatBotMessage,
  clearChatBotMessages,
  getChatBotMessages,
} from "@/storage/chat-bot";
import { getUserStore } from "@/storage/user";
import { useForm } from "react-hook-form";
import { Toast } from "react-native-toast-notifications";
import BotAvatar from "@/assets/chatbot/aiIcon.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTabBarVisibility } from "@/hooks/useTabBarVisibility";

const AI_Assistant = () => {
  const navigation = useNavigation();
  const userData = getUserStore();
  const { register, setValue, watch } = useForm({
    defaultValues: { text: "" },
  });
  const watchText = watch("text");
  const { mutate: createChatBotMessage, isPending } = useCreateChatBotMessage();
  const inset = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const chatBotMessages = getChatBotMessages();
  const [chatMessages, setChatMessages] = useState<ChatBotMessage[]>([]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages]);

  useTabBarVisibility(navigation);

  useFocusEffect(
    useCallback(() => {
      if (chatBotMessages?.length !== chatMessages?.length) {
        setChatMessages(chatBotMessages || []);
      }
    }, [])
  );

  const handleSendMessage = () => {
    if (watchText.trim() === "") {
      return Toast.show("Please enter a message", {
        type: "warning",
        placement: "top",
      });
    }

    const data: any = {
      userId: userData?.id,
      prompt: watchText,
      ...(chatBotMessages?.[chatBotMessages.length - 1]?.threadId?.length && {
        threadId: chatBotMessages[chatBotMessages.length - 1].threadId,
      }),
    };

    setChatMessages((prev) => [...prev, data]);
    createChatBotMessage(data, {
      onSuccess: (res) => setChatMessages((prev) => [...prev, res]),
    });
    setValue("text", "");
  };

  const handleRefresh = () => {
    clearChatBotMessages();
    setChatMessages([]);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <BotAvatar width={350} height={140} />
      <Text style={styles.emptyStateText}>No messages yet</Text>
      <Text style={styles.emptyStateText}>Ask me anything</Text>
    </View>
  );

  const renderChatMessages = () => {
    if (chatMessages?.length === 0) {
      return renderEmptyState();
    }
    return chatMessages?.map((message, idx) => (
      <ChatMessage
        key={idx}
        isMine={!!message?.userId}
        avatar={""}
        message={message?.userId ? message.prompt : message.response}
      />
    ));
  };

  const renderLoadingMessage = () => {
    if (!isPending) return null;
    return (
      <ChatMessage isMine={false} avatar={""} message={""} isLoading={true} />
    );
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "white", paddingBottom: inset.bottom }}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <BackHeader
          label="Home"
          onPress={() => navigation.goBack()}
          isLeftPadding={true}
        />
        <View style={styles.refreshButtonContainer}>
          <ReusableButton
            onPress={handleRefresh}
            variant="shade"
            size={89}
            height="small"
            buttonContent={
              <View style={styles.refreshButtonContent}>
                <Text style={styles.refreshButtonText}>Refresh</Text>
                <Refresh height={16} width={16} color={"#6744FF"} />
              </View>
            }
          />
        </View>
      </View>

      {/* Keyboard Avoider */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 110} // adjust for header height
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1, padding: 16 }}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
          showsVerticalScrollIndicator={false}
        >
          {renderChatMessages()}
          {renderLoadingMessage()}
        </ScrollView>

        {/* Input fixed at bottom */}
        <View style={styles.inputContainer}>
          <TextInput
            {...register("text")}
            placeholder="Type a message"
            multiline
            style={styles.input}
            value={watchText}
            onChangeText={(text) => setValue("text", text)}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            style={styles.sendButton}
            disabled={isPending}
          >
            <SendSolid height={18} width={18} color={"white"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AI_Assistant;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  refreshButtonContainer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 16,
  },
  refreshButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  refreshButtonText: {
    color: "#6744FF",
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  emptyStateText: {
    color: "#6B7280",
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingHorizontal: 16,
    paddingVertical: 0,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#3A3B3C",
    maxHeight: 100,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#6744FF",
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
});
