import ImageWithFallback from "@/components/atoms/ImageWithFallBack";
import { getMimeTypeFromUrl, imageMimeTypes } from "@/utils";
import { Page } from "iconoir-react-native";
import React, { useState } from "react";
import { View, Image, Text, Linking, StyleSheet } from "react-native";
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

  const imageItems = imagesData.filter((item) =>
    imageMimeTypes.includes(getMimeTypeFromUrl(item.imageUrl)),
  );
  const fileItems = imagesData.filter(
    (item) => !imageMimeTypes.includes(getMimeTypeFromUrl(item.imageUrl)),
  );
  const handleImageClick = (index: number) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  const formattedImages = imageItems?.map(({ imageUrl }: any) => ({
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
            <ImageWithFallback
              uri={formattedImages[0]?.uri}
              style={{ width: "100%", height: "100%", borderRadius: 12 }}
              iconProps={{ color: "gray" }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        );
      case 2:
        return (
          <View
            style={{ width: "100%", height: "100%" }}
            className="flex-1 flex flex-row gap-2  "
          >
            {formattedImages?.slice(0, 2).map((img, index) => (
              <View key={index} style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => handleImageClick(index)}>
                  <ImageWithFallback
                    uri={img?.uri}
                    style={{ width: "100%", height: "100%", borderRadius: 12 }}
                    iconProps={{ color: "gray" }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        );
      case 3:
        return (
          <View className="flex-1 flex flex-row gap-2">
            <View className="w-1/2">
              <TouchableOpacity
                onPress={() => handleImageClick(2)}
                style={{ height: "100%" }}
                className=""
              >
                <ImageWithFallback
                  uri={formattedImages[2]?.uri}
                  style={{ width: "100%", height: "100%", borderRadius: 12 }}
                  iconProps={{ color: "gray" }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>
            <View className="w-1/2 flex gap-2">
              {formattedImages?.slice(0, 2).map((img, index) => (
                <View key={index} style={{ flex: 1 }}>
                  <TouchableOpacity onPress={() => handleImageClick(index)}>
                    <ImageWithFallback
                      uri={img?.uri}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 12,
                      }}
                      iconProps={{ color: "gray" }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        );
      default:
        return;
    }
  };

  if (imagesData?.length == 0) {
    return;
  }

  return (
    <View style={styles.mainContainer} className="flex-1 bg-white py-2 px-4">
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
      <View style={formattedImages?.length ? styles.imageContainer : undefined}>
        {renderImages()}
      </View>

      {fileItems?.length > 0 && (
        <View style={{ marginTop: 5 }}>
          {fileItems?.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => Linking.openURL(item.imageUrl)}
              style={{
                borderWidth: 1,
                borderColor: "#e5e7eb",
                backgroundColor: "#fff",
                padding: 12,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Page width={24} height={24} style={{ marginRight: 8 }} />
              <Text numberOfLines={1} style={{ flex: 1 }}>
                {decodeURIComponent(
                  item.imageUrl.split("/").pop() || "Unknown File",
                )}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default ImageGridLayout;

const styles = StyleSheet.create({
  mainContainer: {
    // minHeight: 190,
    maxHeight: 380,
  },
  imageContainer: {
    minHeight: 150,
    maxHeight: 200,
  },
});
