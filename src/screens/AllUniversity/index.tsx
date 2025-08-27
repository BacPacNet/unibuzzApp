import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { ArrowUp } from "iconoir-react-native";
import DiscoverUniversityCard from "@/components/molecules/University/UniversityCard";
import { useGetFilteredUniversity } from "@/services/universitySearch";
import UniversitySearchFilters, {
  UniversitySearchFiltersRef,
} from "@/components/molecules/University/UniversityFilters";
import { RefreshControl } from "react-native";

const AllUniversities = () => {
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

  const renderItem = ({ item }: any) => <DiscoverUniversityCard data={item} />;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;

    setShowScrollTop(contentOffset.y > layoutMeasurement?.height / 2);
  };

  const flatListRef = React.useRef<FlatList>(null);

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    universityFiltersRef.current?.handleReset();

    setQuery("");
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data?.pages?.flatMap((page) => page.Universities) || []}
        keyExtractor={(item, index) => item._id + item?.index}
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
          ) : (
            <View style={styles.centered}>
              <Text className="text-neutral-500">No Result Found</Text>
            </View>
          )
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
