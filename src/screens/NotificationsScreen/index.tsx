import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useGetUserNotification } from "@/services/notification";
import Tabs from "@/components/molecules/Tabs";
import Bell from "@/assets/icons/bell";
import Setting from "@/assets/icons/setting";
import { Calendar, Megaphone, Message, UserPlus } from "iconoir-react-native";
import { UserMainNotification } from "@/types/notifications";
import { notificationRoleAccess } from "@/constant/notification";
import { timeAgo } from "@/utils";

const iconMap = {
  comment: <Message color="#9b59b6" />,
  mention: <Megaphone color="#9b59b6" />,
  event: <Calendar color="#9b59b6" />,
  invite: <Calendar color="#9b59b6" />,
  follow: <UserPlus color="#9b59b6" />,
};

const Notifications = () => {
  const {
    data: notificationData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetUserNotification(10, true);

  const notifications =
    notificationData?.pages.flatMap((page) => page.notifications) || [];

  const renderMessage = ({ item }: { item: UserMainNotification }) => {
    const fullName =
      `${item?.sender_id?.firstName || ""} ${item?.sender_id?.lastName || ""}`.trim();

    switch (item.type) {
      case notificationRoleAccess.FOLLOW:
        return `started following you.`;

      case notificationRoleAccess.GROUP_INVITE:
        return `You have been invited to join ${item?.communityDetails?.name + "’s "} ${item?.communityGroupId?.title}`;

      case notificationRoleAccess.COMMENT:
        return `commented on your post: "${item?.message || ""}".`;

      case notificationRoleAccess.COMMUNITY_COMMENT:
        return `commented in the community ${item?.communityDetails?.name || ""}.`;

      case notificationRoleAccess.REACTED_TO_POST:
        return `reacted to your post.`;

      case notificationRoleAccess.REACTED_TO_COMMUNITY_POST:
        return `reacted to a post in ${item?.communityDetails?.name || "the community"}.`;

      default:
        return "You have a new notification.";
    }
  };

  const renderItem = ({ item }: { item: UserMainNotification }) => (
    <TouchableOpacity
      activeOpacity={item.type == notificationRoleAccess.GROUP_INVITE ? 1 : 0.5}
      className="flex-row items-center m-3 pb-3 border-b border-neutral-200"
    >
      <Image
        source={{
          uri:
            item?.communityGroupId?.communityGroupLogoUrl ||
            item?.sender_id?.profileDp,
        }}
        className="w-12 h-12 rounded-full mr-3"
      />
      <View className="flex-1 ">
        <View className="flex-row justify-between">
          <Text className="font-semibold text-lg">
            {`${item?.sender_id?.firstName || ""} ${item?.sender_id?.lastName || ""}`.trim()}
          </Text>
          <Text className="text-sm text-neutral-500">
            {timeAgo(item.createdAt)}
          </Text>
        </View>

        <Text className="text-neutral-500">{renderMessage({ item })}</Text>
      </View>
      <View>
        {item.type == notificationRoleAccess.GROUP_INVITE && (
          <TouchableOpacity className="border rounded-md py-1 px-2 border-primary-500">
            <Text className="text-primary-500">Accept</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
  const countUnReadNotification = notifications?.reduce((acc, notification) => {
    return acc + (notification.isRead ? 0 : 1);
  }, 0);

  return (
    <View className="flex-1 bg-white">
      <Tabs
        tabs={[
          {
            label: "Notifications",
            icon: <Bell />,
            badgeCount: countUnReadNotification.toString(),
            content: (
              <FlatList
                data={notifications}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderItem}
                onEndReached={() => hasNextPage && fetchNextPage()}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                  isFetchingNextPage ? (
                    <View className="py-4">
                      <ActivityIndicator size="small" color="#0000ff" />
                    </View>
                  ) : null
                }
              />
            ),
          },
          {
            label: "Settings",
            icon: <Setting />,
            content: undefined,
          },
        ]}
        onChange={() => {}}
      />
      {/*<FlatList
        data={notifications}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <Text className="text-center p-2">Loading more...</Text>
          ) : null
        }
      />*/}
    </View>
  );
};

export default Notifications;
