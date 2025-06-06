import { ActivityIndicator, FlatList, View } from "react-native";
import React, { useCallback, useState } from "react";
import { useGetUserNotification } from "@/services/notification";
import NotificationCard from "@/components/molecules/Notification/NotificationCard";
import { RefreshControl } from "react-native-gesture-handler";

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

  const [refreshing, setRefreshing] = useState(false);
  const notifications =
    notificationData?.pages.flatMap((page) => page.notifications) || [];

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id.toString()}
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
