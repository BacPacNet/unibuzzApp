import ReusableButton from "@/components/atoms/ReusableButton";
import {
  useChangeCommunityGroupStatus,
  useJoinRequestPrivateGroup,
} from "@/services/community-group";
import { useJoinCommunityGroup } from "@/services/notification";
import {
  notificationRoleAccess,
  notificationStatus,
} from "@/types/notifications";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type NotificationActionsProps = {
  data: any;
};

export const NotificationActions = ({ data }: NotificationActionsProps) => {
  const { mutate: joinGroup } = useJoinCommunityGroup();
  const { mutate: changeGroupStatus } = useChangeCommunityGroupStatus(
    data?.communityGroupId?._id || ""
  );
  const { mutate: handleJoinCommunityRequest } = useJoinRequestPrivateGroup(
    data?.communityGroupId?._id || ""
  );

  const handleAcceptInvite = () => {
    if (!data?.communityGroupId?._id) return;

    if (data.type === notificationRoleAccess.GROUP_INVITE) {
      const payload: any = {
        isAccepted: true,
        groupId: data.communityGroupId._id,
        id: data._id,
      };
      joinGroup(payload);
    }
  };

  const handleChangeGroupStatus = (status: string) => {
    switch (data?.type) {
      case notificationRoleAccess.OFFICIAL_GROUP_REQUEST:
        changeGroupStatus({
          status,
          notificationId: data._id,
          communityGroupId: data?.communityGroupId?._id,
          adminId: data?.receiverId,
          userId: data?.sender_id?._id,
        });
        break;

      case notificationRoleAccess.PRIVATE_GROUP_REQUEST:
        handleJoinCommunityRequest({
          status,
          notificationId: data._id,
          userId: data?.sender_id?._id,
          adminId: data?.receiverId,
          communityGroupId: data?.communityGroupId?._id,
        });
        break;
    }
  };

  if (!data) return null;

  switch (data?.type) {
    case notificationRoleAccess.GROUP_INVITE: {
      if (data?.status === notificationStatus.default) {
        return (
          <ReusableButton
            buttonText="Accept Request"
            variant="primary"
            size="w-1/2"
            onPress={handleAcceptInvite}
          />
        );
      } else if (data?.status === notificationStatus.accepted) {
        return (
          <Text style={styles.successText}>You have accepted the invite.</Text>
        );
      } else if (data?.status === notificationStatus.rejected) {
        return (
          <Text style={styles.rejectText}>You have rejected the invite.</Text>
        );
      }
      return null;
    }

    case notificationRoleAccess.OFFICIAL_GROUP_REQUEST:
    case notificationRoleAccess.PRIVATE_GROUP_REQUEST: {
      if (data?.status === notificationStatus.accepted) {
        return (
          <Text style={styles.successText}>You have accepted the request.</Text>
        );
      } else if (data?.status === notificationStatus.rejected) {
        return (
          <Text style={styles.rejectText}>You have rejected the request.</Text>
        );
      } else {
        return (
          <View style={styles.buttonContainer}>
            <ReusableButton
              buttonText="Accept Request"
              variant="primary"
              size="w-1/2"
              onPress={() => handleChangeGroupStatus("accepted")}
            />

            <ReusableButton
              buttonText="Reject Request"
              variant="danger"
              size="w-1/2"
              onPress={() => handleChangeGroupStatus("rejected")}
            />
          </View>
        );
      }
    }

    default:
      return <Text></Text>;
  }
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  acceptButton: {
    backgroundColor: "#e0f2fe",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  rejectButton: {
    backgroundColor: "#fee2e2",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 14,
    color: "#0369a1",
    fontWeight: "600",
  },
  rejectButtonText: {
    fontSize: 14,
    color: "#b91c1c",
    fontWeight: "600",
  },
  successText: {
    fontSize: 12,
    color: "#16a34a",
  },
  rejectText: {
    fontSize: 12,
    color: "#dc2626",
  },
});
