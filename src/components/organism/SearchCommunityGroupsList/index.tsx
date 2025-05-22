// import UniversityLogoPlaceHolder from "@/assets/unibuzz_rounded.svg";
import UniversityLogoPlaceHolder from "@/assets/avatarPlaceholder.png";
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

const SearchCommunityGroupList: React.FC<{
  data: any;

  isFetching: boolean;
  handleNavigateToGroup: any;
}> = ({
  data,

  isFetching,
  handleNavigateToGroup,
}) => {
  const CommunityHolder = ({ item }: any) => {
    const [imageError, setImageError] = useState(false);

    const imageUrl = item?.communityGroupLogoUrl?.imageUrl;

    return (
      <TouchableOpacity
        onPress={() => handleNavigateToGroup(item)}
        style={styles.communityContainer}
      >
        <View style={styles.innerContainer}>
          <Image
            source={
              !imageUrl || imageError
                ? UniversityLogoPlaceHolder
                : { uri: imageUrl }
            }
            style={styles.communityImage}
            onError={() => setImageError(true)}
          />
          <View style={styles.textContainer}>
            <Text style={styles.communityName}>{item?.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isFetching)
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );

  if (data?.length === 0) {
    return (
      <View className="py-4 ">
        <Text className="text-center">No Result Found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => item?._id + index}
      initialNumToRender={10}
      renderItem={({ item }) => <CommunityHolder item={item} />}
      getItemLayout={(_, index) => ({ length: 80, offset: 80 * index, index })}
      removeClippedSubviews
      //   refreshing={isUserProfilesLoading}
      //   refreshControl={
      //     <RefreshControl
      //       refreshing={isUserProfilesLoading}
      //       onRefresh={handleRefresh}
      //     />
      //   }
    />
  );
};

export default SearchCommunityGroupList;

const styles = StyleSheet.create({
  communityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    height: 86,
    borderBottomWidth: 2,
    borderBlockColor: "#D4D4D4",
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  activeCommunity: {
    backgroundColor: "#f0f0f0",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  communityImage: {
    width: 46,
    height: 46,
    borderRadius: 200,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: "80%",
  },
  communityName: {
    fontSize: 14,
    color: "#3A3B3C",
  },
});
