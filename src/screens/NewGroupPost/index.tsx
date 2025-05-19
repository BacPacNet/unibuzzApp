import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { MediaImage, NavArrowLeft } from "iconoir-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { replaceImage } from "@/services/uploadImage";
import { CommunityPostData, CommunityPostType } from "@/types/constant";
import { useCreateGroupPost } from "@/services/community-group";

type ImageAsset = {
  uri: string;
  fileName?: string;
  fileSize?: number;
  height?: number;
  width?: number;
  type?: string;
};
const NewGroupPost = ({ navigation }: any) => {
  const route = useRoute();
  const { communityId, communityGroupId } = route.params as any;
  const [images, setImages] = useState<ImageAsset[]>([]);
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: "test",
  });
  const { mutate: CreateGroupPost, isPending } = useCreateGroupPost();
  const [postAccessType, setPostAccessType] = useState<CommunityPostType>(
    CommunityPostType.PUBLIC,
  );
  const [showPostType, setShowPostType] = useState(false);

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
    }, [navigation]),
  );

  const handlePostVisibilityTypeChange = useCallback(
    (type: CommunityPostType) => {
      setPostAccessType(type);
      setShowPostType(false);
    },
    [setPostAccessType, setShowPostType],
  );

  const processImages = async (imagesData: any[]) => {
    const promises = imagesData.map((image) => replaceImage(image, ""));
    const results = await Promise.all(promises);
    return results.map((result) => ({
      imageUrl: result?.imageUrl,
      publicId: result?.publicId,
    }));
  };

  const handleImagePick = useCallback(() => {
    launchImageLibrary(
      { mediaType: "photo", selectionLimit: 0 },
      (response: any) => {
        if (response.assets && response.assets.length > 0) {
          setImages((prevImages) => [...prevImages, ...response.assets]);
        }
      },
    );
  }, []);

  const handleImageRemove = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handlePostCreate = async () => {
    const text = await editor.getHTML();
    let fileLinks;
    if (images && images.length > 0) {
      fileLinks = await processImages(images);
    }
    const data = {
      PostType: postAccessType,
      content: text,
      imageUrl: fileLinks,
    };

    const communityData: CommunityPostData = {
      ...data,
      communityId: communityId,
      ...(communityGroupId &&
        communityGroupId?.length > 0 && { communiyGroupId: communityGroupId }),
    };
    CreateGroupPost(communityData);
    handleBack();
  };

  const handleBack = () => {
    if (communityId && communityGroupId) {
      navigation.navigate("CommunityGroup", {
        communityId: communityId,
        communityGroupId: communityGroupId,
      });
    }
    if (communityId && !communityGroupId) {
      navigation.navigate("Community", { communityId: communityId });
    }
  };

  return (
    <View className="flex-1 bg-white relative">
      {showPostType && (
        <View className="flex gap-2 absolute bg-white shadow-md w-48 top-16 right-24 z-40 ">
          <TouchableOpacity
            className={` ${postAccessType == CommunityPostType.PUBLIC ? "bg-primary-500" : ""} `}
            onPress={() =>
              handlePostVisibilityTypeChange(CommunityPostType.PUBLIC)
            }
          >
            <Text
              className={` p-2 ${postAccessType == CommunityPostType.PUBLIC ? "text-white" : "text-black"} `}
            >
              PUBLIC
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={` ${postAccessType == CommunityPostType.FOLLOWER_ONLY ? "bg-primary-500" : ""} `}
            onPress={() =>
              handlePostVisibilityTypeChange(CommunityPostType.FOLLOWER_ONLY)
            }
          >
            <Text
              className={` p-2 ${postAccessType == CommunityPostType.FOLLOWER_ONLY ? "text-white" : "text-black"} `}
            >
              FOLLOWER ONLY
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View className="  flex flex-row gap-4 items-center justify-between border-b border-neutral-300 p-3">
        <View className=" flex flex-row gap-4 items-center">
          <TouchableOpacity onPress={() => handleBack()}>
            <NavArrowLeft height={24} width={24} />
          </TouchableOpacity>
        </View>
        <View className="flex flex-row items-center gap-4">
          <View>
            <TouchableOpacity
              onPress={() => setShowPostType(!showPostType)}
              className="bg-[#F3F2FF] px-4 py-2 rounded-lg"
            >
              <Text className="text-primary-500">Visibility</Text>
            </TouchableOpacity>
          </View>
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
      <SafeAreaView
        style={{ flex: 1, paddingBottom: images.length ? 120 : 20 }}
      >
        <RichText editor={editor} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            position: "absolute",
            width: "100%",
            bottom: 0,
          }}
        >
          <TouchableOpacity onPress={handleImagePick}>
            <MediaImage height={20} width={20} color={"#a3a3a3"} />
          </TouchableOpacity>
          <FlatList
            data={images}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View className="relative m-2 ">
                <Image
                  source={{ uri: item.uri }}
                  className="w-24 h-24 rounded"
                />

                <TouchableOpacity
                  onPress={() => handleImageRemove(index)}
                  className="absolute top-1 right-1 bg-red-500 p-1 rounded-full"
                >
                  <Text className="text-white text-xs">X</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <Toolbar editor={editor} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default NewGroupPost;
