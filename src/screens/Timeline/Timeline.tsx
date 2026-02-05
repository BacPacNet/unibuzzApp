import {
  ActivityIndicator,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import PostCard from "@/components/molecules/Timeline/PostCard";
import { useGetTimelinePosts } from "@/services/timeline";
import { RefreshControl } from "react-native-gesture-handler";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import CreatePostButton from "@/components/atoms/CreatePostButton";
import OnboardingPlaceholder from "@/components/molecules/OnboardingPlaceHolder";
import EmptyStateCard from "@/components/molecules/EmptyStateCard";
import QuiteHere from "@/assets/placeHolder/quiteHere.svg";
import { getUserProfileStore, getUserStore } from "@/storage/user";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import UserGuideLineBottomSheet from "@/components/molecules/UserGuideLineBottomSheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getNotificationToken } from "@/storage/NotificationToken";
import { getMixpanel } from "@/context/MixPanelProvider/MixPanelProvidex";
import { identifyUserInMixpanel } from "@/mixpanel/track";

type NavigationProp = StackNavigationProp<RootStackParamList, "Timeline">;
const Timeline = () => {
  const userProfileData = getUserProfileStore();
  const userData = getUserStore();
  const [refreshing, setRefreshing] = useState(false);

  const [showCreatePostButton, setShowCreatePostButton] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const guideLineActionSheetRef = useRef<ActionSheetRef>(null);
  const insets = useSafeAreaInsets();

  const navigation = useNavigation<NavigationProp>();
  const {
    isLoading,
    data: TimelinePosts,
    error,
    fetchNextPage: timelinePostsNextpage,
    isFetchingNextPage: timelinePostIsFetchingNextPage,
    hasNextPage: timelinePostHasNextPage,
    isFetching,
    isPending,
  } = useGetTimelinePosts(10);

  const queryClient = useQueryClient();

  const timlineDatas =
    TimelinePosts?.pages.flatMap((page) => page?.allPosts) || [];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    queryClient.invalidateQueries({ queryKey: ["timelinePosts"] });
    setRefreshing(false);
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;

    const isAtBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;
    if (isAtBottom) {
      setShowCreatePostButton(false);
    } else if (contentOffset.y > 100) {
      if (contentOffset.y < lastScrollY) {
        setShowCreatePostButton(true);
      } else if (contentOffset.y > lastScrollY) {
        setShowCreatePostButton(false);
      }
    }

    setLastScrollY(contentOffset.y);
  };

  useEffect(() => {
    if (userData?.isNewUser) {
      guideLineActionSheetRef.current?.show();
    }
  }, [userData?.isNewUser]);

  useEffect(() => {
    if (!userData) return;
    identifyUserInMixpanel({
      id: userData?.id,
      email: userData?.email,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
     
    });
  }, [userData?.id, userData?.email, userData?.firstName, userData?.lastName]);

  if (isPending) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#7367f0" />
      </View>
    );
  }

  return (
    <View style={{ position: "relative" }} className="bg-white flex-1 relative">
      {(showCreatePostButton || lastScrollY == 0) && (
        <CreatePostButton
          isAllowed={true}
          onPress={() => navigation.navigate("NewPost")}
        />
      )}

      <FlatList
        data={timlineDatas}
        style={{
          width: "100%",
          height: "100%",
        }}
        onScroll={handleScroll}
        keyExtractor={(item, index) => item._id + index}
        renderItem={({ item }) => (
          <PostCard data={item} isTimeline={true} isSinglePost={false} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={() => {
          if (timelinePostHasNextPage && !timelinePostIsFetchingNextPage) {
            timelinePostsNextpage();
          }
        }}
        ListFooterComponent={
          timelinePostIsFetchingNextPage && timelinePostHasNextPage ? (
            <View>
              <ActivityIndicator size="large" color="#7367f0" />
            </View>
          ) : (
            <View></View>
          )
        }
        ListEmptyComponent={
          isFetching ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#7367f0" />
            </View>
          ) : (
            <View className="flex-1 justify-center items-center">
              {userProfileData?.communities?.length &&
              userProfileData?.communities?.length > 0 ? (
                <EmptyStateCard
                  imageWidth={226}
                  imageHeight={158}
                  SvgComponent={QuiteHere}
                  title="It’s a little quiet in here..."
                  description="Join your university community to connect and see posts from fellow students in your timeline."
                />
              ) : (
                <OnboardingPlaceholder />
              )}
            </View>
          )
        }
      />

      <ActionSheet
        ref={guideLineActionSheetRef}
        gestureEnabled={false}
        closeOnPressBack={false}
        closeOnTouchBackdrop={false}
        safeAreaInsets={insets}
      >
        <UserGuideLineBottomSheet
          onClose={() => guideLineActionSheetRef.current?.hide()}
        />
      </ActionSheet>
    </View>
  );
};

export default Timeline;
