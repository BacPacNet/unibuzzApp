import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
} from "react-native";
import ImageCropPicker from "react-native-image-crop-picker";
import { NavArrowLeft, Check, X } from "iconoir-react-native";
import { FONTS } from "@/constants/fonts";

const { width: screenWidth } = Dimensions.get("window");

interface CircularImageCropperProps {
  visible: boolean;
  onClose: () => void;
  onImageCropped: (image: any) => void;
  initialImage?: any;
}

export default function CircularImageCropper({
  visible,
  onClose,
  onImageCropped,
  initialImage,
}: CircularImageCropperProps) {
  const [croppedImage, setCroppedImage] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImagePick = async () => {
    try {
      setIsProcessing(true);
      const image = await ImageCropPicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
        cropperActiveWidgetColor: "#6744FF",
        cropperStatusBarColor: "#6744FF",
        cropperToolbarColor: "#6744FF",
        cropperToolbarTitle: "Crop Profile Picture",
        cropperCancelText: "Cancel",
        cropperChooseText: "Choose",
        cropperRotateButtonsHidden: false,
        cropperToolbarWidgetColor: "#FFFFFF",
        cropperToolbarTitleTextStyle: {
          color: "#FFFFFF",
          fontFamily: FONTS.poppins.medium,
        },
        cropperCancelTextStyle: {
          color: "#FFFFFF",
          fontFamily: FONTS.poppins.medium,
        },
        cropperChooseTextStyle: {
          color: "#FFFFFF",
          fontFamily: FONTS.poppins.medium,
        },
      });

      if (image) {
        setCroppedImage(image);
      }
    } catch (error: any) {
      if (error.code !== "E_PICKER_CANCELLED") {
        Alert.alert("Error", "Failed to pick or crop image. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = () => {
    if (croppedImage) {
      onImageCropped(croppedImage);
      onClose();
      setCroppedImage(null);
    }
  };

  const handleClose = () => {
    setCroppedImage(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.backButton}>
            <X width={24} height={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile Picture</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {!croppedImage ? (
            <View style={styles.uploadSection}>
              <Text style={styles.uploadTitle}>Select and Crop Image</Text>
              <Text style={styles.uploadSubtitle}>
                Choose an image and crop it to a perfect circle for your profile
                picture
              </Text>

              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleImagePick}
                disabled={isProcessing}
              >
                <Text style={styles.uploadButtonText}>
                  {isProcessing ? "Processing..." : "Select Image"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.previewSection}>
              <Text style={styles.previewTitle}>Preview</Text>

              {/* Circular Image Preview */}
              <View style={styles.imagePreviewContainer}>
                <View style={styles.circularImagePreview}>
                  <Image
                    source={{ uri: croppedImage.path }}
                    style={styles.previewImage}
                  />
                </View>
              </View>

              <Text style={styles.previewSubtitle}>
                This is how your profile picture will look
              </Text>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.retakeButton}
                  onPress={() => setCroppedImage(null)}
                >
                  <Text style={styles.retakeButtonText}>Retake</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirm}
                >
                  <Check width={20} height={20} color="#FFFFFF" />
                  <Text style={styles.confirmButtonText}>Use This</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    fontFamily: FONTS.poppins.semiBold,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  uploadSection: {
    alignItems: "center",
    gap: 24,
  },
  uploadTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    fontFamily: FONTS.poppins.semiBold,
  },
  uploadSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    fontFamily: FONTS.inter.regular,
  },
  uploadButton: {
    backgroundColor: "#6744FF",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: FONTS.poppins.semiBold,
  },
  previewSection: {
    alignItems: "center",
    gap: 24,
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1F2937",
    fontFamily: FONTS.poppins.semiBold,
  },
  imagePreviewContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  circularImagePreview: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#6744FF",
    backgroundColor: "#F3F4F6",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  previewSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    fontFamily: FONTS.inter.regular,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
  },
  retakeButton: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  retakeButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: FONTS.poppins.medium,
  },
  confirmButton: {
    backgroundColor: "#6744FF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: FONTS.poppins.medium,
  },
});
