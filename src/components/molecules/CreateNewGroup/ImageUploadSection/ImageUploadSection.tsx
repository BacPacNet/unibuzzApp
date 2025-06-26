import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MediaImage, User } from "iconoir-react-native";
import { ImageAsset } from "../../../../hooks/useImageUpload";

interface ImageUploadSectionProps {
  imageToUpload: ImageAsset | null;
  bannerToUpload: ImageAsset | null;
  previewProfileImage: string | null;
  previewBannerImage: string | null;
  onImagePick: (type: 'profile' | 'banner') => void;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  imageToUpload,
  bannerToUpload,
  previewProfileImage,
  previewBannerImage,
  onImagePick,
}) => (
  <>
    {/* Profile Photo */}
    <View style={styles.photoSection}>
      <TouchableOpacity
        onPress={() => onImagePick('profile')}
        style={styles.photoUpload}
      >
        {(imageToUpload || previewProfileImage) && (
          <Image
            source={{ uri: imageToUpload?.uri || previewProfileImage! }}
            className="w-full h-full rounded-full absolute"
          />
        )}
        <User width={32} height={32} color="#9CA3AF" />
        <Text style={styles.photoUploadText}>Select Image</Text>
      </TouchableOpacity>
      <Text className="text-xs text-neutral-50-500">Max file size: 5 MB</Text>
    </View>

    {/* Banner Photo */}
    <View style={styles.photoSection}>
      <View style={styles.profileImageContainer}>
        <TouchableOpacity
          onPress={() => onImagePick('banner')}
          style={styles.bannerUpload}
        >
          {(bannerToUpload || previewBannerImage) && (
            <Image
              source={{ uri: bannerToUpload?.uri || previewBannerImage! }}
              className="w-full h-full absolute"
            />
          )}
          <MediaImage width={32} height={32} color="#9CA3AF" />
          <Text style={styles.photoUploadText}>Select Image</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-xs text-neutral-500">Max file size: 5 MB</Text>
    </View>
  </>
);

const styles = StyleSheet.create({
  photoSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  profileImageContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  photoUpload: {
    width: 160,
    height: 160,
    borderRadius: 200,
    borderWidth: 2,
    borderColor: "#9685FF",
    alignItems: "center",
    justifyContent: "center",
  },
  photoUploadText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
  },
  bannerUpload: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#9685FF",
    alignItems: "center",
    justifyContent: "center",
  },
}); 