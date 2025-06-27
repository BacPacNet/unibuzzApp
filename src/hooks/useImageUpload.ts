import { useState } from "react";
import { launchImageLibrary } from "react-native-image-picker";

export type ImageAsset = {
  uri: string;
  fileName?: string;
  fileSize?: number;
  height?: number;
  width?: number;
  type?: string;
};

export const useImageUpload = () => {
  const [imageToUpload, setImageToUpload] = useState<ImageAsset | null>(null);
  const [bannerToUpload, setBannerToUpload] = useState<ImageAsset | null>(null);
  const [previewProfileImage, setPreviewProfileImage] = useState<string | null>(
    null,
  );
  const [previewBannerImage, setPreviewBannerImage] = useState<string | null>(
    null,
  );

  const handleImagePick = (type: "profile" | "banner") => {
    launchImageLibrary({ mediaType: "photo" }, (response: any) => {
      if (!response.didCancel && !response.errorCode) {
        const imageObject = response.assets[0];
        if (type === "profile") {
          setImageToUpload(imageObject);
        } else {
          setBannerToUpload(imageObject);
        }
      }
    });
  };

  return {
    imageToUpload,
    bannerToUpload,
    previewProfileImage,
    previewBannerImage,
    handleImagePick,
  };
};
