import React from "react";
import { FlatList, View, Image, TouchableOpacity, Text } from "react-native";
import { MediaImage, PageEdit, Page, Xmark } from "iconoir-react-native";

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith("image/")) {
    return <MediaImage width={24} height={24} color="#3B82F6" />;
  }

  switch (fileType) {
    case "application/pdf":
      return <PageEdit width={24} height={24} color="#6366F1" />;
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return <Page width={24} height={24} color="#6366F1" />;
    default:
      return <Page width={24} height={24} color="#6366F1" />;
  }
};

const MediaPreviewList = ({
  files,
  onRemove,
}: {
  files: any[];
  onRemove: (index: number, isImage: boolean) => void;
}) => {
  return (
    <FlatList
      data={files}
      horizontal
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => {
        const isImage = item.type?.startsWith("image/");
        return (
          <View className="relative m-2 items-center w-28">
            {isImage ? (
              <Image source={{ uri: item.uri }} className="w-24 h-24 rounded" />
            ) : (
              <View className="w-24 h-24 rounded border border-gray-300 bg-gray-100 justify-center items-center p-2">
                {getFileIcon(item.type)}
                <Text className="text-xs mt-2 text-center" numberOfLines={2}>
                  {item.name || "Document"}
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={() => onRemove(isImage ? index : item.name, isImage)}
              className="absolute top-1 right-1 bg-red-500 p-1 rounded-full"
            >
              <Xmark width={16} height={16} color="white" />
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
};

export default MediaPreviewList;
