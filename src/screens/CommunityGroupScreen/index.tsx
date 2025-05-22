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
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useGetCommunityGroupPost } from "@/services/university-community";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getUserProfileStore, getUserStore } from "@/storage/user";
import { SafeAreaView } from "react-native-safe-area-context";
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
  CommunityGroupTypeEnum,
  CommunityGroupVisibility,
  status,
} from "@/types/CommunityGroup";
import CommunityGroupActionModal from "@/components/molecules/CommunityGroup/CommunityGroupActionModal";
import FlatListCommunityHeader from "@/components/molecules/CommunityGroup/CommunityGroupHeaderFlatList";
import { Refresh } from "@/components/atoms/RefreshSpinner";

type NavigationProp = StackNavigationProp<RootStackParamList, "CommunityGroup">;

const CommunityGroupScreen = ({ route }: any) => {
  const navigation = useNavigation<NavigationProp>();
  const { communityId, communityGroupId } = route.params;
  const { setCurrentCommunityId } = useCommunityContext();
  const userData = getUserStore();
  const userProfileData = getUserProfileStore();
  const membersBottomSheet = useRef<ActionSheetRef>(null);
  const insets = useSafeAreaInsets();

  const { data: communityGroups } = useGetCommunityGroup(
    communityId,
    communityGroupId,
  );

  const { mutate: joinCommunityGroup, isPending: isJoinCommunityPending } =
    useJoinCommunityGroup();
  const { mutate: leaveCommunityGroup, isPending: isLeaveCommunityPending } =
    useLeaveCommunityGroup();
  const [isUserJoinedCommunityGroup, setIsUserJoinedCommunityGroup] = useState<
    boolean | null
  >(null);

  const {
    data: communityGroupPost,
    fetchNextPage: communityPostNextpage,
    isFetchingNextPage: communityPostIsFetchingNextPage,
    hasNextPage: communityPostHasNextPage,
    isLoading,
    error,
    isFetching,
    dataUpdatedAt,
  } = useGetCommunityGroupPost(communityId, communityGroupId, true, 10);
  const [communityGroupPostDatas, setCommunityGroupPostDatas] = useState<any>(
    [],
  );

  const [isGroupAdmin, setIsGroupAdmin] = useState(false);
  const [imageSrc, setImageSrc] = useState(
    communityGroups?.communityGroupLogoCoverUrl?.imageUrl || "",
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [ImageSrcErr, setImageSrcErr] = useState(false);
  const [logoSrc, setLogoSrc] = useState(
    communityGroups?.communityGroupLogoUrl?.imageUrl || "",
  );
  const [logoSrcErr, setLogoSrcErr] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const queryClient = useQueryClient();

  const isGroupOfficial =
    communityGroups?.communityGroupType === CommunityGroupTypeEnum.OFFICIAL;
  const isGroupPrivate =
    communityGroups?.communityGroupAccess === CommunityGroupVisibility.PRIVATE;
  const isUserVerifiedForCommunity = useMemo(() => {
    return (
      userProfileData?.email?.some(
        (email) => email.communityId === communityGroups?.communityId?._id,
      ) || false
    );
  }, [userProfileData, communityGroups]);
  const userStatus = useMemo(() => {
    return communityGroups?.users?.find(
      (user) => user.userId === userProfileData?.users_id,
    )?.status as status;
  }, [communityGroups, userProfileData]);

  useFocusEffect(
    useCallback(() => {
      setCurrentCommunityId(communityId);

      return () => {
        setCurrentCommunityId("");
      };
    }, [communityId]),
  );

  useEffect(() => {
    if (communityGroups && userData) {
      const { id } = userData;
      setIsGroupAdmin(
        communityGroups.adminUserId.toString() === id?.toString(),
      );
    }
  }, [communityGroups, userData]);

  useEffect(() => {
    if (communityGroups && userData) {
      setIsUserJoinedCommunityGroup(
        communityGroups.users.some(
          (item) =>
            item.userId.toString() === userData.id && item.isRequestAccepted,
        ),
      );
    }
  }, [communityGroups, userData, setIsGroupAdmin]);

  useEffect(() => {
    setLogoSrcErr(false);
    setImageSrcErr(false);
    if (communityGroups) {
      setLogoSrc(communityGroups?.communityGroupLogoUrl?.imageUrl || "");
      setImageSrc(communityGroups?.communityGroupLogoCoverUrl?.imageUrl || "");
    }
  }, [communityGroups]);

  useEffect(() => {
    if (isFetching) {
      setCommunityGroupPostDatas([]);
    }
  }, [isFetching, queryClient]);

  useEffect(() => {
    const communityDatas: any = communityGroupPost?.pages.flatMap(
      (page) => page?.finalPost,
    );
    setCommunityGroupPostDatas(communityDatas);
  }, [communityGroupPost, dataUpdatedAt]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    queryClient.invalidateQueries({
      queryKey: ["communityGroupsPost", communityId, communityGroupId],
    });
    setRefreshing(false);
  }, []);

  const handleToggleJoinCommunityGroup = () => {
    if (communityGroups?.adminUserId == userData?.id) {
      setModalVisible(false);
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

  const hideBottomBar = () => {
    membersBottomSheet.current?.hide();
  };

  const FlatListHeaderWithError = () => (
    <View>
      <FlatListCommunityHeader
        imageSrc={imageSrc}
        logoSrc={logoSrc}
        isGroupOfficial={isGroupOfficial}
        isGroupPrivate={isGroupPrivate}
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
      />
      {error && (
        <View
          style={{
            padding: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "red" }}>
            {(error as any)?.response?.data?.message || "Something went wrong"}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="bg-white flex-1">
      <View style={styles.plusButtonContainer}>
        {isUserJoinedCommunityGroup && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("NewGroupPost", {
                communityId,
                communityGroupId,
              })
            }
            style={styles.createButton}
          >
            <Text style={{ color: "white", fontSize: 24 }}>+</Text>
          </TouchableOpacity>
        )}
      </View>
      {isFetching ? (
        <Refresh />
      ) : (
        <FlatList
          data={communityGroupPostDatas}
          style={styles.flatListStyle}
          keyExtractor={(item, index) => item?._id + index}
          renderItem={({ item }) =>
            error ? (
              <View></View>
            ) : (
              <PostCard
                data={item}
                isTimeline={false}
                communityGroupId={communityGroupId}
              />
            )
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={() => {
            if (communityPostHasNextPage && !communityPostIsFetchingNextPage) {
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
          ListHeaderComponent={<FlatListHeaderWithError />}
          ListEmptyComponent={
            isFetching || isLoading ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#7367f0" />
              </View>
            ) : error ? (
              <View></View>
            ) : (
              <View className="flex-1 justify-center items-center">
                <Text>No Result Found</Text>
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
          users={communityGroups?.users || []}
          communityGroupId={communityGroupId}
          isGroupAdmin={
            communityGroups?.adminUserId.toString() === userData?.id?.toString()
          }
          hideBottomBar={hideBottomBar}
        />
      </ActionSheet>
      <CommunityGroupActionModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        isAdmin={isGroupAdmin}
        onLeave={() => handleToggleJoinCommunityGroup()}
      />
    </SafeAreaView>
  );
};

export default CommunityGroupScreen;

const styles = StyleSheet.create({
  plusButtonContainer: {
    position: "absolute",
    right: 20,
    top: "80%",
    zIndex: 200,
  },
  createButton: {
    backgroundColor: "#6744FF",
    padding: 15,
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  flatListStyle: {
    width: "100%",
    height: "100%",
  },
});
