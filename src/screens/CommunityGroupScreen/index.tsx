import { useCommunityContext } from "@/context/CommunityProvider/CommunityProvider";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
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
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import UniversityLogoPlaceHolder from "@/assets/unibuzz_rounded.svg";
import {
  useGetCommunity,
  useGetCommunityGroupPost,
  useJoinCommunity,
  useLeaveCommunity,
} from "@/services/university-community";
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
import { CommunityGroupMembersModal } from "@/components/molecules/CommunityMembersModal";
import JoinGroupButton from "@/components/atoms/JoinGroupButton";
import {
  CommunityGroupTypeEnum,
  CommunityGroupVisibility,
  status,
} from "@/types/CommunityGroup";
import ReusableButton from "@/components/atoms/ReusableButton";
import CommunityGroupActionModal from "@/components/molecules/CommunityGroupActionModal";

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
    communityGroups?.communityGroupLogoUrl?.imageUrl,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [ImageSrcErr, setImageSrcErr] = useState(false);
  const [logoSrc, setLogoSrc] = useState(
    communityGroups?.communityGroupLogoCoverUrl?.imageUrl,
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
      setLogoSrc(communityGroups?.communityGroupLogoUrl?.imageUrl);
      setImageSrc(
        "https://cdn.pixabay.com/photo/2017/08/20/12/13/architecture-2661547_1280.jpg",
      );
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
          hideBottomBar();
        },
      });
    }
  };

  const hideBottomBar = () => {
    membersBottomSheet.current?.hide();
  };

  const FlatListCommunityHeaderSec = () => {
    return (
      <View style={styles.card}>
        {imageSrc?.length && !ImageSrcErr ? (
          <Image
            source={{ uri: imageSrc }}
            style={styles.image}
            onError={() => setImageSrcErr(true)}
          />
        ) : (
          <Image
            source={{
              uri: "https://cdn.pixabay.com/photo/2017/08/20/12/13/architecture-2661547_1280.jpg",
            }}
            style={styles.image}
            onError={() => setImageSrcErr(true)}
          />
        )}

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <View style={styles.innerContainer}>
              <View style={styles.imageContainer}>
                {logoSrc?.length && !logoSrcErr ? (
                  <View
                    style={[
                      styles.imageWrapper,
                      isGroupOfficial && styles.officialBorder,
                    ]}
                  >
                    <Image
                      source={{ uri: logoSrc }}
                      style={styles.communityImage}
                    />
                  </View>
                ) : (
                  <View
                    style={[
                      styles.imageWrapper,
                      isGroupOfficial && styles.officialBorder,
                    ]}
                  >
                    <View style={styles.universityPlaceHolder}>
                      <UniversityLogoPlaceHolder
                        width={20}
                        height={20}
                        style={styles.communityImage}
                      />
                    </View>
                  </View>
                )}
                {isGroupOfficial && (
                  <View style={styles.badgeWrapper}>
                    <UniversityLogoPlaceHolder
                      width={12}
                      height={12}
                      style={styles.badgeImage}
                    />
                  </View>
                )}
              </View>
            </View>
            <Text style={styles.title}>{communityGroups?.title}</Text>
          </View>

          <Text style={styles.description}>{communityGroups?.description}</Text>

          <TouchableOpacity onPress={() => membersBottomSheet.current?.show()}>
            <Text style={styles.members}>
              {communityGroups?.users.length} members
            </Text>
          </TouchableOpacity>

          {isUserJoinedCommunityGroup || isGroupAdmin ? (
            <ReusableButton
              buttonText="Settings"
              variant="shade"
              size="w-1/2"
              containerStyle="mt-2"
              onPress={() => setModalVisible(true)}
            />
          ) : (
            <JoinGroupButton
              isPrivate={isGroupPrivate}
              isVerified={isUserVerifiedForCommunity}
              //   isPending={isJoinCommunityPending}
              isPending={isJoinCommunityPending}
              userStatus={userStatus}
              onClick={() => handleToggleJoinCommunityGroup()}
            />
          )}
        </View>
      </View>
    );
  };

  const Refresh = () => {
    return (
      <View className="flex-1 bg-white flex justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  };
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
          renderItem={({ item }) => (
            <PostCard
              data={item}
              isTimeline={false}
              communityGroupId={communityGroupId}
            />
          )}
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
          ListHeaderComponent={<FlatListCommunityHeaderSec />}
          ListEmptyComponent={
            isFetching || isLoading ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#7367f0" />
              </View>
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
  card: {
    backgroundColor: "#fff",

    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
  },
  flatListStyle: {
    width: "100%",
    height: "100%",
  },
  content: {
    padding: 15,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3A3B3C",
    width: "60%",
    minWidth: 200,
    maxWidth: 250,
  },
  aiPowered: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  description: {
    fontSize: 12,
    color: "#6B7280",
    marginVertical: 8,
  },
  members: {
    fontWeight: "bold",
    color: "#6744FF",
    fontSize: 12,
  },
  button: {
    borderWidth: 2,
    borderColor: "#E5E7EB",
    padding: 10,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
    height: 40,
    width: 163,
  },
  deActive: {
    backgroundColor: "white",
  },

  active: {
    backgroundColor: "#6744FF",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonTextActive: {
    color: "white",
  },

  //   communityImage: {
  //     width: 46,
  //     height: 46,
  //     borderRadius: 200,
  //     elevation: 4,
  //     overflow: "hidden",
  //   },
  communityImagePlaceHolder: {
    width: 46,
    height: 46,
    borderRadius: 200,

    overflow: "hidden",
  },

  officialBorder: {
    borderWidth: 2,
    borderColor: "#6647ff",
  },
  imageWrapper: {
    padding: 4,
    backgroundColor: "#fff",
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  communityImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "cover",
  },

  imageContainer: {
    position: "relative",
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeWrapper: {
    position: "absolute",
    bottom: -10,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#6647ff",
    justifyContent: "center",
    alignItems: "center",
  },

  badgeImage: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  universityPlaceHolder: {
    width: 40,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
