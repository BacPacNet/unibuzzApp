import { FONTS } from "@/constants/fonts";
import { Camera, MediaImage } from "iconoir-react-native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ImageOptionSelectBottomSheetProps {
  title: string;
  onTakePhoto: () => void;
  onUploadFromPhotos: () => void;
  onClose?: () => void;
}

const ImageOptionSelectBottomSheet = ({
  title,
  onTakePhoto,
  onUploadFromPhotos,
  onClose,
}: ImageOptionSelectBottomSheetProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Option buttons */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => {
            onTakePhoto();
            onClose?.();
          }}
        >
          <Camera width={16} height={16} strokeWidth={2} color="#3a3b3c" />
          <Text style={styles.optionText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => {
            onUploadFromPhotos();
            onClose?.();
          }}
        >
          <MediaImage width={16} height={16} strokeWidth={2} color="#3a3b3c" />
          <Text style={styles.optionText}>Upload from Photos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 0,
    gap: 16,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: FONTS.poppins.bold,
    fontSize: 18,
    textAlign: "center",
    color: "#18191a",
  },

  optionsContainer: {
    gap: 16,
  },

  optionText: {
    fontSize: 14,
    color: "#3a3b3c",
    fontFamily: FONTS.inter.medium,
  },
  optionButton: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
});

export default ImageOptionSelectBottomSheet;
