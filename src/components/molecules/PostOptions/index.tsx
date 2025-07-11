import React from "react";
import {
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { OpenInBrowser, WhiteFlag, Bin } from "iconoir-react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { PostType } from "@/types/postType";

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  postID: string;

  isAdmin: boolean;
  onDelete: () => void;
  onReport?: () => void;
  type: PostType;
  isSinglePost?: boolean;
};

const PostActionModal = ({
  modalVisible,
  setModalVisible,
  postID,
  onDelete,
  isAdmin,
  onReport,
  type,
  isSinglePost = false,
}: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const openPost = () => {
    navigation.navigate("SinglePost", {
      postID,
      type,
    });
  };

  return (
    // <Modal
    //   visible={modalVisible}
    //   transparent
    //   animationType="slide"
    //   onRequestClose={() => setModalVisible(false)}
    // >
    <View>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.container}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {!isSinglePost && (
            <View style={styles.item}>
              <TouchableOpacity style={styles.button} onPress={openPost}>
                <OpenInBrowser width={20} height={20} color="#3A3B3C" />
                <Text style={styles.text}>Open Post</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.item}>
            <TouchableOpacity style={styles.button} onPress={onReport}>
              <WhiteFlag width={20} height={20} color="#6647FF" />
              <Text style={styles.text}>Report this Post</Text>
            </TouchableOpacity>
          </View>

          {isAdmin && (
            <TouchableOpacity
              onPress={() => onDelete()}
              className={`flex flex-row items-center gap-2 p-2`}
            >
              <Bin width={20} height={20} color="#6647FF" />
              <Text style={styles.text}>Delete Post</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

export default PostActionModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  item: {
    paddingVertical: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  text: {
    fontSize: 12,
    color: "#3A3B3C",
    fontWeight: "500",
  },
});
