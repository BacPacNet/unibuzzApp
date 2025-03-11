import { useCommunityContext } from "@/context/CommunityProvider/CommunityProvider";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
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
import { getUserStore } from "@/storage/user";
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

type NavigationProp = StackNavigationProp<RootStackParamList, "CommunityGroup">;
const CommunityGroupScreen = ({ route }: any) => {
  const navigation = useNavigation<NavigationProp>();
  const { communityId, communityGroupId } = route.params;
  const { setCurrentCommunityId } = useCommunityContext();
  const userData = getUserStore();

  const { data: communityGroups } = useGetCommunityGroup(
    communityId,
    communityGroupId
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
    []
  );

  const [isGroupAdmin, setIsGroupAdmin] = useState(false);
  const [imageSrc, setImageSrc] = useState(
    // communityGroups?.communityGroupLogoCoverUrl?.imageUrl
    communityGroups?.communityGroupLogoUrl?.imageUrl
  );
  const [ImageSrcErr, setImageSrcErr] = useState(false);
  const [logoSrc, setLogoSrc] = useState(
    // communityGroups?.communityGroupLogoUrl?.imageUrl
    communityGroups?.communityGroupLogoCoverUrl?.imageUrl
  );
  const [logoSrcErr, setLogoSrcErr] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
      setCurrentCommunityId(communityId);

      return () => {
        setCurrentCommunityId("");
      };
    }, [communityId])
  );

  useEffect(() => {
    if (communityGroups && userData) {
      const { id } = userData;
      setIsGroupAdmin(
        communityGroups.adminUserId.toString() === id?.toString()
      );
    }
  }, [communityGroups, userData]);

  useEffect(() => {
    if (communityGroups && userData) {
      setIsUserJoinedCommunityGroup(
        communityGroups?.users?.some(
          (user) => user.userId.toString() === userData?.id
        )
      );
    }
  }, [communityGroups]);

  useEffect(() => {
    setLogoSrcErr(false);
    setImageSrcErr(false);
    if (communityGroups) {
      setLogoSrc(communityGroups?.communityGroupLogoUrl?.imageUrl);
      setImageSrc(
        "https://cdn.pixabay.com/photo/2017/08/20/12/13/architecture-2661547_1280.jpg"
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
      (page) => page?.finalPost
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
        },
      });
    }
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
            {logoSrc?.length && !logoSrcErr ? (
              <Image
                source={{ uri: logoSrc }}
                style={styles.communityImage}
                onError={() => setLogoSrcErr(true)}
              />
            ) : (
              <View style={styles.communityImagePlaceHolder}>
                <UniversityLogoPlaceHolder width={40} height={40} />
              </View>
            )}

            <Text style={styles.title}>{communityGroups?.title}</Text>
          </View>
          <Text style={styles.description}>{communityGroups?.description}</Text>
          <Text style={styles.members}>
            {communityGroups?.users.length} members
          </Text>

          <TouchableOpacity
            disabled={isJoinCommunityPending || isLeaveCommunityPending}
            onPress={() => handleToggleJoinCommunityGroup()}
            style={[
              styles.button,
              !isUserJoinedCommunityGroup && styles.active,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                !isUserJoinedCommunityGroup && styles.buttonTextActive,
              ]}
            >
              {isJoinCommunityPending || isLeaveCommunityPending ? (
                <ActivityIndicator />
              ) : !isUserJoinedCommunityGroup ? (
                "Join Group"
              ) : (
                "Leave Group"
              )}
            </Text>
          </TouchableOpacity>
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

  communityImage: {
    width: 46,
    height: 46,
    borderRadius: 200,
    elevation: 4,
    overflow: "hidden",
  },
  communityImagePlaceHolder: {
    width: 46,
    height: 46,
    borderRadius: 200,

    overflow: "hidden",
  },
});
