import { useCommunityContext } from "@/context/CommunityProvider/CommunityProvider";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UniversityLogoPlaceHolder from "@/assets/unibuzz_rounded.svg";
import {
  useGetCommunity,
  useGetCommunityGroupPost,
  useGetCommunityPost,
  useJoinCommunity,
  useLeaveCommunity,
} from "@/services/university-community";
import { getUserStore } from "@/storage/user";
import { SafeAreaView } from "react-native-safe-area-context";
import PostCard from "@/components/molecules/Timeline/PostCard";
import { useQueryClient } from "@tanstack/react-query";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";

type NavigationProp = StackNavigationProp<RootStackParamList, "Community">;

const CommunityScreen = ({ route }: any) => {
  const navigation = useNavigation<NavigationProp>();
  const { communityId } = route.params;
  const { setCurrentCommunityId } = useCommunityContext();
  const userData = getUserStore();

  const { data: communityData } = useGetCommunity(communityId);
  const { mutate: joinCommunity, isPending: isJoinLoading } =
    useJoinCommunity();
  const { mutate: leaveCommunity, isPending: isLeaveLoading } =
    useLeaveCommunity();

  const {
    data: communityGroupPost,
    fetchNextPage: communityPostNextpage,
    isFetchingNextPage: communityPostIsFetchingNextPage,
    hasNextPage: communityPostHasNextPage,
    error: communityPostError,
    dataUpdatedAt,
    isLoading,
  } = useGetCommunityPost(communityId, true, 10);
  const [communityDatas, setCommunityDatas] = useState<any>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  const [isUserJoinedCommunity, setIsUserJoinedCommunity] = useState<
    boolean | null
  >(null);
  const [imageSrc, setImageSrc] = useState(
    communityData?.communityCoverUrl?.imageUrl,
  );
  const [ImageSrcErr, setImageSrcErr] = useState(false);
  const [logoSrc, setLogoSrc] = useState(
    communityData?.communityLogoUrl?.imageUrl,
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
    }, [communityId]),
  );

  useEffect(() => {
    setLogoSrcErr(false);
    setImageSrcErr(false);
    if (communityData) {
      setLogoSrc(communityData?.communityLogoUrl?.imageUrl);
      setImageSrc(communityData?.communityCoverUrl?.imageUrl);
    }
  }, [communityData]);

  useEffect(() => {
    if (!hasInitialized && communityData && userData) {
      setIsUserJoinedCommunity(
        communityData.users.some(
          (user) => user?.id?.toString() === userData?.id,
        ),
      );
      setHasInitialized(true);
    }
  }, [communityData, userData]);

  useEffect(() => {
    const communityDatas: any = communityGroupPost?.pages.flatMap(
      (page) => page?.finalPost,
    );
    setCommunityDatas(communityDatas);
  }, [communityGroupPost, dataUpdatedAt]);

  const handleToggleJoinCommunity = () => {
    if (!isUserJoinedCommunity) {
      joinCommunity(communityId, {
        onSuccess: () => {
          setIsUserJoinedCommunity(true);
        },
      });
    } else {
      leaveCommunity(communityId, {
        onSuccess: () => {
          setIsUserJoinedCommunity(false);
        },
      });
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    queryClient.invalidateQueries({
      queryKey: ["communityGroupsPost", communityId, ""],
    });
    setRefreshing(false);
  }, []);

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
            <View style={styles.imageWrapper}>
              {logoSrc?.length && !logoSrcErr ? (
                <Image
                  source={{ uri: communityData?.communityLogoUrl?.imageUrl }}
                  style={styles.communityImage}
                  onError={() => setLogoSrc("")}
                />
              ) : (
                <View style={styles.universityPlaceHolder}>
                  <UniversityLogoPlaceHolder
                    width={20}
                    height={20}
                    style={styles.communityImage}
                  />
                </View>
              )}
            </View>

            <Text style={styles.title}>{communityData?.name}</Text>
            {/* <Text style={styles.aiPowered}>AI POWERED</Text> */}
          </View>
          <Text style={styles.description}>{communityData?.about}</Text>

          {/* <Text style={styles.members}>
            {communityData?.users.length} members
          </Text> */}
          <TouchableOpacity
            disabled={isJoinLoading || isLeaveLoading}
            onPress={() => handleToggleJoinCommunity()}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {isJoinLoading || isLeaveLoading ? (
                <ActivityIndicator />
              ) : !isUserJoinedCommunity ? (
                "Join Community"
              ) : (
                "Leave Community"
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //   if (isFetching) {
  //     return (
  //       <View className="flex-1 bg-white flex justify-center items-center">
  //         <ActivityIndicator />
  //       </View>
  //     );
  //   }

  return (
    <SafeAreaView className="bg-white flex-1">
      <View style={styles.plusButtonContainer}>
        {communityData?.adminId == userData?.id && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("NewGroupPost", {
                communityId,
              })
            }
            style={styles.createButton}
          >
            <Text style={{ color: "white", fontSize: 24 }}>+</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        // data={communityDatas}
        data={isUserJoinedCommunity || communityPostError ? communityDatas : []}
        style={{
          width: "100%",
          height: "100%",
        }}
        keyExtractor={(item, index) =>
          item?._id ? item._id.toString() : index.toString()
        }
        renderItem={({ item }) =>
          isUserJoinedCommunity ? (
            <PostCard data={item} isTimeline={false} />
          ) : (
            <Text></Text>
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
            <View></View>
          )
        }
        ListHeaderComponent={
          <>
            <FlatListCommunityHeaderSec />
            {!isUserJoinedCommunity && (
              <View style={{ padding: 16, alignItems: "center" }}>
                <Text>You need to join the community to see posts.</Text>
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#7367f0" />
            </View>
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text>{isUserJoinedCommunity && "No Result Found"}</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default CommunityScreen;

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

    // margin: 10,
  },
  image: {
    width: "100%",
    height: 200,
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
  buttonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "bold",
  },

  communityImagePlaceHolder: {
    width: 46,
    height: 46,
    borderRadius: 200,

    overflow: "hidden",
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
    resizeMode: "contain",
  },
  universityPlaceHolder: {
    width: 40,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
