import { getMimeTypeFromUrl, imageMimeTypes } from "@/utils";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Linking } from "react-native";
import ImageViewing from "react-native-image-viewing";
import PDFModalWebView from "../PdfView";
import ImageWithFallback from "@/components/atoms/ImageWithFallBack";

const ImageGallery = ({
  images,
  imageCount,
}: {
  images: any;
  imageCount: number;
}) => {
  const imageItems =
    images?.filter((item: any) =>
      imageMimeTypes.includes(getMimeTypeFromUrl(item.imageUrl)),
    ) || [];
  const fileItems =
    images?.filter(
      (item: any) =>
        !imageMimeTypes.includes(getMimeTypeFromUrl(item.imageUrl)),
    ) || [];

  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const handleImageClick = (index: number) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  const formattedImages = imageItems?.map(({ imageUrl }: any) => ({
    uri: imageUrl,
  }));

  const handlePdfClick = (url: string) => {
    setPdfUrl(url);
    setIsPdfOpen(true);
  };

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
            className="flex-1 flex flex-row gap-2  "
          >
            {formattedImages?.slice(0, 2).map((img: any, index: number) => (
              <View key={index} className="w-1/2">
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
                onPress={() => handleImageClick(0)}
                style={{ height: "100%" }}
                className=""
              >
                <ImageWithFallback
                  uri={formattedImages[0]?.uri}
                  style={{ width: "100%", height: "100%", borderRadius: 12 }}
                  iconProps={{ color: "gray" }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>
            <View className="w-1/2 flex gap-2">
              {formattedImages?.slice(1, 3).map((img: any, index: number) => (
                <View key={index} style={{ flex: 1 }}>
                  <TouchableOpacity onPress={() => handleImageClick(index + 1)}>
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
        return (
          <View className="flex-1 flex flex-row gap-2">
            <View className="w-1/2 flex gap-2">
              {formattedImages?.slice(0, 2).map((img: any, index: number) => (
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
            <View className="w-1/2 flex gap-2">
              {formattedImages?.slice(2, 4).map((img: any, index: number) => (
                <View key={index} style={{ flex: 1 }}>
                  <TouchableOpacity onPress={() => handleImageClick(index + 2)}>
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
    }
  };

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

      <View style={formattedImages?.length ? styles.imageContainer : undefined}>
        {renderImages()}
      </View>

      <View className="flex gap-2">
        {fileItems.map((item: any, index: number) => (
          <TouchableOpacity
          onPress={() => {
            if (item.imageUrl.includes(".pdf")) {
              handlePdfClick(item.imageUrl);
            } else {
              Linking.openURL(item.imageUrl);
            }
          }}
            key={index}
            className="border border-neutral-200 rounded-lg p-2 mt-1"
          >
            <Text lineBreakMode="clip" style={styles.fileText}>
              {decodeURI(item.imageUrl.split("/").pop() || "Unknown File")}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isPdfOpen && <PDFModalWebView visible={isPdfOpen} onClose={() => setIsPdfOpen(false)} pdfUrl={pdfUrl} />}

    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    minHeight: 150,
    maxHeight: 200,
  },
  fileText: {
    color: "#3A3B3C",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ImageGallery;
