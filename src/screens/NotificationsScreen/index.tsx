import { ActivityIndicator, FlatList, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  useGetUserNotification,
  useMarkAllNotificationAsRead,
} from "@/services/notification";
import NotificationCard from "@/components/molecules/Notification/NotificationCard";
import { RefreshControl } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";

const Notifications = () => {
  const {
    data: notificationData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isFetching,
    isSuccess,
  } = useGetUserNotification(10, true);
  const { mutate } = useMarkAllNotificationAsRead();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const notifications =
    notificationData?.pages.flatMap((page) => page.notifications) || [];

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const count = queryClient.getQueryData(["user_notification_total_count"]);
      if (count && Number(count) > 0 && isSuccess) {
        mutate();
      }
      return () => {
        queryClient.invalidateQueries({ queryKey: ["userNotification"] });
      };
    }, [isSuccess]),
  );

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={notifications}
        keyExtractor={(item) => item?._id?.toString()}
        renderItem={({ item }) => <NotificationCard data={item} />}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4">
              <ActivityIndicator size="small" color="#0000ff" />
            </View>
          ) : null
        }
        refreshing={refreshing}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
};

export default Notifications;
