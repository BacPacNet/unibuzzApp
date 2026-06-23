import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WarningCircle } from "iconoir-react-native";
import ReusableButton from "@/components/atoms/ReusableButton";
import {
  HighlightPostType,
  useAddUniversityHighlightPost,
} from "@/services/universitySearch";
import { PostType } from "@/types/postType";
import { FONTS } from "@/constants/fonts";

type Props = {
  visible: boolean;
  setModalVisible: (visible: boolean) => void;
  postID: string;
  isType: PostType.Community | PostType.Timeline;
  universityId: string;
  universityName: string;
};

const PromotePostModal = ({
  visible,
  setModalVisible,
  postID,
  isType,
  universityId,
  universityName,
}: Props) => {
  const { mutate: addHighlightPost, isPending } =
    useAddUniversityHighlightPost(universityId);

  const handlePromote = () => {
    const postType: HighlightPostType =
      isType === PostType.Community ? "CommunityPost" : "UserPost";

    addHighlightPost(
      {
        postId: postID,
        postType,
        position: 0,
      },
      { onSuccess: () => setModalVisible(false) }
    );
  };

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={() => setModalVisible(false)}
      animationType="fade"
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => setModalVisible(false)}
      >
        <View style={styles.container} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>Promote this Post</Text>

          <View style={styles.infoBox}>
            <WarningCircle width={20} height={20} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Public Visibility</Text>
              <Text style={styles.infoText}>
                This promotional post will be visible to people outside of{" "}
                {universityName || "the university"} on the discovery page.
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <ReusableButton
              buttonText="Cancel"
              onPress={() => setModalVisible(false)}
              variant="border"
              height="medium"
              size="w-1/2"
              isRounded={false}
            />
            <ReusableButton
              buttonText="Promote Post"
              onPress={handlePromote}
              variant="primary"
              height="medium"
              size="w-1/2"
              isLoading={isPending}
              disabled={isPending || !universityId}
              isRounded={false}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default PromotePostModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 350,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#18191A",
    fontFamily: FONTS.inter.medium,

  },
  infoBox: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 24,
    
  },
  infoContent: {
    flex: 1,
    gap: 4,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: FONTS.inter.semiBold,
    color: "#18191A",
  },
  infoText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 18,
    fontFamily: FONTS.inter.regular,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
   
  },
});
