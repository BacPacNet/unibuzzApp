import { useCommunityContext } from "@/context/CommunityProvider/CommunityProvider";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { useGetCommunityGroupPost } from "@/services/university-community";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getUserProfileStore, getUserStore } from "@/storage/user";
import PostCard from "@/components/molecules/Timeline/PostCard";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetCommunityGroup,
  useJoinCommunityGroup,
  useLeaveCommunityGroup,
} from "@/services/community-group";
import { Toast } from "react-native-toast-notifications";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { CommunityGroupMembersModal } from "@/components/molecules/CommunityGroup/CommunityMembersModal";
import {
  AllFiltersCommunityGroupPost,
  CommunityGroupTypeEnum,
  CommunityGroupVisibility,
  communityPostStatus,
  status,
} from "@/types/CommunityGroup";
import CommunityGroupActionModal from "@/components/molecules/CommunityGroup/CommunityGroupActionModal";
import FlatListCommunityHeader from "@/components/molecules/CommunityGroup/CommunityGroupHeaderFlatList";
import { Refresh } from "@/components/atoms/RefreshSpinner";
import CreatePostButton from "@/components/atoms/CreatePostButton";
import { AxiosError } from "axios";
import EmptyStateCard from "@/components/molecules/EmptyStateCard";
import NotMember from "@/assets/placeHolder/notMember.svg";
import NoPostFromGroup from "@/assets/placeHolder/NoPostFromGroup.svg";
import notPendingNoPostPlaceholder from "@/assets/placeHolder/firstTimeUser.svg";
import { screenName } from "@/constant/screenName";
import useCustomBackHandler from "@/hooks/useCustomBackHandler";
import { NativeSyntheticEvent } from "react-native";
import { NativeScrollEvent } from "react-native";
import CommunityGroupNotLiveCard from "@/components/molecules/CommunityGroup/CommunityGroupNotLiveCard";
import { CommunityGroupPostFilter } from "@/components/molecules/CommunityGroup/CommunityGroupPostFilter";
import CommunityGroupPendingPostCard from "@/components/molecules/CommunityGroup/CommunityGroupPendingPostCard";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { MESSAGES, TRACK_EVENT } from "@/content/constant";
import ErrorContainer from "@/components/molecules/ErrorContainer";
import Tabs from "@/components/molecules/Tabs";

type NavigationProp = StackNavigationProp<RootStackParamList, "CommunityGroup">;

