import { useCreateUserPost } from "@/services/timeline";
import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";
import { useFocusEffect } from "@react-navigation/native";
import { NavArrowLeft } from "iconoir-react-native";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {};

const NewPost = ({ navigation }: any) => {
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: "test",
  });
  const { mutate: CreateTimelinePost, isPending } = useCreateUserPost();

  useFocusEffect(
    useCallback(() => {
      navigation.getParent().setOptions({
        tabBarStyle: { display: "none" },
      });

      return () => {
        navigation.getParent().setOptions({
          tabBarStyle: {
            display: "flex",
            backgroundColor: "white",
            height: 60,
            paddingBottom: 10,
            paddingTop: 10,
          },
        });
      };
    }, [navigation])
  );

  const handlePostCreate = async () => {
    const text = await editor.getHTML();

    const data = {
      PostType: "PUBLIC",
      content: text,
    };
    CreateTimelinePost(data);
  };

  return (
    <View className="flex-1 bg-white relative">
      <View className="  flex flex-row gap-4 items-center justify-between border-b border-neutral-300 p-3">
        <View className=" flex flex-row gap-4 items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <NavArrowLeft height={24} width={24} />
          </TouchableOpacity>
        </View>
        <View className="flex flex-row items-center gap-4">
          <TouchableOpacity className="bg-[#F3F2FF] px-4 py-2 rounded-lg">
            <Text className="text-primary-500">Visibility</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePostCreate()}
            className="bg-primary-500 px-4 py-2 rounded-lg"
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator />
            ) : (
              <Text className={`text-center font-bold text-white`}>Post</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <SafeAreaView style={{ flex: 1 }}>
        <RichText editor={editor} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            position: "absolute",
            width: "100%",
            bottom: 0,
          }}
        >
          <Toolbar editor={editor} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default NewPost;
