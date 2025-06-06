import { RootStackParamList } from "@/types/navigation";
import { notificationRoleAccess } from "@/types/notifications";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";

type NotificationMessageProps = {
  data: any;
};
type NavigationProp = StackNavigationProp<RootStackParamList, "Notifications">;

export const NotificationMessage = ({ data }: NotificationMessageProps) => {
  const navigation = useNavigation<NavigationProp>();
  const fullName =
    `${data?.sender_id?.firstName || ""} ${data?.sender_id?.lastName || ""}`.trim();

  const handleGroupPress = () => {
    return navigation.navigate("CommunityGroup", {
      communityId: data.communityGroupId?.communityId,
      communityGroupId: data.communityGroupId?._id,
    });
  };

  switch (data.type) {
    case notificationRoleAccess.FOLLOW:
      return (
        <Text style={styles.text}>
          <Text style={styles.bold}>{fullName}</Text> started following you.
        </Text>
      );

    case notificationRoleAccess.GROUP_INVITE:
      return (
        <Text style={styles.text}>
          You have been invited to join{" "}
          <Text onPress={handleGroupPress} style={styles.link}>
            {data?.communityGroupId?.title}
          </Text>{" "}
          in {data?.communityDetails?.name}.
        </Text>
      );

    case notificationRoleAccess.COMMENT: {
      const name = data?.commentedBy?.newFiveUsers?.[0]?.name || "Someone";
      const total = data?.commentedBy?.totalCount || 0;
      return (
        <Text style={styles.text}>
          <Text style={styles.bold}>{name}</Text>
          {total > 1
            ? ` and ${total - 1} others commented on your post`
            : " commented on your post."}
        </Text>
      );
    }

    case notificationRoleAccess.COMMUNITY_COMMENT: {
      const name = data?.commentedBy?.newFiveUsers?.[0]?.name || "Someone";
      const total = data?.commentedBy?.totalCount || 0;
      return (
        <Text style={styles.text}>
          <Text style={styles.bold}>{name}</Text>
          {total > 1
            ? ` and ${total - 1} others commented on your community post`
            : " commented on your community post."}
        </Text>
      );
    }

    case notificationRoleAccess.REACTED_TO_POST: {
      const name = data?.likedBy?.newFiveUsers?.[0]?.name || "Someone";
      const total = data?.likedBy?.totalCount || 0;
      return (
        <Text style={styles.text}>
          <Text style={styles.bold}>{name}</Text>
          {total > 1
            ? ` and ${total - 1} others liked your post`
            : " liked your post."}
        </Text>
      );
    }

    case notificationRoleAccess.REACTED_TO_COMMUNITY_POST: {
      const name = data?.likedBy?.newFiveUsers?.[0]?.name || "Someone";
      const total = data?.likedBy?.totalCount || 0;
      return (
        <Text style={styles.text}>
          <Text style={styles.bold}>{name}</Text>
          {total > 1
            ? ` and ${total - 1} others liked your Community post`
            : " liked your Community post."}
        </Text>
      );
    }

    case notificationRoleAccess.OFFICIAL_GROUP_REQUEST:
      return (
        <Text style={styles.text}>
          <Text style={styles.bold}>{data?.communityGroupId?.title}</Text> in{" "}
          {data?.communityDetails?.name} has sent a request to become an
          official group.
        </Text>
      );

    case notificationRoleAccess.PRIVATE_GROUP_REQUEST:
      return (
        <Text style={styles.text}>
          <Text style={styles.bold}>{fullName}</Text> has sent a request to join{" "}
          <Text style={styles.bold}>{data?.communityGroupId?.title}</Text> in{" "}
          {data?.communityDetails?.name}
        </Text>
      );

    case notificationRoleAccess.REJECTED_OFFICIAL_GROUP_REQUEST:
      return (
        <Text style={styles.text}>
          Your request to make{" "}
          <Text style={styles.bold}>{data?.communityGroupId?.title}</Text> in{" "}
          {data?.communityDetails?.name} official has been rejected.
        </Text>
      );

    case notificationRoleAccess.ACCEPTED_OFFICIAL_GROUP_REQUEST:
      return (
        <Text style={styles.text}>
          Your request to make{" "}
          <Text style={styles.bold}>{data?.communityGroupId?.title}</Text> in{" "}
          {data?.communityDetails?.name} official has been accepted.
        </Text>
      );

    case notificationRoleAccess.REJECTED_PRIVATE_GROUP_REQUEST:
      return (
        <Text style={styles.text}>
          Your request to join{" "}
          <Text style={styles.bold}>{data?.communityGroupId?.title}</Text> in{" "}
          {data?.communityDetails?.name} has been rejected.
        </Text>
      );

    case notificationRoleAccess.ACCEPTED_PRIVATE_GROUP_REQUEST:
      return (
        <Text style={styles.text}>
          Your request to join{" "}
          <Text style={styles.bold}>{data?.communityGroupId?.title}</Text> in{" "}
          {data?.communityDetails?.name} has been accepted.
        </Text>
      );

    case notificationRoleAccess.DELETED_COMMUNITY_GROUP:
      return <Text style={styles.text}>{data.message}.</Text>;

    default:
      return <Text style={styles.text}>You have a new notification.</Text>;
  }
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontFamily: "System",
    color: "#111827",
  },
  bold: {
    fontWeight: "bold",
  },
  link: {
    fontWeight: "600",
    textDecorationLine: "underline",
    color: "#9685FF",
  },
});
