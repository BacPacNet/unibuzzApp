import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useForm } from "react-hook-form";
import { ContentType, ReportContentModalProps } from "@/types/report-content";
import { useCreateReportContent } from "@/services/report-content";
import ReusableButton from "@/components/atoms/ReusableButton";

interface RNReportModalProps extends ReportContentModalProps {
  visible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const ReportContentModal = ({
  visible,
  postID,
  contentType,
  reporterId,
  commentId,
  parentCommentId,
  setModalVisible,
}: RNReportModalProps) => {
  const { mutate: mutateCreateReportContent, isPending } =
    useCreateReportContent();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const currDescription = watch("description");

  const onSubmit = (data: any) => {
    const payload = {
      reporterId,
      contentType,
      description: data.description,
      ...(contentType === ContentType.USER_POST && { userPostId: postID }),
      ...(contentType === ContentType.COMMUNITY_POST && {
        communityPostId: postID,
      }),
      ...(contentType === ContentType.COMMUNITY_GROUP_POST && {
        communityPostId: postID,
      }),
      ...(commentId &&
        contentType === ContentType.USER_COMMENT && {
          userPostId: postID,
          userPostCommentId: commentId,
        }),
      ...(commentId &&
        contentType === ContentType.USER_REPLY && {
          userPostId: postID,
          userPostCommentId: parentCommentId,
          userPostReplyId: commentId,
        }),
      ...(commentId &&
        contentType === ContentType.COMMUNITY_COMMENT && {
          communityPostId: postID,
          communityPostCommentId: commentId,
        }),
      ...(commentId &&
        contentType === ContentType.COMMUNITY_REPLY && {
          communityPostId: postID,
          communityPostCommentId: parentCommentId,
          communityPostReplyId: commentId,
        }),
      ...(commentId &&
        contentType === ContentType.COMMUNITY_GROUP_COMMENT && {
          communityPostId: postID,
          communityPostCommentId: commentId,
        }),
      ...(commentId &&
        contentType === ContentType.COMMUNITY_GROUP_REPLY && {
          communityPostId: postID,
          communityPostCommentId: parentCommentId,
          communityPostReplyId: commentId,
        }),
    };
    mutateCreateReportContent(payload, {
      onSuccess: () => setModalVisible(false),
    });
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
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>Report Form</Text>
            <Text style={styles.charCount}>
              {currDescription?.trim()?.length || 0}/480
            </Text>
          </View>

          <TextInput
            placeholder="Tell us what happened"
            multiline
            placeholderTextColor="#9CA3AF"
            maxLength={480}
            onChangeText={(text) =>
              setValue("description", text, { shouldValidate: true })
            }
            style={styles.textArea}
          />
          {errors?.description && (
            <Text style={styles.error}>
              {errors.description.message?.toString()}
            </Text>
          )}

          <ReusableButton
            buttonText="Send Report"
            onPress={handleSubmit(onSubmit)}
            variant="danger"
            height="large"
            size="w-full"
            isLoading={isPending}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ReportContentModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 330,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  charCount: {
    fontSize: 12,
    color: "#777",
  },
  textArea: {
    height: 150,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#1F2937",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  error: {
    color: "red",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#d9534f",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 10,
    alignSelf: "center",
  },
  closeText: {
    color: "#555",
  },
});
