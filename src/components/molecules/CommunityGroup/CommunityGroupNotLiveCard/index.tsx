import React from "react";
import { View, Text, StyleSheet, GestureResponderEvent } from "react-native";

import { useChangeCommunityGroupStatus } from "@/services/community-group";

import { useJoinCommunityGroup } from "@/services/notification";
import { getUserStore } from "@/storage/user";
import {
  notificationRoleAccess,
  notificationStatus as notificationStatusEnum,
} from "@/types/notifications";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";
import ReusableButton from "@/components/atoms/ReusableButton";

type CommunityGroupNotLiveCardProps = {
  communityAdminId: string;
  communityGroupId: string;
  communityGroupAdminId: string;
  notificationType: string;
  notificationId: string;
  notificationStatus: string;
  refetch: () => void;
  communityID: string;

  communityGroupTitle: string;
  communityName: string;
};

type NavigationProp = StackNavigationProp<RootStackParamList, "CommunityGroup">;
const CommunityGroupNotLiveCard = ({
  communityAdminId,
  communityGroupId,
  communityGroupAdminId,
  notificationType,
  notificationId,
  notificationStatus,
  refetch,
  communityID,
  communityGroupTitle,
  communityName,
}: CommunityGroupNotLiveCardProps) => {
  const navigation = useNavigation<NavigationProp>();
  const { mutate: changeGroupStatus, isPending: isChangeStatusPending } =
    useChangeCommunityGroupStatus(communityGroupId || "");
  const userData = getUserStore();
  const { mutate: joinGroup, isPending: isJoinGroupPending } =
    useJoinCommunityGroup();

  const handleAcceptInvite = () => (e: GestureResponderEvent) => {
    e.stopPropagation?.();
    if (!communityGroupId) return;

    if (notificationType === notificationRoleAccess.GROUP_INVITE) {
      const payload = {
        isAccepted: true,
        groupId: communityGroupId,
        id: notificationId,
      };
      joinGroup(payload, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  const handleChangeGroupStatus =
    (status: string) => (e: GestureResponderEvent) => {
      e.stopPropagation?.();

      switch (notificationType) {
        case notificationRoleAccess.OFFICIAL_GROUP_REQUEST:
          changeGroupStatus(
            {
              status,
              notificationId,
              communityGroupId: communityGroupId,
              adminId: communityAdminId,
              userId: communityGroupAdminId,
              text:
                status == notificationStatusEnum.accepted
                  ? `Congratulations! ${communityGroupTitle} is now officially recognized by ${communityName}.`
                  : `Your request to create ${communityGroupTitle} as an official group at ${communityName} was not approved.`,
            },
            {
              onSuccess: () => {
                refetch();
                if (status == "rejected") {
                  navigation.navigate("Community", {
                    communityId: communityID,
                  });
                }
              },
            }
          );
          break;

        default:
          break;
      }
    };

  if (notificationStatus == notificationStatusEnum.accepted) return null;

  return (
    <View style={styles.card}>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>Request Pending</Text>
        <Text style={styles.description}>
          This group is awaiting university admin approval. Members will be able
          to access the group once the review is complete.
        </Text>
      </View>

      <View style={styles.actions}>
        {userData?.id?.toString() == communityAdminId?.toString() &&
        notificationType == notificationRoleAccess.OFFICIAL_GROUP_REQUEST ? (
          <View style={styles.actionRow}>
            <ReusableButton
              buttonText="Reject"
              onPress={() => handleChangeGroupStatus("rejected")({} as any)}
              variant="danger"
              size={75}
              disabled={isChangeStatusPending}
            />
            <ReusableButton
              buttonText="Accept"
              onPress={() => handleChangeGroupStatus("accepted")({} as any)}
              variant="primary"
              size={75}
              disabled={isChangeStatusPending}
            />
          </View>
        ) : notificationType == notificationRoleAccess.GROUP_INVITE &&
          notificationStatus == notificationStatusEnum.default &&
          userData?.id?.toString() !== communityGroupAdminId?.toString() ? (
          <View style={styles.actionRow}>
            <ReusableButton
              buttonText="Accept Request"
              onPress={() => handleAcceptInvite()({} as any)}
              variant="border_primary"
              activityIndicatorColor=""
              size={125}
              isLoading={isJoinGroupPending}
              disabled={isJoinGroupPending}
            />
            {/* <TouchableOpacity
              onPress={handleAcceptInvite()}
              style={[styles.button, styles.borderButton]}
            >
              <Text style={styles.buttonText}>Accept Request</Text>
            </TouchableOpacity> */}
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: "#fff",

    marginBottom: 16,
    padding: 16,
    flexDirection: "column",
    gap: 16,
  },
  textWrapper: {
    flexDirection: "column",
    gap: 8,
  },
  title: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 14,
  },
  description: {
    color: "#374151",
    fontSize: 14,
  },
  actions: {
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  rejectButton: {
    backgroundColor: "#F87171",
  },
  acceptButton: {
    backgroundColor: "#2563EB",
  },
  borderButton: {
    borderWidth: 1,
    borderColor: "#2563EB",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
  },
});

export default CommunityGroupNotLiveCard;