const CommunityGroupScreen = ({ route }: any) => {
  const navigation = useNavigation<NavigationProp>();
  const { communityId, communityGroupId } = route.params;
  const from = route?.params?.from || "";
  const filterPostByParam = route?.params?.filterPostBy || "";
  const { setCurrentCommunityId, setIsCommunityGroup, selectedCommunityId } =
    useCommunityContext();
  const userData = getUserStore();
  const userProfileData = getUserProfileStore();
  const membersBottomSheet = useRef<ActionSheetRef>(null);
  const insets = useSafeAreaInsets();
  const {
    data: communityGroups,
    refetch,
    isError: isCommunityGroupError,
  } = useGetCommunityGroup(communityId, communityGroupId);
  const timeTrackingProperties = useMemo(
    () => ({
      communityId,
      groupId: communityGroupId,
      groupName: communityGroups?.title,
    }),
    [communityId, communityGroupId, communityGroups?.title]
  );
  useTimeTracking(
    TRACK_EVENT.COMMUNITY_GROUP_PAGE_VIEW_DURATION,
    timeTrackingProperties
  );
  const { mutate: joinCommunityGroup, isPending: isJoinCommunityPending } =
    useJoinCommunityGroup();
  const { mutate: leaveCommunityGroup, isPending: isLeaveCommunityPending } =
    useLeaveCommunityGroup();
  const [isUserJoinedCommunityGroup, setIsUserJoinedCommunityGroup] = useState<
    boolean | null
  >(null);
  const [pendingPostCount, setPendingPostCount] = useState(0);
  const [filterPostBy, setFilterPostBy] = useState(() => filterPostByParam);

  const {
    data: communityGroupPost,
    fetchNextPage: communityPostNextpage,
    isFetchingNextPage: communityPostIsFetchingNextPage,
    hasNextPage: communityPostHasNextPage,
    isLoading,
    error,
    isFetching,
    dataUpdatedAt,
  } = useGetCommunityGroupPost(
    communityId,
    communityGroupId,
    true,
    10,
    filterPostBy
  );
  const [communityGroupPostDatas, setCommunityGroupPostDatas] = useState<any>(
    []
  );

  const [isGroupAdmin, setIsGroupAdmin] = useState(false);
  const [imageSrc, setImageSrc] = useState(
    communityGroups?.communityGroupLogoCoverUrl?.imageUrl || ""
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [ImageSrcErr, setImageSrcErr] = useState(false);
  const [logoSrc, setLogoSrc] = useState(
    communityGroups?.communityGroupLogoUrl?.imageUrl || ""
  );

  const [logoSrcErr, setLogoSrcErr] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [showCreatePostButton, setShowCreatePostButton] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const queryClient = useQueryClient();

  const isGroupOfficial =
    communityGroups?.communityGroupType === CommunityGroupTypeEnum.OFFICIAL;
  const isGroupPrivate =
    communityGroups?.communityGroupAccess === CommunityGroupVisibility.PRIVATE;

  const isCommunityGroupLive = useMemo(() => {
    return communityGroups?.isCommunityGroupLive || false;
  }, [communityGroups?.isCommunityGroupLive]);

  const isUserVerifiedForCommunity = useMemo(() => {
    return (
      userProfileData?.email?.some(
        (email) => email.communityId === communityGroups?.communityId?._id
      ) || false
    );
  }, [userProfileData, communityGroups]);

  const userStatus = useMemo(() => {
    return communityGroups?.users?.find(
      (user) => user._id === userProfileData?.users_id
    )?.status as status;
  }, [communityGroups, userProfileData]);

  const communityGroupPendingPostCount = useMemo(
    () => communityGroupPost?.pages.flatMap((page) => page?.pendingTotal) || 0,
    [communityGroupPost?.pages, isFetching]
  );

  const CommunityGroupMember = communityGroups?.users?.filter(
    (user: { status: status }) => user.status === status.accepted
  );

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

  useFocusEffect(
    useCallback(() => {
      setCurrentCommunityId(communityId);

      if (selectedCommunityId == communityId) {
        setIsCommunityGroup(true);
      }
      return () => {
        setCurrentCommunityId("");
        setIsCommunityGroup(false);
      };
    }, [communityId, setCurrentCommunityId])
  );

  useEffect(() => {
    if (!isCommunityGroupError && communityGroups && userData) {
      const { id } = userData;
      setIsGroupAdmin(
        communityGroups.adminUserId.toString() === id?.toString()
      );
    }
  }, [communityGroups, userData, isCommunityGroupError]);

  useEffect(() => {
    if (!isCommunityGroupError && communityGroups && userData) {
      setIsUserJoinedCommunityGroup(
        communityGroups?.users?.some(
          (item) =>
            item?._id?.toString() === userData.id && item?.isRequestAccepted
        )
      );
    }
  }, [communityGroups, userData, isCommunityGroupError]);

  useEffect(() => {
    if (!isCommunityGroupError) {
      setLogoSrcErr(false);
      setImageSrcErr(false);
      if (communityGroups) {
        setLogoSrc(communityGroups?.communityGroupLogoUrl?.imageUrl || "");
        setImageSrc(
          communityGroups?.communityGroupLogoCoverUrl?.imageUrl || ""
        );
      }
    }
  }, [communityGroups, isCommunityGroupError]);

  useEffect(() => {
    if (!isCommunityGroupError && isFetching) {
      setCommunityGroupPostDatas([]);
    }
  }, [isFetching, isCommunityGroupError]);

  useEffect(() => {
    if (!isCommunityGroupError) {
      const communityDatas: any = communityGroupPost?.pages.flatMap(
        (page) => page?.finalPost
      );
      setCommunityGroupPostDatas(communityDatas);
    }
  }, [communityGroupPost, dataUpdatedAt, isCommunityGroupError]);

  useEffect(() => {
    if (
      Array.isArray(communityGroupPendingPostCount) &&
      communityGroupPendingPostCount[0] > 0
    ) {
      setPendingPostCount(communityGroupPendingPostCount[0]);
    } else {
      setPendingPostCount(0);
    }
  }, [communityGroupPendingPostCount]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    queryClient.invalidateQueries({
      queryKey: ["communityGroupsPost", communityId, communityGroupId],
    });
    refetch();
    setRefreshing(false);
  }, [queryClient, communityId, communityGroupId, refetch]);

  const handleToggleJoinCommunityGroup = () => {
    if (communityGroups?.adminUserId == userData?.id) {
      setModalVisible(false);
      Toast.hideAll();
      return Toast.show("You are Admin!");
    }

    if (!isUserJoinedCommunityGroup) {
      joinCommunityGroup(communityGroupId, {
        onSuccess: () => {
          setIsUserJoinedCommunityGroup(true);
        },
      });
    } else {
      leaveCommunityGroup(communityGroupId, {
        onSuccess: () => {
          setIsUserJoinedCommunityGroup(false);
          setModalVisible(false);
          hideBottomBar();
        },
      });
    }
  };

  const leaveCommunityGroupFunction = () => {
    leaveCommunityGroup(communityGroupId, {
      onSuccess: () => {
        setIsUserJoinedCommunityGroup(false);
      },
    });
  };

  const hideBottomBar = () => {
    membersBottomSheet.current?.hide();
  };

  const handleNavigateToEditCommunityGroupScreen = () => {
    hideBottomBar();
    setModalVisible(false);

    navigation.navigate("Groups", {
      screen: "EditCommunityGroupScreen",
      params: {
        communityId: communityId._id,
        communityGroups: communityGroups,
      },
    });
  };

  const handleBack = useCallback(() => {
    setFilterPostBy("");

    if (from === screenName.notifications) {
      navigation.navigate("Notifications");
    }
    if (from === screenName.manageCommunityGroup) {
      navigation.navigate("Groups", {
        screen: "SearchCommunityGroupScreen",

        params: { communityId: communityId },
      });
    } else {
      navigation.goBack();
    }
  }, [from, communityId, navigation]);
  useCustomBackHandler(handleBack);

  const COMMUNITY_GROUP_TABS = [
    {
      key: "",
      label: AllFiltersCommunityGroupPost.allPosts,
    },
    {
      key: "myPosts",
      label: AllFiltersCommunityGroupPost.myPosts,
    },
    {
      key: "pendingPosts",
      label: AllFiltersCommunityGroupPost.pendingPosts,
      showBadge: true,
    },
  ];

  const communityGroupTabs = COMMUNITY_GROUP_TABS.map((tab) => ({
    label: tab.label,
    badgeCount:
      tab.showBadge && pendingPostCount > 0
        ? String(pendingPostCount)
        : undefined,
    //   tab.showBadge ? String(10) : undefined,
    content: <View />,
  }));

  const FlatListHeaderWithError = useMemo(
    () => (
      <View>
        <FlatListCommunityHeader
          imageSrc={imageSrc}
          logoSrc={logoSrc}
          isGroupOfficial={isGroupOfficial}
          isGroupPrivate={isGroupPrivate}
          groupStatus={communityGroups?.status as string}
          isUserJoinedCommunityGroup={isUserJoinedCommunityGroup}
          isGroupAdmin={isGroupAdmin}
          isUserVerifiedForCommunity={isUserVerifiedForCommunity}
          isJoinCommunityPending={isJoinCommunityPending}
          logoSrcErr={logoSrcErr}
          setLogoSrcErr={setLogoSrcErr}
          ImageSrcErr={ImageSrcErr}
          setImageSrcErr={setImageSrcErr}
          communityGroups={communityGroups}
          userStatus={userStatus}
          handleToggleJoinCommunityGroup={handleToggleJoinCommunityGroup}
          setModalVisible={setModalVisible}
          membersBottomSheet={membersBottomSheet}
          communityLogoUrl={
            communityGroups?.communityId?.communityLogoUrl.imageUrl || ""
          }
          adminId={communityGroups?.adminUserId.toString() || ""}
          leaveCommunityGroup={leaveCommunityGroupFunction}
          isCommunityGroupNotLive={!isCommunityGroupLive}
          refetch={onRefresh}
        />

        {isCommunityGroupLive && isUserJoinedCommunityGroup && (
          <View style={styles.tabsContainer}>
            <Tabs
              tabs={communityGroupTabs}
              activeIndex={COMMUNITY_GROUP_TABS.findIndex(
                (tab) => tab.key === filterPostBy
              )}
              onChange={(index) => {
                setFilterPostBy(COMMUNITY_GROUP_TABS[index].key);
              }}
            />
          </View>
        )}

        {!isCommunityGroupLive ? (
          <CommunityGroupNotLiveCard
            communityID={communityId}
            communityAdminId={communityGroups?.communityId.adminId as string[]}
            communityGroupId={communityGroups?._id as string}
            communityGroupAdminId={communityGroups?.adminUserId as string}
            notificationType={communityGroups?.notificationTypes as string}
            notificationId={communityGroups?.notificationId as string}
            notificationStatus={communityGroups?.notificationStatus as string}
            refetch={onRefresh}
            communityGroupTitle={communityGroups?.title || ""}
            communityName={communityGroups?.communityId?.name || ""}
          />
        ) : error && (error as AxiosError).response?.status === 401 ? (
          <EmptyStateCard
            imageWidth={126}
            imageHeight={158}
            SvgComponent={NotMember}
            title="You are not a member of this group"
            description="This group is for members only. Become a member to access exclusive content and discussions."
          />
        ) : null}
      </View>
    ),
    [
      imageSrc,
      logoSrc,
      isGroupOfficial,
      isGroupPrivate,
      communityGroups?.status,
      isUserJoinedCommunityGroup,
      isGroupAdmin,
      isUserVerifiedForCommunity,
      isJoinCommunityPending,
      logoSrcErr,
      ImageSrcErr,
      communityGroups,
      userStatus,
      isCommunityGroupLive,
      pendingPostCount,
      filterPostBy,
      communityId,
      error,
    ]
  );

  return (
    <SafeAreaView className="bg-white flex-1">
      {isCommunityGroupError ? (
        <ErrorContainer
          title={MESSAGES.GROUP_NOT_FOUND}
          description={MESSAGES.GROUP_NOT_FOUND_DESCRIPTION}
        />
      ) : (
        <>
          {(showCreatePostButton || lastScrollY == 0) &&
            isCommunityGroupLive && (
              <CreatePostButton
                isAllowed={isUserJoinedCommunityGroup || isGroupAdmin}
                onPress={() =>
                  navigation.navigate("NewGroupPost", {
                    communityId,
                    communityGroupId,
                    communityGroupAdminId:
                      communityGroups?.adminUserId.toString(),
                    isGroupOfficial,
                  })
                }
              />
            )}
          {isFetching ? (
            <Refresh />
          ) : (
            <FlatList
              data={communityGroupPostDatas}
              style={{
                width: "100%",
                height: "100%",
              }}
              keyExtractor={(item, index) => item?._id + index}
              onScroll={handleScroll}
              renderItem={({ item }) =>
                error ? (
                  <View></View>
                ) : filterPostBy ===
                  Object.keys(AllFiltersCommunityGroupPost)[1] ? (
                  <CommunityGroupPendingPostCard
                    data={item}
                    isTimeline={false}
                    communityGroupId={communityGroupId}
                    isSinglePost={false}
                    communityGroupAdminId={
                      communityGroups?.adminUserId as string
                    }
                    postStatus={item?.postStatus as communityPostStatus}
                  />
                ) : (
                  <PostCard
                    data={item}
                    isTimeline={false}
                    communityGroupId={communityGroupId}
                    isSinglePost={false}
                    filterPostBy={filterPostBy}
                  />
                )
              }
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              onEndReached={() => {
                if (
                  communityPostHasNextPage &&
                  !communityPostIsFetchingNextPage
                ) {
                  communityPostNextpage();
                }
              }}
              ListFooterComponent={
                communityPostIsFetchingNextPage && communityPostHasNextPage ? (
                  <View>
                    <ActivityIndicator size="large" color="#7367f0" />
                  </View>
                ) : (
                  <View />
                )
              }
              ListHeaderComponent={FlatListHeaderWithError}
              ListEmptyComponent={
                isFetching || isLoading ? (
                  <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#7367f0" />
                  </View>
                ) : error ? null : !isCommunityGroupLive ? null : communityGroupPostDatas?.length ===
                    0 &&
                  filterPostBy ===
                    Object.keys(AllFiltersCommunityGroupPost)[1] &&
                  communityGroups?.adminUserId.toString() ==
                    userData?.id?.toString() ? (
                  <View className="flex-1 justify-center items-center">
                    <EmptyStateCard
                      imageWidth={226}
                      imageHeight={158}
                      SvgComponent={notPendingNoPostPlaceholder}
                      title="You are all done!"
                      description="No pending posts requests at the moment."
                    />
                  </View>
                ) : (
                  <View className="flex-1 justify-center items-center">
                    <EmptyStateCard
                      imageWidth={226}
                      imageHeight={158}
                      SvgComponent={NoPostFromGroup}
                      title="No Posts from Group."
                      description="No posts in this group yet. Once members start sharing, you’ll see them here."
                    />
                  </View>
                )
              }
            />
          )}

          <ActionSheet
            useBottomSafeAreaPadding
            ref={membersBottomSheet}
            gestureEnabled={true}
            safeAreaInsets={insets}
            // snapPoints={[70, 100]}
            containerStyle={{
              paddingTop: 10,
            }}
          >
            <CommunityGroupMembersModal
              users={CommunityGroupMember || []}
              communityGroupId={communityGroupId}
              isGroupAdmin={
                communityGroups?.adminUserId.toString() ===
                userData?.id?.toString()
              }
              adminId={communityGroups?.adminUserId as string}
              hideBottomBar={hideBottomBar}
            />
          </ActionSheet>
          <CommunityGroupActionModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            isAdmin={isGroupAdmin}
            onEdit={() => handleNavigateToEditCommunityGroupScreen()}
            onLeave={() => handleToggleJoinCommunityGroup()}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default CommunityGroupScreen;

const styles = StyleSheet.create({
  flatListStyle: {
    width: "100%",
    height: "100%",
  },
  tabsContainer: {
    paddingBottom: 32,
  },
});
