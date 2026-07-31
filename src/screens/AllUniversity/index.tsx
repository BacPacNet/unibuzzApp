import React, { useCallback, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  BackHandler,
} from "react-native";
import { ArrowUp } from "iconoir-react-native";
import DiscoverUniversityCard from "@/components/molecules/University/UniversityCard";
import {
  useGetFilteredUniversity,
  useGetPartnerUniversities,
} from "@/services/universitySearch";
import UniversitySearchFilters, {
  UniversitySearchFiltersRef,
} from "@/components/molecules/University/UniversityFilters";
import { RefreshControl } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const AllUniversities = () => {
  const navigation = useNavigation<NavigationProp>();
  const [query, setQuery] = useState<any>();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const universityFiltersRef = React.useRef<UniversitySearchFiltersRef>(null);

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
    refetch,
  } = useGetFilteredUniversity(5, query);

  const { data: partnerUniversities, refetch: refetchPartners } =
    useGetPartnerUniversities();

  const filteredUniversities =
    data?.pages?.flatMap((page) => page.Universities) ?? [];

  const partnerIds = new Set(
    partnerUniversities?.map((u: { _id: string }) => u._id) ?? [],
  );

  const listData = isLoading
    ? []
    : [
        ...(partnerUniversities ?? []),
        ...filteredUniversities.filter(
          (u: { _id: string }) => !partnerIds.has(u._id),
        ),
      ];

  useFocusEffect(
    useCallback(() => {
      const onHardwareBackPress = () => {
        const state = navigation.getState();
        const previousRoute = state?.routes?.[state.index - 1];

        if (previousRoute?.name === "University") {
          const fromBlogs =
            (previousRoute.params as { from?: string } | undefined)?.from ===
            "blogs";

          navigation.reset({
            index: 0,
            routes: [{ name: "Discover" }],
          });

          if (fromBlogs) {
            navigation.navigate("Blogs");
          }

          return true;
        }

        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onHardwareBackPress,
      );

      return () => subscription.remove();
    }, [navigation]),
  );

  const renderItem = ({ item }: any) => (
    <DiscoverUniversityCard
      data={item}
      isPartnerUniversity={partnerIds.has(item._id)}
    />
  );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;

    setShowScrollTop(contentOffset.y > layoutMeasurement?.height / 2);
  };

  const flatListRef = React.useRef<FlatList>(null);

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);

    universityFiltersRef.current?.handleReset();
    setQuery("");

    await Promise.all([refetch(), refetchPartners()]);

    setRefreshing(false);
  }, [refetch, refetchPartners]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={listData}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <UniversitySearchFilters
            ref={universityFiltersRef}
            setQuery={setQuery}
          />
        }
        ListFooterComponent={
          isFetchingNextPage && !isLoading && hasNextPage ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#7367f0" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#7367f0" />
            </View>
          ) : !listData.length ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No Result Found</Text>
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {showScrollTop && (
        <TouchableOpacity style={styles.scrollTopButton} onPress={scrollToTop}>
          <ArrowUp width={24} height={24} color={"#6744FF"} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 128,
  },
  emptyText: {
    fontWeight: "700",
    fontSize: 24,
    color: "#171717",
    textAlign: "center",
  },
  scrollTopButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 30,
    elevation: 5,
  },
});

export default AllUniversities;
