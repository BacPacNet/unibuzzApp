import { getMimeTypeFromUrl, imageMimeTypes } from "@/utils";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import ImageViewing from "react-native-image-viewing";

const ImageGallery = ({
  images,
  imageCount,
}: {
  images: any;
  imageCount: number;
}) => {

    const imageItems = images?.filter((item: any) => imageMimeTypes.includes(getMimeTypeFromUrl(item.imageUrl))) || []
  const fileItems = images?.filter((item: any) => !imageMimeTypes.includes(getMimeTypeFromUrl(item.imageUrl))) || []

  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);


  const handleImageClick = (index: number) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  const formattedImages = images?.map((img: { imageUrl: string }) => ({
    uri: img?.imageUrl,
  }));

  return (
    <View className="w-full">
      {isOpen && (
        <ImageViewing
          images={formattedImages}
          imageIndex={photoIndex}
          visible={isOpen}
          onRequestClose={() => setIsOpen(false)}
          FooterComponent={({ imageIndex }) => (
            <View className="flex items-center justify-center">
              <Text className="text-white">
                {imageIndex + 1}/{imageCount}
              </Text>
            </View>
          )}
        />
      )}

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 6,
          flexGrow: 1,
          //   overflow: "hidden",
          width: "100%",
        }}
      >
        {imageItems?.slice(0, 4).map((src: any, index: number) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleImageClick(index)}
            style={{ position: "relative", overflow: "hidden" }}
            className={` ${imageCount == 1 ? "h-40 w-full" : imageCount == 2 ? "h-40 w-40 " : imageCount >= 4 ? "h-20 w-40 " : imageCount >= 3 ? "h-20 w-40" : ""} `}
          >
            <Image
              source={{ uri: src?.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
            {imageCount > 4 && index === 3 && (
              <View style={styles.extraImagesCount}>
                <Text style={styles.extraImagesText}>+{imageCount - 4}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex gap-2">
        {
          fileItems.map((item: any, index: number) => (
            <View key={index}>
              <Text>{decodeURI(item.imageUrl.split('/').pop() || 'Unknown File')}</Text>
            </View>
          ))
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  extraImagesCount: {
    position: "absolute",
    backgroundColor: "#F1F1F1",
    width: 40,
    height: 40,
    borderRadius: 20,
    right: -10,
    bottom: -10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  extraImagesText: {
    color: "#555",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ImageGallery;
