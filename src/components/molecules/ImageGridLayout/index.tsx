import React, { useState } from "react";
import { View, Image, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ImageViewing from "react-native-image-viewing";

type Props = {
  imagesData: {
    imageUrl: string;
  }[];
};

const ImageGridLayout = ({ imagesData }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  const formattedImages = imagesData?.map(({ imageUrl }: any) => ({
    uri: imageUrl,
  }));

  const renderImages = () => {
    switch (formattedImages?.length) {
      case 1:
        return (
          <TouchableOpacity
            onPress={() => handleImageClick(0)}
            style={{ height: "100%" }}
            className=""
          >
            <Image
              source={{ uri: formattedImages[0].uri }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </TouchableOpacity>
        );
      case 2:
        return (
          <View
            style={{ width: "100%", height: "100%" }}
            className="flex-1 flex flex-row gap-2  "
          >
            {formattedImages.slice(0, 2).map((img, index) => (
              <View key={index} style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => handleImageClick(index)}>
                  <Image
                    key={index}
                    source={{ uri: img.uri }}
                    style={{ width: "100%", height: "100%" }}
                    className="rounded-lg"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        );
      case 3:
        return (
          <View className="flex-1 flex gap-2">
            <View className="flex-1 flex-row gap-2">
              {formattedImages.slice(0, 2).map((img, index) => (
                <View key={index} style={{ flex: 1 }}>
                  <TouchableOpacity onPress={() => handleImageClick(index)}>
                    <Image
                      key={index}
                      source={{ uri: img.uri }}
                      style={{ width: "100%", height: "100%" }}
                      className="rounded-lg"
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => handleImageClick(2)}
                style={{ height: "100%" }}
                className=""
              >
                <Image
                  source={{ uri: formattedImages[2]?.uri }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                  className="rounded-lg"
                />
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return (
          <View className="flex-1 flex-row gap-2">
            <View className="flex-1 flex w-3/4 flex-col gap-2">
              <View className="flex-1 flex-row gap-2">
                {formattedImages?.slice(0, 2)?.map((img, index) => (
                  <View key={index} style={{ flex: 1 }}>
                    <TouchableOpacity onPress={() => handleImageClick(index)}>
                      <Image
                        key={index}
                        source={{ uri: img.uri }}
                        style={{ width: "100%", height: "100%" }}
                        className="rounded-lg"
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  onPress={() => handleImageClick(2)}
                  style={{ height: "100%" }}
                  className=""
                >
                  <Image
                    source={{ uri: formattedImages[2]?.uri }}
                    className="w-full h-full rounded-lg"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ width: "30%" }} className="relative overflow-hidden">
              <TouchableOpacity
                onPress={() => handleImageClick(3)}
                style={{ height: "100%" }}
                className=""
              >
                <Image
                  source={{ uri: formattedImages[3]?.uri }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                  className="rounded-lg"
                />
              </TouchableOpacity>
              {formattedImages.length > 4 && (
                <View
                  style={{
                    position: "absolute",
                    right: -5,
                    bottom: -4,
                    overflow: "hidden",
                  }}
                  className="bg-neutral-200 w-10 h-10 p-2 rounded-full flex items-center"
                >
                  <TouchableOpacity
                    onPress={() => handleImageClick(3)}
                    className="flex items-center justify-center w-10 h-10"
                  >
                    <Text className="w-10 h-10 text-center">+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        );
    }
  };

  if (imagesData?.length == 0) {
    return;
  }

  return (
    <View style={{ height: 150 }} className="bg-white py-2 px-4">
      {isOpen && (
        <ImageViewing
          images={formattedImages}
          imageIndex={photoIndex}
          visible={isOpen}
          onRequestClose={() => setIsOpen(false)}
          FooterComponent={({ imageIndex }) => (
            <View className="flex items-center justify-center">
              <Text className="text-white">
                {imageIndex + 1}/{formattedImages?.length}
              </Text>
            </View>
          )}
        />
      )}
      {renderImages()}
    </View>
  );
};

export default ImageGridLayout;
