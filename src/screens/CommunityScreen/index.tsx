import { useCommunityContext } from "@/context/CommunityProvider/CommunityProvider";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
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

import {
  useGetCommunity,
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
import CreatePostButton from "@/components/atoms/CreatePostButton";
import CommunityLogo from "@/components/atoms/LogoHolder";
import { AxiosError } from "axios";
import EmptyStateCard from "@/components/molecules/EmptyStateCard";
import NotMember from "@/assets/placeHolder/joinGroup.svg";
import NoUniversityPost from "@/assets/placeHolder/noUniversityPost.svg";
import BackHeader from "@/components/atoms/BackHeader";
type NavigationProp = StackNavigationProp<RootStackParamList, "Community">;

const CommunityScreen = ({ route }: any) => {
  const navigation = useNavigation<NavigationProp>();
  const { communityId } = route.params;
  const { setCurrentCommunityId } = useCommunityContext();
  const userData = getUserStore();

  const { data: communityData, isFetching } = useGetCommunity(communityId);
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
  const [isUserJoinedCommunity, setIsUserJoinedCommunity] = useState<
    boolean | null
  >(null);
  const [imageSrc, setImageSrc] = useState(
    communityData?.communityCoverUrl?.imageUrl,
  );
  const [ImageSrcErr, setImageSrcErr] = useState(false);
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
    // setLogoSrcErr(false);
    setImageSrcErr(false);
    if (communityData) {
      setImageSrc(communityData?.communityCoverUrl?.imageUrl);
    }
  }, [communityData]);

  useEffect(() => {
    if (communityData && userData) {
      setIsUserJoinedCommunity(
        communityData.users.some(
          (user) => user?._id?.toString() === userData.id,
        ),
      );
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
      joinCommunity(communityId, {});
    } else {
      leaveCommunity(communityId, {});
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    queryClient.invalidateQueries({
      queryKey: ["communityGroupsPost", communityId, ""],
    });
    queryClient.invalidateQueries({
      queryKey: ["community"],
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
            <CommunityLogo
              logoUrl={communityData?.communityLogoUrl?.imageUrl || ""}
            />

            <Text style={styles.title}>{communityData?.name}</Text>
          </View>
          <Text style={styles.description}>{communityData?.about}</Text>

          <TouchableOpacity
            disabled={isJoinLoading || isLeaveLoading || isFetching}
            onPress={() => handleToggleJoinCommunity()}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {isJoinLoading || isLeaveLoading || isFetching ? (
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

  const handleBackToGroups = () => {
    navigation.navigate("manageGroupStack", {
        screen: "SearchCommunityGroupScreen",
  
        params: { communityId: communityId },
      });
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <CreatePostButton
        isAllowed={communityData?.adminId == userData?.id}
        onPress={() =>
          navigation.navigate("NewGroupPost", {
            communityId,
          })
        }
      />
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
            <PostCard data={item} isTimeline={false} isSinglePost={false} />
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
              <BackHeader isLeftPadding={false} label="University Groups" onPress={handleBackToGroups}  />
            <FlatListCommunityHeaderSec />

            {!isUserJoinedCommunity && (
              <EmptyStateCard
                imageWidth={320}
                imageHeight={171}
                SvgComponent={NotMember}
                title="Join University Community"
                description="Join this community to access its groups and connect with fellow university members"
              />
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
              {isUserJoinedCommunity && (
                <EmptyStateCard
                  imageWidth={320}
                  imageHeight={171}
                  SvgComponent={NoUniversityPost}
                  title="No Posts from University."
                  description="Your university admins will share important updates here when the time comes. Stay tuned!"
                />
              )}
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default CommunityScreen;

const styles = StyleSheet.create({
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
    padding: 16,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
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
    fontSize: 14,
    color: "#6B7280",
    marginVertical: 16,
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

  universityPlaceHolder: {
    width: 40,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
